# Gallery: implementation plan

The `/gallery` prototype runs on a hand-written fixture
(`src/features/gallery/data/photos.ts`). This plan replaces that fixture with
real data from the image service, s3-image-upload-thing, and says where
collections and their photos are recorded.

Updated 2026-11-03, against the image service's `main` and this repo's `main`.
Progress is ticked off in #24.

## Where things stand

- **Manifests sit beside their images**: `{folder}/{name}/manifest.json`, schema
  1 (`shared/types/manifest.ts` in the uploader). They describe files: the real
  width, height, bytes and etag of every size, a 20px blur, and the source.
- **Six sizes**, each bounded on the longest edge: placeholder 20, thumbnail
  120, small 400, medium 800, large 1440, full 3840. Posts use small to large;
  full is for the lightbox only.
- **Originals are kept** at `{set}/original.{ext}`, private: the CDN denies
  `*/original.*` on both buckets. EXIF can be read from them at any time.
- **Strapi sets are migrated** into set folders under `legacy/` in the upload
  bucket, and the China 2024 post links them.
- **This repo reads manifests** (#8, #10): srcsets use real widths. A CDN image
  whose set has no manifest fails the build; images on other hosts render
  unmeasured.
- **Every set has a manifest.** The full backfill (uploader #9) wrote the
  manifests of the older layout.

## Decisions

- **Collections, not albums.** A collection has a name and a fixed slug, and
  holds an ordered list of photos.
- **One collection per photo; tags for anything cross-cutting.**
- **A collection exists only while it has photos.** It is created with its first
  sets, and a change that empties it removes it; deleting one means removing its
  photos.
- **`gallery/collections.json` is the source of truth.** One file in the upload
  bucket records every collection, its photos and their text. It stands in for
  a database for now; the upload server is its only writer.
- **Manifests stay machine-written**: sizes, blur and, later, EXIF. Pipeline,
  backfill and regeneration rewrite them, so nothing hand-edited lives there.
- **The admin edits collections through operations, not whole-file saves.**
  Each operation maps to one SQL statement, so SQLite can replace the file
  later without the admin or this site changing.
- **Static build, manual redeploy.** No incremental regeneration, so the
  build's checks always run before a change is live. Later, a bucket will be
  subscribed to the projects that use it, so a change redeploys them.
- **EXIF goes into the manifest only.** Public sizes stay stripped.
- **Folder paths and EXIF clustering do not decide collections.** Folders
  already disagree with them (Kamakura sits in `tokyo/day-4`).
- **Rejected:** a collection field in each manifest plus a generated index
  (manifests are rewritten by machines, and membership would be stored twice);
  YAML in this repo (the owner wants admin editing); a database or headless
  CMS now (more to run and back up than the data needs). SQLite on the upload
  server is the upgrade path if photos need several collections or projects
  subscribe to collections.

## Contract with the image service

Everything the gallery needs from s3-image-upload-thing, in one place. The site
reads it over the public CDN at build time, with no credentials. A change to
anything in this section is a change on both sides.

### Every set folder has a manifest

Once the full backfill (uploader #9) has run, **every set folder contains a
`manifest.json`**, and the uploader keeps it that way. From then on a set with
no manifest, or an unknown `schema`, fails the build. The probe, placeholder
generation and size table are gone (#10).

### URLs

| What        | URL                                           | Exists                    |
| ----------- | --------------------------------------------- | ------------------------- |
| Collections | `https://{host}/gallery/collections.json`     | no (phase 1)              |
| Manifest    | `https://{host}/{set}/manifest.json`          | yes, after #9 for all     |
| Size        | same folder + file name of `variants[v].key`  | yes                       |
| Download    | `{size URL}?download`, fetched in the browser | yes; needs CORS on images |

`{host}` is `NEXT_PUBLIC_S3_HOSTNAME`. Every set is served from the upload
bucket, so a set's CDN path is its bucket key.

### Set identity

A set is named by its **CDN path**, `{folder}/{name}`, for example
`japan-2025/tokyo/day-1/nkon-tokyo-d1-14` or `legacy/{name}`. The collections
file, a cover and the `?photo=` deep link all use it. Any admin operation that deletes or moves a set
updates the collections file in the same operation.

### `gallery/collections.json`

```ts
type CollectionsFile = {
  schema: 1;
  /** ISO 8601 time of the last write. */
  updatedAt: string;
  /** Display order of the collections. */
  collections: {
    /** `^[a-z0-9]+(-[a-z0-9]+)*$`, fixed after creation: site URLs use it. */
    slug: string;
    name: string;
    /** Related collections share a series; absent until phase 2. */
    series?: string;
    /** A post slug in this repo, checked at build; absent until phase 2. */
    post?: string;
    /** A set in this collection; the first photo when absent. */
    cover?: string;
    /** Display order. */
    photos: {
      set: string;
      alt: string | null;
      caption: string | null;
      tags: string[];
    }[];
  }[];
};
```

- A set appears at most once in the whole file.
- The uploader writes it with `Cache-Control: no-cache`. The CDN's cache policy
  has a 1-second minimum TTL, so a build after an edit reads the new file and
  no invalidation is needed.
- Before each write the uploader copies the current file to
  `gallery/history/collections-{timestamp}.json`, which is the undo trail.
  Bucket versioning is not used: it would keep every overwritten image too.

### Invariants the site relies on

- **A manifest exists only after every size is stored.**
- **Public sizes carry no EXIF.**
- **A missing collections file (404) means an empty gallery.** The uploader
  creates it empty, so it always exists and a 403 is a real access error. Any other
  failure to fetch it fails the build, so a CDN error never ships an empty
  gallery.
- **The site accepts manifest schema 2 before the uploader writes it.**

## Admin operations (uploader)

The server does every change as read, apply, validate and conditional write:
`PutObject` with `If-Match` on the ETag it read, so a write never replaces a
newer version. On a 412 it re-reads and re-applies by itself, so the admin
never sees a conflict.

| Operation                                                               | Does                                       | SQL later          | Phase |
| ----------------------------------------------------------------------- | ------------------------------------------ | ------------------ | ----- |
| `GET /storage/collections`                                              | All collections and photos                 | `SELECT`           | 1     |
| `POST /storage/collections` `{ name, sets }`                            | Create with its first sets; slug from name | `INSERT`           | 1     |
| `PUT /storage/collections/members` `{ sets, collection: slug / null }`  | Bulk add, move or clear any number of sets | `UPDATE … IN`      | 1     |
| `PATCH /storage/collections/members/:set` `{ alt, caption?, tags? }`    | Per-photo text                             | `UPDATE`           | 1     |
| `PATCH /storage/collections/:slug`, `DELETE /storage/collections/:slug` | Rename, cover; delete (series, post: 2.3)  | `UPDATE`, `DELETE` | 1     |
| `PUT /storage/collections/:slug/order`                                  | Reorder photos                             | `UPDATE`           | 1     |

Validation at the server: slug format, a body size cap, each set listed once,
set paths only under a known prefix (no `..`), the cover inside its own
collection, and upload-bucket sets that exist.

Managing collections in the admin is a per-bucket Collections modal, opened
from the actions bar beside Upload (1.7 to 1.9): it lists the collections that
hold a set from the selected bucket, and creates, renames and deletes them.
Creating one takes a folder or hand-picked sets. A collection's detail screen
shows 120px thumbnails with alt text and caption, and can remove a photo, set
the cover, reorder by native drag and add sets; a selected photo also shows its
sizes, inline blur and original.

The details panel keeps a per-set shortcut (1.3): a "Collection" dropdown
(existing collections, or "New collection…", which asks for a name) with an
alt-text field.

Every path calls the bulk operation. Each set still has one collection: moving
sets that are already filed lists them and asks to confirm.

## How the build assembles the gallery

1. Fetch `gallery/collections.json` (404 → empty gallery; any other failure
   fails the build).
2. Fetch each listed set's manifest, through the existing manifest reader.
3. Validate: each set listed once, its manifest exists, the cover is in its
   collection, `post` names a post. Missing alt text is a warning while
   collections are being filled, then an error.
4. Prerender `/gallery` as static HTML. Browsers only load image files from the
   CDN.

## What in PR #14 is coupled to that contract

The UI is not coupled: components only see `GalleryPhoto` and `GalleryCollection`.
The coupling is in the data layer, and each piece below is replaced rather than
edited.

| File or field                                  | Today                             | Becomes                                                                     | Needs      |
| ---------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------- | ---------- |
| `src/features/gallery/data/photos.ts`          | Hand-written fixture, sample EXIF | Deleted                                                                     | 1.5        |
| `src/features/gallery/data/albums.ts`          | Three hard-coded albums           | Deleted; collections come from the file                                     | 1.5        |
| `src/features/gallery/server/get-gallery.ts`   | Fixture                           | Collections file + manifests                                                | 1.5        |
| `GalleryAlbum`, "album" in UI copy and URLs    | Album                             | `GalleryCollection`, "collection"; the MDX `<Collection>` grid is unrelated | 1.6        |
| `GalleryPhoto.id`                              | Set **name**, unique only by luck | Set **CDN path**                                                            | 1.5        |
| `candidates`, `width`, `height`, `placeholder` | Manifest (was probe + size table) | Manifest `variants` and `placeholder`                                       | done (#8)  |
| `src` (lightbox)                               | `large`                           | Largest real size                                                           | #9         |
| `alt`, `caption`, `tags`                       | Fixture                           | Collections file                                                            | 1.5        |
| `takenAt`, `exif`, `location.geo`              | Fixture                           | Manifest schema 2                                                           | 3.x        |
| `isSample` and its notice                      | Flag on every fixture photo       | Deleted                                                                     | done (#28) |
| `title`, `location.label`                      | Fixture                           | Dropped until the place-name question is settled                            | —          |

## Phases

### 0. Every set has a manifest (runs alongside)

| #   | Repo      | Work                                                        | Depends on |
| --- | --------- | ----------------------------------------------------------- | ---------- |
| 0.1 | uploader  | #9 run the full backfill on the upload bucket               | —          |
| 0.2 | portfolio | #10 delete the probe, placeholder generation and size table | done (#10) |
| 0.3 | portfolio | #9 lightbox uses the largest real size                      | —          |

### 1. Collections, straightforward (both)

| #   | Repo      | Work                                                                                                                                             | Depends on |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 1.1 | uploader  | `collections.json` store: read, conditional write with retry, history copy, `no-cache`, validation, bucket-to-prefix mapping                     | —          |
| 1.2 | uploader  | Phase 1 operations: list, create, bulk members, per-photo text                                                                                   | 1.1        |
| 1.3 | uploader  | Details panel: Collection dropdown with "New collection…", and alt text                                                                          | 1.2        |
| 1.4 | uploader  | Superseded by 1.8's set picker (upload #53 closed)                                                                                               | —          |
| 1.5 | portfolio | Loader over the collections file and manifests, with build validation                                                                            | —          |
| 1.6 | portfolio | Rename album to collection, add the cover, and merge the prototype UI (PR #14)                                                                   | 1.5        |
| 1.7 | uploader  | Routes for rename, cover, delete and reorder (upload #57)                                                                                        | 1.2        |
| 1.8 | uploader  | Per-bucket Collections modal: collections holding a set from the selected bucket; create (by folder or hand-picked), rename, delete (upload #58) | 1.7        |
| 1.9 | uploader  | Collection detail: 120px thumbnails, alt text and caption, remove, set cover, native drag to reorder, add sets (upload #59)                      | 1.7, 1.8   |

1.5 can be built against a missing file (empty gallery) before the uploader side ships.
The cover can be set (1.9) and is the first photo while unset. Photo order is
set by reorder (1.9).

### 2. Collections, remaining admin work (uploader)

| #   | Work                                                       |
| --- | ---------------------------------------------------------- |
| 2.3 | Series and linked post on a collection                     |
| 2.4 | Upload modal: optional Collection dropdown, per-photo tags |
| 2.5 | Rename the explorer's `isImageCollection` to `isImageSet`  |

### 3. EXIF (both)

| #   | Repo      | Work                                                                |
| --- | --------- | ------------------------------------------------------------------- |
| 3.1 | portfolio | Accept manifest schema 2 alongside 1                                |
| 3.2 | uploader  | Schema 2: `takenAt` and `exif` read from the original at upload     |
| 3.3 | uploader  | Script: upgrade existing manifests to schema 2 from their originals |
| 3.4 | uploader  | Optional "Include location" at upload, rounded to about 100 m       |
| 3.5 | uploader  | "Sort by date taken" on a collection                                |

The 260 older sets have no original, so their EXIF needs your local files or a
re-upload (uploader #14).

### Later

- SQLite on the upload server, exporting the same file, if photos need several
  collections or projects subscribe to collections.
- Subscribe a bucket to the projects that use it, so a change redeploys them.
- Authentication on the upload server, and an admin-only CORS origin. It is
  reachable only over Tailscale today.

## Open questions

- Place names: written by hand per photo, or looked up from GPS at upload?
- Strapi photos have file names as alt text (`DSC_2346.webp`). The alt-text
  warning will list them.
- Tags: free text, or chosen from a list?
