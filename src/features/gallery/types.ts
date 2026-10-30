import type { SrcSetCandidate } from "@/utils/image";

/**
 * Every field says where it will come from once the gallery reads real data.
 * Today only the `manifest` fields exist; the rest need work in
 * s3-image-upload-thing (see `docs/gallery-metadata.md`), so they are optional
 * and the UI hides whatever is missing.
 */

/** Camera settings as recorded in the file. Source: EXIF, extracted at upload. */
export type PhotoExif = {
  /** `Make` + `Model`, e.g. "NIKON Z 6". */
  camera?: string;
  /** `LensModel`. */
  lens?: string;
  /** `FocalLength` in millimetres. */
  focalLength?: number;
  /** `FNumber`, e.g. `2.8`. */
  aperture?: number;
  /** `ExposureTime` in seconds, e.g. `0.0166` for 1/60. */
  exposureTime?: number;
  /** `ISO` / `PhotographicSensitivity`. */
  iso?: number;
};

/** Where a photo was taken. */
export type PhotoLocation = {
  /** Place name as shown, e.g. "Asakusa, Tokyo". Source: editorial. */
  label: string;
  /** Short form for the tile overlay, e.g. "Asakusa". Source: editorial. */
  short?: string;
  /** Source: EXIF GPS, rounded at upload so it never pins an exact spot. */
  geo?: {
    /** Decimal degrees, negative south of the equator. */
    latitude: number;
    /** Decimal degrees, negative west of Greenwich. */
    longitude: number;
  };
};

export type GalleryPhoto = {
  /** Stable id for deep links; the image set's name. Source: manifest. */
  id: string;
  /** URL of the largest inline variant. Source: manifest. */
  src: string;
  /** Intrinsic width of `src` in pixels. Source: manifest (probe until #8 lands). */
  width: number;
  /** Intrinsic height of `src` in pixels. Source: manifest (probe until #8 lands). */
  height: number;
  /** Narrower siblings of `src` for `srcset`, narrowest first; empty when the size is a guess. */
  candidates: SrcSetCandidate[];
  /** `false` when the size is a stand-in and must not be shown as fact. */
  measured: boolean;
  /** Base64 blur; `""` when there is none. Source: manifest. */
  placeholder: string;
  /** Position in the whole gallery, 1-based, so a frame keeps its number under any filter. */
  frame: number;
  /** Short title. Source: editorial; falls back to alt text. */
  title: string;
  /** Alternative text for the image. Source: editorial. */
  alt: string;
  /** One or two sentences. Source: editorial. */
  caption?: string;
  /** ISO 8601 with offset, e.g. `2025-03-14T21:42:00+09:00`. Source: EXIF `DateTimeOriginal` + `OffsetTimeOriginal`. */
  takenAt?: string;
  location?: PhotoLocation;
  exif?: PhotoExif;
  /** Source: editorial. */
  tags: string[];
  /** Slug of the album the photo belongs to. Source: editorial. */
  album: string;
  /** Marks prototype values that were written by hand, not read from the file. */
  isSample?: boolean;
};

export type GalleryAlbum = {
  /** URL-safe id, used in `?album=`. */
  slug: string;
  /** Display name, e.g. "Tokyo". */
  title: string;
  /** Post that tells the story behind the album, if there is one. */
  postPath?: string;
  /** Albums in one series are offered as related. */
  series?: string;
};
