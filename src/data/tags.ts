import tagData from "@/data/tag-data.json";

export type TagEntry = {
  /** Slug, and the route segment. */
  tag: string;
  /** The author's own casing, straight from the frontmatter. */
  label: string;
  count: number;
};

export const sortedTags: TagEntry[] = Object.entries(tagData)
  .map(([tag, { label, count }]) => ({ tag, label, count }))
  .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

const BY_SLUG = new Map(sortedTags.map((entry) => [entry.tag, entry]));

export const labelForTag = (tag: string) =>
  BY_SLUG.get(tag)?.label ?? tag.replace(/-/g, " ");
