# Gallery: implementation plan

The `/gallery` prototype runs on a hand-written fixture
(`src/features/gallery/data/photos.ts`). This plan replaces that fixture with
real data from the image service, s3-image-upload-thing, and says where albums
are defined.

The state of the image service is taken from its `main` branch plus open pull
requests #24 (backfill write mode) and #30 (manifests inside set folders).

## Where things stand

- **Manifests describe files, not photographs.** A manifest holds the size,
  bytes and etag of each variant, a 20px blur, and the set's folder and name.
  It has no title, capture time, place, tags or album.
- **After #30 a manifest sits beside its images**:
  `{folder}/{name}/manifest.json`. From any image URL of a set, the manifest is
  `manifest.json` in the same folder. `bucket` and `pathPrefix` are gone, so
  this repo's issue #8, which still describes `manifests/{folder}/{name}.json`
  and the `legacy/` prefix, needs rewriting before anyone picks it up.
- **Flat (legacy) sets get no manifest** until a separate migration moves them
  into set folders.
- **EXIF is lost at upload, permanently.** `sharp` strips metadata from every
  variant, and the pipeline stores `source: null`: the original is not kept. The
  only moment EXIF exists is in memory during the upload request. Every photo
  uploaded before extraction ships loses it unless the original is still on
  your machine.

That last point makes EXIF extraction the most time-sensitive item here, more
than albums.

## Decisions

- **Two ways into an album.** Automatic: an album is chosen in the upload modal
  and written into the set's manifest. Manual: YAML in this repo assigns or
  overrides album membership and adds editorial text.
- **EXIF goes into the manifest only.** Public image files stay stripped, as
  they are today. A downloaded file never carries the camera serial, exact
  timestamp or GPS.
- **Folder paths and EXIF clustering do not decide albums.** Folders already
  disagree with albums (Kamakura sits in `tokyo/day-4`), and date or distance
  clustering misfiles day trips and layovers.

## Two ways a photo joins an album

Both name a photo by its **set path**, `{folder}/{name}`, for example
`japan-2025/tokyo/day-1/nkon-tokyo-d1-14`. That is the identity a manifest
already carries, so the two sources can be merged on it.

### Automatic: album chosen at upload

The upload modal gets an optional **Album** field, with suggestions from
albums already in use. It applies to every file in that upload, and the slug
is written into each set's manifest (`album: "tokyo"`).

An album field left empty means "not in the gallery". The gallery stays
curated by default, so blog screenshots and food shots never appear unless
they are filed into an album.

### Manual: YAML in this repo

One YAML file per album in `content/gallery/`, as a Contentlayer data type. It
does three jobs:

- **Defines the album**: title, series, linked post, cover. The upload modal
  only knows a slug.
- **Associates sets by hand**: photos uploaded before the album field existed,
  or whose album should change, without re-uploading.
- **Adds editorial text**: title, place and tags, which no file can supply,
  and alt text or a caption where none was typed at upload.

```yaml
# content/gallery/tokyo.yaml
title: Tokyo
series: Japan 2025 # albums in a series are offered as related
post: japan-2025/tokyo # must be an existing post slug, checked at build
cover: japan-2025/tokyo/day-3/nkon-tokyo-d3-19
photos: # optional; also sets display order for the sets listed
  - set: japan-2025/tokyo/day-1/nkon-tokyo-d1-14 # joins this album, whatever the manifest says
    alt: Akihabara Station
    caption: … # optional
    place: Akihabara, Tokyo # optional
    tags: [street, station]
  - set: japan-2025/tokyo/day-1/t-hotel
    hidden: true # in the album at upload, kept out of the gallery
```

### How the two combine

| Field                            | Comes from                                        | When both exist                                                                            |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| album membership                 | manifest `album`, or a YAML `photos` entry        | YAML wins                                                                                  |
| album title, series, post, cover | YAML                                              | n/a; a slug with no YAML file is titled from the slug and logged at build                  |
| order                            | YAML order first, then capture time, newest first | n/a                                                                                        |
| size, blur, variants             | manifest                                          | n/a                                                                                        |
| capture time, EXIF, GPS          | manifest (schema 2)                               | n/a; never written by hand                                                                 |
| alt, caption                     | manifest (typed at upload), or YAML               | YAML wins; a set with no alt text is left out of the gallery and listed in a build warning |
| title, place, tags               | YAML                                              | n/a                                                                                        |

The build also fails when a `set` is listed in two albums' YAML, or when `post`
or `cover` do not resolve.

### Albums and tags are different things

- **Album**: where and when, exclusive. A photo is in exactly one album (a trip
  or a place). This keeps the filter row, the counts and "related albums"
  simple.
- **Tag**: what it shows, cross-cutting (`night`, `street`, `temple`). Use tags
  for anything that would make you want a photo in two albums.

## How the site finds automatic sets

The site has no bucket credentials, and should not get them, so it cannot list
the bucket to find sets with an `album`. The uploader publishes a **gallery
index** instead: `gallery/index.json`, one entry per set that has an album,
holding that set's manifest fields the gallery uses.

