# Gallery metadata

The `/gallery` prototype runs on a hand-written fixture
(`src/features/gallery/data/photos.ts`). This note covers what the design needs
per photo, what exists today, and what s3-image-upload-thing has to add before
the fixture can go.

## What exists today

A manifest (`manifests/{folder}/{name}.json`, schema 1) carries only what the
uploader measures while encoding: size, bytes, etag per variant, a 20px blur and
the source key. Nothing describes the photograph itself.

The uploader also throws EXIF away. `sharp` drops metadata unless told to keep
it, and no variant is written with `withMetadata()`. So capture time, camera
settings and GPS survive only in sources stored under `src/`. For legacy (flat)
sets the source is itself a stripped WebP, so that data is gone for good.

## What the design needs

| Field                                | Shown in              | Source                                         | Exists                                  |
| ------------------------------------ | --------------------- | ---------------------------------------------- | --------------------------------------- |
| width, height, blur, srcset          | tile, lightbox        | manifest                                       | in manifest; read by site once #8 lands |
| largest real size                    | lightbox, download    | manifest                                       | in manifest; used once #9 lands         |
| capture time + UTC offset            | tile, details         | EXIF `DateTimeOriginal` + `OffsetTimeOriginal` | no                                      |
| camera, lens, focal, f, shutter, ISO | details               | EXIF                                           | no                                      |
| GPS                                  | details (map link)    | EXIF GPS, rounded                              | no                                      |
| title, caption, alt                  | tile, details         | editorial                                      | alt in posts                            |
| place name                           | tile overlay, details | editorial (or reverse geocode)                 | no                                      |
| tags                                 | details               | editorial                                      | no                                      |
| album membership                     | filter, related       | editorial                                      | no                                      |

`src/features/gallery/types.ts` marks the source of every field the same way.

## Proposed split

- **Machine facts go in the manifest.** The uploader already writes the
  manifest at upload and in the backfill, so it can read EXIF from the source
  before encoding and add an `exif` block (schema 2). Unknown schemas already
  fall back on the site side (#8), so this does not break readers.
- **Editorial data lives in this repo**, as a Contentlayer data type (one file
  per album that lists image keys with title, caption, tags). It is versioned
  with the posts that link to it, needs no admin UI, and lets one photo sit in
  several albums. Folder paths are not albums: `japan-2025/tokyo/day-4` holds
  the Kamakura shots.

## Work for s3-image-upload-thing

1. Read EXIF from the source in the upload pipeline (`sharp().metadata().exif`
   plus a parser such as `exif-reader`) and write it to the manifest. Keep
   stripping it from public variants.
2. Round GPS to 3 decimal places (about 100 m) before it reaches the manifest,
   and allow per-folder opt-out. Photos taken near home must never publish
   exact coordinates.
3. Extend the backfill to fill `exif` for nested sets whose source is still in
   `src/`. Report legacy sets as "no EXIF available" rather than guessing.
4. Bump the manifest to schema 2 and document the `exif` shape next to
   `shared/types/manifest.ts`.

## Open decisions

- Is the gallery curated, or every photo in every post? The fixture assumes
  curated: food and screenshots stay in posts.
- Should place names come from reverse geocoding at upload, or be written by
  hand? Hand-written is accurate but is one more field per photo.
- Legacy photos have file names as alt text (`DSC_2346.webp`), so they need
  titles before they can appear.
