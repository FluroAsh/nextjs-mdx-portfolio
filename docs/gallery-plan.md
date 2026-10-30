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

## Decision: where albums live

| Option                                                  | Good                                                                                   | Bad                                                                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **A. Data files in this repo** (recommended)            | Versioned with the posts that link to them; no uploader work; the build validates them | Editing YAML by hand; set paths typed or pasted                                                        |
| B. Album files in the bucket, edited in the uploader UI | Pick photos visually in the explorer; assign an album at upload                        | A small CMS to build; the site needs a rebuild hook on every edit; editorial text away from the posts  |
| C. Folder = album                                       | No data at all                                                                         | Breaks already: Kamakura sits in `tokyo/day-4`; no titles or order; renaming a folder breaks every URL |

**Start with A, keyed so B can replace it without touching the site.** Every
album entry names a photo by its **set path**: `{folder}/{name}`, for example
`japan-2025/tokyo/day-1/nkon-tokyo-d1-14`. That is the identity the manifest
already carries (`folder` + `name`), so if albums later move into the bucket,
only the loader's source changes.

Move to B only when hand-editing is the bottleneck, for example more than about
five albums, or uploads you want to file into an album straight away. Building
an album editor before then is a CMS for three lists.

### Albums and tags are different things

- **Album**: where and when, exclusive. A photo is in exactly one album (a trip
  or a place). This keeps the filter row, the counts and "related albums"
  simple.
- **Tag**: what it shows, cross-cutting (`night`, `street`, `temple`). Use tags
  for anything that would make you want a photo in two albums.

### Album file shape

One YAML file per album in `content/gallery/`, as a Contentlayer data type:

```yaml
# content/gallery/tokyo.yaml
slug: tokyo # optional; defaults to the file name
title: Tokyo
series: Japan 2025 # albums in a series are offered as related
post: japan-2025/tokyo # must be an existing post slug, checked at build
cover: japan-2025/tokyo/day-3/nkon-tokyo-d3-19
photos: # display order
  - set: japan-2025/tokyo/day-1/nkon-tokyo-d1-14
    alt: Akihabara Station
    title: Akihabara Station # optional, defaults to alt
    caption: … # optional
    place: Akihabara, Tokyo # optional
    tags: [street, station]
```

Machine facts (size, blur, variants, and later capture time, EXIF and GPS) are
never written here. They come from the manifest.

The build fails when a `set` appears in two albums, when `post` or `cover` do
not resolve, or when a set has neither a manifest nor a probe-able image.

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
| 2.2 | portfolio | #9 lightbox uses the largest real size                                                                                                                                     | 2.1        |
| 2.3 | portfolio | #10 delete the probe, once every set has a manifest                                                                                                                        | 1.3, 2.1   |

Posts benefit from 2.1 too, so it is worth doing before any gallery work.

### 3. Albums v1 (this repo, no image-service changes)

| #   | Repo      | Work                                                                                                                                                       | Depends on |
| --- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 3.1 | portfolio | Add the `GalleryAlbum` data type to Contentlayer. Today `contentDirPath` is `blog`, so the content root moves up a level and posts get a `blog/**` pattern | —          |
| 3.2 | portfolio | Build-time validation: one album per set, `post` and `cover` resolve                                                                                       | 3.1        |
| 3.3 | portfolio | Seed script: generate album YAML from a post's image components (src, alt, caption) as a starting point to prune by hand                                   | 3.1        |
| 3.4 | portfolio | Gallery loader reads albums, fetches each set's manifest through the #8 helper, and builds `GalleryPhoto`. Delete the fixture and the `isSample` flag      | 2.1, 3.1   |
| 3.5 | portfolio | Merge the prototype UI (PR #14) with the loader                                                                                                            | 3.4        |

The gallery can ship at the end of this phase, without capture dates or EXIF.
The UI already hides fields that are missing.

### 4. EXIF in the manifest (image service)

Do 4.1 as early as possible: until it ships, every upload loses its EXIF.

| #   | Repo      | Work                                                                                                                                                                      | Depends on |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 4.1 | uploader  | Read EXIF from the upload buffer before encoding (`sharp().metadata().exif` + `exif-reader`) and add `takenAt` (with offset) and `exif` to the manifest. Bump to schema 2 | 1.1        |
| 4.2 | uploader  | GPS: round to 3 decimals (about 100 m) before it is stored, and omit it for folders marked private. Default to omitted until a folder opts in                             | 4.1        |
| 4.3 | uploader  | One-off script that reads EXIF from local originals, matches them to sets by file name, and patches existing manifests                                                    | 4.1        |
| 4.4 | portfolio | Accept schema 2; read `takenAt`, `exif` and `geo` from the manifest                                                                                                       | 2.1, 4.1   |

Schema 2 is additive, and readers treat unknown schemas as "no manifest", so 4.4
has to deploy before the uploader writes schema 2. Otherwise the site falls back
to the probe for every new upload.

Whether to start keeping originals under `src/` is a separate question. It would
make re-extraction possible, but it stores full-resolution files with exact GPS
and roughly doubles storage.

### 5. Albums in the image service (only if v1 hurts)

| #   | Repo      | Work                                                                                                |
| --- | --------- | --------------------------------------------------------------------------------------------------- |
| 5.1 | uploader  | Store albums as `albums/{slug}.json` in the bucket, in the YAML shape above                         |
| 5.2 | uploader  | Explorer: multi-select sets → "Add to album"; an album field in the upload modal                    |
| 5.3 | uploader  | Call a Vercel deploy hook after an album is saved                                                   |
| 5.4 | portfolio | Loader reads `albums/*.json` from the CDN instead of `content/gallery/`; the YAML files are retired |

## Open questions

- Is the gallery curated, or every photo in every post? This plan assumes
  curated: food and screenshots stay in posts.
- Place names: written by hand (accurate, one more field per photo), or reverse
  geocoded at upload from GPS?
- Legacy photos have file names as alt text (`DSC_2346.webp`). They need real
  alt text before they appear, which 3.3's seed script will make obvious.
