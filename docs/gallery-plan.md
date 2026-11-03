# Gallery: implementation plan

The `/gallery` prototype runs on a hand-written fixture
(`src/features/gallery/data/photos.ts`). This plan replaces that fixture with
real data from the image service, s3-image-upload-thing, and says where albums
and their photos are defined.

Updated 2026-11-03, against the image service's `main` and this repo's `main`.

## Where things stand

- **Manifests sit beside their images**: `{folder}/{name}/manifest.json`, schema
  1 (`shared/types/manifest.ts` in the uploader). They describe files: the real
  width, height, bytes and etag of every size, a 20px blur, and the source.
- **Six sizes**, each bounded on the longest edge: placeholder 20, thumbnail
  120, small 400, medium 800, large 1440, full 3840. Posts use small to large;
  full is for the lightbox only.
- **Originals are kept** at `{set}/original.{ext}`, private: the CDN denies
  `*/original.*` on both buckets. EXIF can therefore be read after upload, at
  any time, from the original.
- **Strapi sets are migrated** into set folders in the Strapi bucket, served
  under `/legacy/`, and the China 2024 post links them.
- **This repo reads manifests** (#8): srcsets use real widths. A set with no
  manifest falls back to the build-time probe and logs `Image probed (no
manifest)`.
- **Not every set has a manifest yet.** 260 of 272 sets in the upload bucket
  are an older layout with no manifest, no full size and no original. The full
  backfill (uploader #9) writes their manifests.

## Decisions

- **A photo's album lives in its manifest, and nowhere else.** It is chosen at
  upload and can be changed at any time from the admin, which rewrites that
  manifest. A manifest with no album keeps the set out of the gallery, so the
  gallery stays curated by default.
- **YAML in this repo defines albums, not their photos**: title, series, linked
  post and cover. Each fact has one owner, so there are no merge rules.
- **One album per photo; tags for anything cross-cutting.** An album is where
  and when (a trip or a place); a tag is what the photo shows (`night`,
  `street`). Anything that would put a photo in two albums is a tag.
- **Per-photo text lives in the manifest too**: alt text, caption and tags,
  typed at upload or edited in the admin, like the album.
- **EXIF goes into the manifest only.** Public sizes stay stripped, so a
  downloaded file never carries the camera serial, exact time or GPS.
- **Folder paths and EXIF clustering do not decide albums.** Folders already
  disagree with albums (Kamakura sits in `tokyo/day-4`), and clustering by date
  or distance misfiles day trips and layovers.
- **Album changes go live on the next deploy**, started by hand for now. Later,
  a bucket will be subscribed to the projects that use it, so a change
  redeploys them; nothing here should get in the way of that.

## Contract with the image service

Everything the gallery needs from s3-image-upload-thing, in one place. The site
reads it over the public CDN at build time, with no credentials. A change to
anything in this section is a change on both sides.

### Every set folder has a manifest

Once the full backfill (uploader #9) has run, **every set folder contains a
`manifest.json`**, and the uploader keeps it that way: an upload writes the
manifest last, and nothing writes sizes without one. From then on:

- a set with no manifest, or an unknown `schema`, is an error, not a fallback;
- this repo deletes the probe, placeholder generation and the size table
  (#10).

Until then the probe fallback stays, and the build's `Image probed` warnings
list the sets the backfill has not reached.

### URLs

| What          | URL                                           | Exists                    |
| ------------- | --------------------------------------------- | ------------------------- |
| Set manifest  | `https://{host}/{prefix}{set}/manifest.json`  | yes, after #9 for all     |
| Size          | same folder + file name of `variants[v].key`  | yes                       |
| Gallery index | `https://{host}/{prefix}gallery/index.json`   | no (phase 3)              |
| Download      | `{size URL}?download`, fetched in the browser | yes; needs CORS on images |

`{host}` is `NEXT_PUBLIC_S3_HOSTNAME`. `{prefix}` is the bucket's CDN route:
empty for the upload bucket, `legacy/` for the Strapi bucket. Each bucket has
its own index at its root.

### Set identity

A set is named by its **CDN path**, `{prefix}{folder}/{name}`, for example
`japan-2025/tokyo/day-1/nkon-tokyo-d1-14` or `legacy/{name}`. The index, a
YAML cover and the `?photo=` deep link all use it. Moving or renaming a folder
breaks all three, so a folder is permanent once its set has an album.

### Manifest schema 2

Additive over schema 1. Every new field is present in the JSON, with `null`
meaning "looked, found nothing", so a reader can tell a missing value from an
old writer.

```ts
// `Manifest` is schema 1, from the uploader's `shared/types/manifest.ts`.
type ManifestV2 = Omit<Manifest, "schema"> & {
  schema: 2;
  /** EXIF `DateTimeOriginal` + `OffsetTimeOriginal` as ISO 8601, e.g. `2025-03-14T21:42:00+09:00`. No offset in the file → no `Z` is invented. */
  takenAt: string | null;
  /** Camera settings; `null` when the original had no EXIF. Units match `PhotoExif` in `src/features/gallery/types.ts`. */
  exif: {
    camera: string | null; // Make + Model, de-duplicated ("NIKON Z 6")
    lens: string | null;
    focalLength: number | null; // millimetres
    aperture: number | null; // FNumber, e.g. 2.8
    exposureTime: number | null; // seconds
    iso: number | null;
  } | null;
  /** Rounded to 3 decimal places before it is stored; `null` unless the upload opted in. */
  geo: { latitude: number; longitude: number } | null;
  /** Album slug, `^[a-z0-9]+(-[a-z0-9]+)*$`; `null` keeps the set out of the gallery. */
  album: string | null;
  alt: string | null;
  caption: string | null;
  tags: string[];
};
```

### Gallery index

`gallery/index.json` at each bucket's root, **generated, never edited by
hand**. It lists the sets that have an album, and nothing else, so it changes
only when an album does.

```ts
type GalleryIndex = {
  schema: 1;
  /** ISO 8601 time the index was written. */
  generatedAt: string;
  /** One entry per manifest whose `album` is not null. */
  sets: { set: string; album: string }[];
};
```

- **The manifests are the record; the index is a cache of them.** The uploader
  rewrites it whenever an album is set, changed or cleared, with a conditional
  write so two changes at once cannot overwrite each other, and a script
  rebuilds it from the manifests to create it and to repair drift.
- **A missing index (404) means "no albums yet"**, so either side can deploy
  first.
- The site never writes to it, and never lists a bucket.

### Invariants the site relies on

- **A manifest exists only after every size is stored.** The site never checks
  sizes one by one.
- **Public sizes carry no EXIF.** Everything the site shows comes from the
  manifest.
- **The site accepts schema 2 before the uploader writes it.** An unknown
  schema is treated as "no manifest", so the reverse order puts new uploads on
  the probe path, or fails the build once #10 has removed it.

## How the build assembles the gallery

1. Load the album YAML (Contentlayer).
2. Fetch `gallery/index.json` from each bucket.
3. Fetch each listed set's manifest, through the existing manifest reader.
4. Group by album; order each album by `takenAt`, newest first.
5. Validate, failing the build when an album in the index has no YAML file, a
   `cover` or `post` does not resolve, or a photo has no alt text.

```yaml
# content/gallery/tokyo.yaml
title: Tokyo
series: Japan 2025 # albums in a series are offered as related
post: japan-2025/tokyo # an existing post slug, checked at build
cover: japan-2025/tokyo/day-3/nkon-tokyo-d3-19 # a set in this album
```

## What in PR #14 is coupled to that contract

The UI is not coupled: components only see `GalleryPhoto` and `GalleryAlbum`.
The coupling is in the data layer, and each piece below is replaced rather than
edited.

| File or field                                  | Today                             | Becomes                                                                     | Needs     |
| ---------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------- | --------- |
| `src/features/gallery/data/photos.ts`          | Hand-written fixture, sample EXIF | Deleted                                                                     | 4.3       |
| `src/features/gallery/data/albums.ts`          | Three hard-coded albums           | `content/gallery/*.yaml` (Contentlayer)                                     | 4.1       |
| `src/features/gallery/server/get-gallery.ts`   | Fixture + the probe               | Index + manifests + album YAML                                              | 4.2       |
| `GalleryPhoto.id`                              | Set **name**, unique only by luck | Set **CDN path**                                                            | 4.2       |
| `candidates`, `width`, `height`, `placeholder` | Probe + the size table            | Manifest `variants` and `placeholder`                                       | done (#8) |
| `src` (lightbox)                               | `large`                           | Largest real size                                                           | #9        |
| `takenAt`, `exif`, `location.geo`              | Fixture, `isSample: true`         | Manifest schema 2; `isSample` and its notice in `details-panel.tsx` deleted | 2.1, 4.2  |
| `alt`, `caption`, `tags`                       | Fixture                           | Manifest schema 2                                                           | 2.3, 4.2  |
| `title`, `location.label`                      | Fixture                           | Dropped until the place-name question is settled                            | —         |
| `frame`                                        | Fixture order                     | `takenAt` order; shifts as photos are added, which is why links use `id`    | 4.2       |

Formatters in `src/features/gallery/utils.ts` already expect the schema 2
formats above, and are unit-tested against them.

## EXIF and GPS

- Read from the kept original, with `sharp().metadata().exif` and
  `exif-reader`: at upload for new sets, and by a script for sets that already
  have an original.
- GPS is a per-upload **Include location** checkbox, off by default. When on,
  coordinates are rounded to 3 decimal places (about 100 m) before they are
  stored.
- The 260 older sets have no original. Their EXIF needs your local files,
  matched by file name, or a re-upload (uploader #14).

## Phases

### 1. Every set has a manifest (image service)

| #   | Repo      | Work                                                        | Depends on |
| --- | --------- | ----------------------------------------------------------- | ---------- |
| 1.1 | uploader  | #9 run the full backfill on the upload bucket               | —          |
| 1.2 | portfolio | #10 delete the probe, placeholder generation and size table | 1.1        |
| 1.3 | portfolio | #9 lightbox uses the largest real size                      | —          |

1.2 starts once a full build logs no `Image probed` warnings.

### 2. Schema 2: EXIF, album and text (both)

| #   | Repo      | Work                                                                                        | Depends on |
| --- | --------- | ------------------------------------------------------------------------------------------- | ---------- |
| 2.1 | portfolio | Accept schema 2 alongside 1                                                                 | —          |
| 2.2 | uploader  | Schema 2: EXIF from the original at upload, plus empty `album`, `alt`, `caption` and `tags` | 2.1        |
| 2.3 | uploader  | Upload modal: album (suggested from albums in use), alt, caption, tags, Include location    | 2.2        |
| 2.4 | uploader  | Admin: edit a set's album, alt, caption and tags, rewriting its manifest                    | 2.2        |
| 2.5 | uploader  | Script: upgrade existing manifests to schema 2, reading EXIF from kept originals            | 2.2        |

### 3. Gallery index (image service)

| #   | Repo     | Work                                                                                 | Depends on |
| --- | -------- | ------------------------------------------------------------------------------------ | ---------- |
| 3.1 | uploader | Rewrite `gallery/index.json` whenever an album is set, changed or cleared (2.3, 2.4) | 2.4        |
| 3.2 | uploader | Script: rebuild the index from every manifest in a bucket                            | 2.2        |

### 4. Gallery on real data (this repo)

| #   | Repo      | Work                                                                                                                                           | Depends on |
| --- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 4.1 | portfolio | Album YAML data type in Contentlayer. `contentDirPath` is `blog` today, so the content root moves up a level and posts get a `blog/**` pattern | —          |
| 4.2 | portfolio | Loader: index + manifests + album YAML, with build validation                                                                                  | 2.1, 4.1   |
| 4.3 | portfolio | Replace the fixture and `isSample` with the loader, and merge the prototype UI (PR #14)                                                        | 4.2        |

4.1 and 4.2 can be built against an empty index; the gallery has photos once
albums are set in the admin (2.4) and the index exists (3.x).

### Later

- Subscribe a bucket to the projects that use it, so an album change redeploys
  them.

## Open questions

- Place names: written by hand per photo, or looked up from GPS at upload?
- Strapi photos have file names as alt text (`DSC_2346.webp`). They need real
  alt text before they join an album; the build's alt-text check will list
  them.
- Tags: free text, or chosen from a list kept in this repo?
