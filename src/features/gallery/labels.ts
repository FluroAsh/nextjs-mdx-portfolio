import type { BilingualPair } from "@/data/identity";

/** Traditional characters, matching the rest of the site's labels. */
export const GALLERY_LABELS = {
  gallery: { zh: "畫廊", en: "GALLERY" },
  frames: { zh: "幀數", en: "FRAMES" },
  collection: { zh: "選集", en: "COLLECTION" },
  details: { zh: "詳情", en: "DETAILS" },
  exif: { zh: "參數", en: "EXIF" },
  tags: { zh: "標籤", en: "TAGS" },
} as const satisfies Record<string, BilingualPair>;
