import type { GalleryPhoto } from "../types";

/** What a hand-curated entry supplies; the rest is resolved from the image itself. */
export type PhotoEntry = Pick<
  GalleryPhoto,
  | "alt"
  | "caption"
  | "takenAt"
  | "location"
  | "exif"
  | "tags"
  | "album"
  | "isSample"
> & {
  /** Path under the image host, e.g. `japan-2025/tokyo/x/large_x.webp`. */
  key: string;
  /** Overrides `alt` as the display title when the two should differ. */
  title?: string;
};

const tokyo = (day: number, n: string) =>
  `japan-2025/tokyo/day-${day}/nkon-tokyo-d${day}-${n}/large_nkon-tokyo-d${day}-${n}.webp`;

/**
 * PROTOTYPE FIXTURE. Keys, alt text and captions are the real ones from the
 * posts. Location labels and tags are inferred from those posts. Only entries
 * marked `isSample` carry date, GPS and EXIF, and those are hand-written
 * placeholders until the uploader extracts them from the files.
 *
 * Newest album first; the order inside an album is the order in its post.
 */
export const PHOTO_ENTRIES: PhotoEntry[] = [
  {
    key: tokyo(1, "14"),
    alt: "Akihabara Station",
    album: "tokyo",
    location: { label: "Akihabara, Tokyo", short: "Akihabara" },
    tags: ["street", "station"],
  },
  {
    key: tokyo(1, "09"),
    alt: "Akihabara streets with taxis",
    album: "tokyo",
    location: { label: "Akihabara, Tokyo", short: "Akihabara" },
    tags: ["street"],
  },
  {
    key: tokyo(1, "11"),
    alt: "GiGO Akihabara 4 building",
    album: "tokyo",
    location: { label: "Akihabara, Tokyo", short: "Akihabara" },
    tags: ["street", "neon"],
  },
  {
    key: tokyo(1, "07"),
    alt: "Don Quijote Akihabara",
    album: "tokyo",
    location: { label: "Akihabara, Tokyo", short: "Akihabara" },
    tags: ["street", "neon"],
  },
  {
    key: tokyo(1, "19"),
    alt: "Tokyo Skytree",
    album: "tokyo",
    location: { label: "Sumida, Tokyo", short: "Sumida" },
    tags: ["architecture"],
  },
  {
    key: tokyo(1, "21"),
    alt: "Asakusa backstreets",
    album: "tokyo",
    location: { label: "Asakusa, Tokyo", short: "Asakusa" },
    tags: ["street"],
  },
  {
    key: tokyo(1, "23"),
    alt: "Senso-ji main temple",
    title: "Hondō (本堂)",
    caption:
      "The main hall of Senso-ji, a few hours after landing and still running on airport coffee.",
    album: "tokyo",
    location: {
      label: "Senso-ji, Asakusa, Tokyo",
      short: "Asakusa",
      geo: { latitude: 35.7148, longitude: 139.7967 },
    },
    takenAt: "2025-03-14T15:20:00+09:00",
    exif: {
      camera: "NIKON Z 6",
      lens: "NIKKOR Z 24-70mm f/4 S",
      focalLength: 24,
      aperture: 8,
      exposureTime: 1 / 250,
      iso: 100,
    },
    tags: ["temple", "architecture"],
    isSample: true,
  },
  {
    key: tokyo(1, "27"),
    alt: "Hondō at Asakusa Shrine with the Senso-ji pagoda",
    album: "tokyo",
    location: { label: "Asakusa, Tokyo", short: "Asakusa" },
    tags: ["temple", "architecture"],
  },
  {
    key: tokyo(1, "38"),
    alt: "Kaminarimon Gate",
    title: "Kaminarimon Gate (雷門)",
    album: "tokyo",
    location: { label: "Asakusa, Tokyo", short: "Asakusa" },
    tags: ["temple"],
  },
  {
    key: tokyo(1, "43"),
    alt: "Nakamise shopping street at night",
    album: "tokyo",
    location: { label: "Asakusa, Tokyo", short: "Asakusa" },
    tags: ["street", "night"],
  },
  {
    key: tokyo(1, "48"),
    alt: "Hōzōmon Gate at night",
    album: "tokyo",
    location: { label: "Asakusa, Tokyo", short: "Asakusa" },
    tags: ["temple", "night"],
  },
  {
    key: tokyo(1, "50"),
    alt: "Senso-ji Temple main hall at night",
    album: "tokyo",
    location: { label: "Asakusa, Tokyo", short: "Asakusa" },
    tags: ["temple", "night"],
  },
  {
    key: tokyo(2, "24"),
    alt: "teamLab Borderless entrance",
    album: "tokyo",
    location: { label: "Azabudai Hills, Tokyo", short: "Azabudai" },
    tags: ["light", "interior"],
  },
  {
    key: tokyo(2, "15"),
    alt: "Universe of Water Particles",
    album: "tokyo",
    location: { label: "Azabudai Hills, Tokyo", short: "Azabudai" },
    tags: ["light", "interior"],
  },
  {
    key: tokyo(2, "6"),
    alt: "Room with mirrors and long light ropes hanging from the ceiling",
    title: "Light ropes",
    album: "tokyo",
    location: { label: "Azabudai Hills, Tokyo", short: "Azabudai" },
    tags: ["light", "interior"],
  },
  {
    key: tokyo(2, "26"),
    alt: "Tokyo Tower at night",
    caption: "Tokyo Tower from the street, before the climb to the top deck.",
    album: "tokyo",
    location: {
      label: "Minato, Tokyo",
      short: "Minato",
      geo: { latitude: 35.6586, longitude: 139.7454 },
    },
    takenAt: "2025-03-15T19:05:00+09:00",
    exif: {
      camera: "NIKON Z 6",
      lens: "NIKKOR Z 24-70mm f/4 S",
      focalLength: 35,
      aperture: 4,
      exposureTime: 1 / 30,
      iso: 1600,
    },
    tags: ["night", "architecture"],
    isSample: true,
  },
  {
    key: tokyo(2, "29"),
    alt: "Tokyo Bay from the Tokyo Tower top deck",
    title: "View of Tokyo Bay",
    album: "tokyo",
    location: { label: "Minato, Tokyo", short: "Minato" },
    tags: ["city", "night"],
  },
  {
    key: tokyo(2, "38"),
    alt: "Tokyo Tower at night, reflected",
    album: "tokyo",
    location: { label: "Minato, Tokyo", short: "Minato" },
    tags: ["night", "architecture"],
  },
  {
    key: tokyo(3, "04"),
    alt: "Meiji Shrine torii gate",
    title: "Meiji Shrine entrance",
    album: "tokyo",
    location: { label: "Shibuya, Tokyo", short: "Meiji" },
    tags: ["shrine"],
  },
  {
    key: tokyo(3, "09"),
    alt: "Ema plaque wall underneath a camphor tree",
    album: "tokyo",
    location: { label: "Shibuya, Tokyo", short: "Meiji" },
    tags: ["shrine"],
  },
  {
    key: tokyo(3, "19"),
    alt: "Shibuya Scramble Crossing",
    caption:
      "The scramble at dusk. Everyone moving at once and nobody slowing down.",
    album: "tokyo",
    location: {
      label: "Shibuya, Tokyo",
      short: "Shibuya",
      geo: { latitude: 35.6595, longitude: 139.7005 },
    },
    takenAt: "2025-03-16T17:48:00+09:00",
    exif: {
      camera: "NIKON Z 6",
      lens: "NIKKOR Z 24-70mm f/4 S",
      focalLength: 50,
      aperture: 5.6,
      exposureTime: 1 / 125,
      iso: 800,
    },
    tags: ["street", "crowd"],
    isSample: true,
  },
  {
    key: tokyo(3, "16"),
    alt: "Shibuya Crossing from above",
    album: "tokyo",
    location: { label: "Shibuya, Tokyo", short: "Shibuya" },
    tags: ["street", "crowd"],
  },
  {
    key: tokyo(3, "23"),
    alt: "Shibuya Center-Gai at night",
    album: "tokyo",
    location: { label: "Shibuya, Tokyo", short: "Shibuya" },
    tags: ["street", "night", "neon"],
  },
  {
    key: tokyo(3, "25"),
    alt: "Dogenzaka at night",
    album: "tokyo",
    location: { label: "Shibuya, Tokyo", short: "Shibuya" },
    tags: ["street", "night", "neon"],
  },
  {
    key: tokyo(4, "01"),
    alt: "Great Buddha of Kamakura",
    album: "kamakura",
    location: {
      label: "Kōtoku-in, Kamakura",
      short: "Kamakura",
      geo: { latitude: 35.3167, longitude: 139.5359 },
    },
    takenAt: "2025-03-17T11:12:00+09:00",
    exif: {
      camera: "NIKON Z 6",
      lens: "NIKKOR Z 24-70mm f/4 S",
      focalLength: 31,
      aperture: 8,
      exposureTime: 1 / 400,
      iso: 100,
    },
    tags: ["temple"],
    isSample: true,
  },
  {
    key: tokyo(4, "06"),
    alt: "Enoden train at Hase Station",
    album: "kamakura",
    location: { label: "Hase, Kamakura", short: "Hase" },
    tags: ["train", "station"],
  },
  {
    key: tokyo(4, "08"),
    alt: "Kamakura Kōkōmae crossing",
    album: "kamakura",
    location: { label: "Kōkōmae, Kamakura", short: "Kōkōmae" },
    tags: ["train", "coast"],
  },
  {
    key: tokyo(4, "10"),
    alt: "Enoshima Benten Bridge",
    album: "kamakura",
    location: { label: "Enoshima, Fujisawa", short: "Enoshima" },
    tags: ["coast"],
  },
  {
    key: tokyo(4, "12"),
    alt: "Enoshima Shrine",
    title: "Enoshima Shrine entrance",
    album: "kamakura",
    location: { label: "Enoshima, Fujisawa", short: "Enoshima" },
    tags: ["shrine"],
  },
  {
    key: tokyo(4, "16"),
    alt: "Black-eared kite",
    album: "kamakura",
    location: { label: "Enoshima, Fujisawa", short: "Enoshima" },
    tags: ["wildlife"],
  },
  {
    key: tokyo(4, "18"),
    alt: "Cherry blossom tree",
    album: "kamakura",
    location: { label: "Kamakura", short: "Kamakura" },
    tags: ["sakura"],
  },
  {
    key: tokyo(4, "20"),
    alt: "Tsurugaoka Hachimangu torii gate staircase",
    album: "kamakura",
    location: { label: "Tsurugaoka Hachimangū, Kamakura", short: "Kamakura" },
    tags: ["shrine"],
  },
  {
    key: "legacy/DSC_2055_f270e92dfd.webp",
    alt: "Shanghai skyline",
    album: "china-2024",
    location: { label: "Shanghai", short: "Shanghai" },
    tags: ["city"],
  },
  {
    key: "legacy/DSC_1979_87860a69e8.webp",
    alt: "Wukang Mansion",
    album: "china-2024",
    location: { label: "Xuhui, Shanghai", short: "Shanghai" },
    tags: ["architecture", "street"],
  },
  {
    key: "legacy/DSC_2106_d077159dfc.webp",
    alt: "Temple shrine priests",
    album: "china-2024",
    location: { label: "Shanghai", short: "Shanghai" },
    tags: ["temple"],
  },
  {
    key: "legacy/DSC_2196_a2bac9c71d.webp",
    alt: "Pagoda amongst rocks and trees",
    album: "china-2024",
    location: { label: "Shanghai", short: "Shanghai" },
    tags: ["garden"],
  },
  {
    key: "legacy/DSC_2223_Enhanced_NR_227b0b70bb.webp",
    alt: "Pond nestled amongst trees in an oriental garden",
    album: "china-2024",
    location: { label: "Shanghai", short: "Shanghai" },
    tags: ["garden"],
  },
  {
    key: "legacy/DSC_2290_Enhanced_NR_38ab1ac0ca.webp",
    alt: "Dragon lanterns",
    album: "china-2024",
    location: { label: "Yuyuan, Shanghai", short: "Yuyuan" },
    tags: ["night", "lanterns"],
  },
  {
    key: "legacy/DSC_2310_Enhanced_NR_982c6c9a53.webp",
    alt: "Streetside view of the City God Temple",
    album: "china-2024",
    location: { label: "Yuyuan, Shanghai", short: "Yuyuan" },
    tags: ["temple", "night"],
  },
  {
    key: "legacy/DSC_2336_9dead48c9e.webp",
    alt: "Nanjing Road",
    album: "china-2024",
    location: { label: "Huangpu, Shanghai", short: "Nanjing Rd" },
    tags: ["street", "night", "neon"],
  },
  {
    key: "legacy/DSC_4414_b59936d9a7.webp",
    // The post's alt text is the file name; the caption is the only real description.
    alt: "Ngong Ping Big Buddha",
    album: "china-2024",
    location: { label: "Lantau Island, Hong Kong", short: "Lantau" },
    tags: ["temple"],
  },
];