- It is derived, never edited: written after each upload that sets an album,
  and rebuildable from the manifests by a script.
- One fetch at build replaces one per photo.
- The uploader calls a Vercel deploy hook after writing it, so a new upload
  appears without a manual deploy.

Manual-only sets are not in the index, so the site fetches their manifests
individually.

## EXIF and GPS

- Read at upload from the in-memory file, before encoding, with
  `sharp().metadata().exif` and `exif-reader`. Written to the manifest as
  `takenAt` (with UTC offset) and `exif` (camera, lens, focal length, aperture,
  shutter, ISO).
- GPS is a per-upload **Include location** checkbox, off by default and
  remembered per folder in the browser. When on, coordinates are rounded to 3
  decimal places (about 100 m) before they are stored.
- Variants keep being stripped. This is the current behaviour, now a decision.
- Existing sets have no original to read. A one-off script reads your local
  originals, matches them to sets by file name, and patches their manifests.

## Phases

### 1. Finish the manifests (image service, in flight)

| #   | Repo     | Work                                                                                                  | Depends on |
| --- | -------- | ----------------------------------------------------------------------------------------------------- | ---------- |
| 1.1 | uploader | Merge #24 and #30                                                                                     | —          |
| 1.2 | uploader | Run the backfill with `--write` on `japan-2025/`                                                      | 1.1        |
| 1.3 | uploader | Migrate flat `legacy/` sets into set folders, then backfill them (the runbook's "separate migration") | 1.1        |

### 2. Site reads manifests (this repo)

| #   | Repo      | Work                                                                                                                                                                       | Depends on |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 2.1 | portfolio | **Rewrite #8** for the #30 layout: the manifest is `manifest.json` beside the image, variants resolve by file name, no `pathPrefix`. Keep the probe fallback for flat sets | 1.1        |
| 2.2 | portfolio | Accept manifest schema 2 alongside 1, reading `takenAt`, `exif`, `geo` and `album` when present                                                                            | 2.1        |
| 2.3 | portfolio | #9 lightbox uses the largest real size                                                                                                                                     | 2.1        |
| 2.4 | portfolio | #10 delete the probe, once every set has a manifest                                                                                                                        | 1.3, 2.1   |

2.2 must deploy before the uploader writes schema 2. Readers treat an unknown
schema as "no manifest", so posts would otherwise fall back to the probe for
every new upload.

### 3. Schema 2: EXIF and album at upload (image service)

Start this alongside phase 1: every upload until 3.1 ships loses its EXIF.

| #   | Repo     | Work                                                                                                | Depends on |
| --- | -------- | --------------------------------------------------------------------------------------------------- | ---------- |
| 3.1 | uploader | Extract EXIF at upload into the manifest (`takenAt`, `exif`); bump to schema 2                      | 1.1, 2.2   |
| 3.2 | uploader | **Include location** checkbox; GPS rounded to 3 decimals, omitted when unchecked                    | 3.1        |
| 3.3 | uploader | **Album** field in the upload modal, written to each set's manifest; suggestions from albums in use | 3.1        |
| 3.4 | uploader | Script: patch existing manifests with EXIF from local originals, matched by file name               | 3.1        |
| 3.5 | uploader | Optional alt text and caption per file in the upload modal, written to the manifest                 | 3.1        |

### 4. Gallery index (image service)

| #   | Repo     | Work                                                                                                   | Depends on |
| --- | -------- | ------------------------------------------------------------------------------------------------------ | ---------- |
| 4.1 | uploader | Write `gallery/index.json` after an upload that sets an album; script to rebuild it from all manifests | 3.3        |
| 4.2 | uploader | Call a Vercel deploy hook (URL from env) after the index changes                                       | 4.1        |

### 5. Gallery on real data (this repo)

| #   | Repo      | Work                                                                                                                                                   | Depends on |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 5.1 | portfolio | Add the album YAML data type to Contentlayer. Today `contentDirPath` is `blog`, so the content root moves up a level and posts get a `blog/**` pattern | —          |
| 5.2 | portfolio | Seed script: draft album YAML from a post's image components (src, alt, caption), to prune by hand                                                     | 5.1        |
| 5.3 | portfolio | Loader: merge the gallery index and the YAML by set path, per the table above; build-time validation                                                   | 2.2, 5.1   |
| 5.4 | portfolio | Replace the fixture and the `isSample` flag with the loader, and merge the prototype UI (PR #14)                                                       | 5.3        |

5.1 to 5.3 do not have to wait for phase 4. With no index yet, the loader runs
on YAML alone, so the gallery can ship on manual albums first and pick up
automatic ones when the index exists.

### Later, if it is needed

- Explorer action: change the album of selected sets after upload, rewriting
  their manifests and the index. Until then, YAML covers it.

## Open questions

- Place names: written by hand (accurate, one more field per photo), or reverse
  geocoded at upload from GPS?
- Legacy photos have file names as alt text (`DSC_2346.webp`). They need real
  alt text before they appear, which 5.2's seed script will make obvious.
- Should the uploader start keeping originals under `src/`? It would make
  re-extraction possible, but stores full-resolution files with exact GPS and
  roughly doubles storage.
