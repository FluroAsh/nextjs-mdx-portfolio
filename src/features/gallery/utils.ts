import type { PhotoExif, PhotoLocation } from "./types";

/** Three digits, the width of a film counter. */
export const frameNumber = (frame: number) => String(frame).padStart(3, "0");

/**
 * Reads the wall-clock time straight off the string rather than through
 * `Date`, which would shift it into the viewer's time zone. A photo taken at
 * 21:42 in Tokyo should say 21:42 wherever it is viewed.
 */
export const formatTakenAt = (takenAt: string) => {
  const match =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/.exec(
      takenAt,
    );
  if (!match) return null;

  const [, date, time, offset] = match;
  /** Cameras without a time zone setting record no offset; calling that UTC would be a guess. */
  const zone = !offset
    ? null
    : offset === "Z"
      ? "UTC"
      : `UTC${offset.replace(/:00$/, "")}`;

  return { date, time, zone };
};

/** `1/60 S` below a second, `2 S` or `0.5 S` above. */
export const formatExposure = (seconds: number) => {
  if (seconds >= 1 || seconds <= 0) return `${seconds} S`;

  const denominator = Math.round(1 / seconds);
  /** A shutter of 0.4s is not "1/3"; only reciprocals of whole numbers read as fractions. */
  return Math.abs(1 / denominator - seconds) < seconds * 0.05
    ? `1/${denominator} S`
    : `${seconds} S`;
};

export const formatGeo = ({
  latitude,
  longitude,
}: NonNullable<PhotoLocation["geo"]>) =>
  `${Math.abs(latitude).toFixed(4)}°${latitude < 0 ? "S" : "N"} ${Math.abs(longitude).toFixed(4)}°${longitude < 0 ? "W" : "E"}`;

/** Label/value pairs in reading order, skipping what the file did not record. */
export const exifFields = (exif: PhotoExif) =>
  [
    { label: "CAMERA", value: exif.camera },
    { label: "LENS", value: exif.lens },
    {
      label: "FOCAL",
      value: exif.focalLength && `${exif.focalLength} MM`,
    },
    { label: "APERTURE", value: exif.aperture && `F/${exif.aperture}` },
    {
      label: "SHUTTER",
      value: exif.exposureTime && formatExposure(exif.exposureTime),
    },
    { label: "ISO", value: exif.iso && String(exif.iso) },
  ].filter((field): field is { label: string; value: string } => !!field.value);

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Common photographic ratios read as such; anything else as a decimal. */
export const formatAspectRatio = (width: number, height: number) => {
  const divisor = gcd(width, height);
  const [w, h] = [width / divisor, height / divisor];
  return w <= 21 && h <= 21 ? `${w}:${h}` : `${(width / height).toFixed(2)}:1`;
};
