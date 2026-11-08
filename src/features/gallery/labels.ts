import type { BilingualPair } from "@/data/identity";

/** Traditional characters, matching the rest of the site's labels. */
export const GALLERY_LABELS = {
  gallery: { zh: "畫廊", en: "GALLERY" },
  frames: { zh: "幀數", en: "FRAMES" },
  album: { zh: "相簿", en: "ALBUM" },
  details: { zh: "詳情", en: "DETAILS" },
  exif: { zh: "參數", en: "EXIF" },
  tags: { zh: "標籤", en: "TAGS" },
  related: { zh: "相關", en: "RELATED" },
  sample: { zh: "樣本", en: "SAMPLE DATA" },
} as const satisfies Record<string, BilingualPair>;
