import GithubSlugger from "github-slugger";
import { type Heading } from "mdast";
import { toString } from "mdast-util-to-string";
import { remark } from "remark";
import { type Parent } from "unist";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";

export type TocItem = {
  value: string;
  url: string;
  depth: number;
};

export type Toc = TocItem[];

/** Extracts TOC headings from markdown file and adds it to the file's data object. */
export function remarkTocHeadings() {
  const slugger = new GithubSlugger();
  return (tree: Parent, file: VFile) => {
    const toc: Toc = [];
    visit(tree, "heading", (node: Heading) => {
      const textContent = toString(node);
      toc.push({
        value: textContent,
        url: "#" + slugger.slug(textContent),
        depth: node.depth,
      });
    });
    file.data.toc = toc;
  };
}

export async function extractTocHeadings(markdown: string): Promise<Toc> {
  const vfile = await remark().use(remarkTocHeadings).process(markdown);
  // @ts-expect-error - `toc` is added to the `data` object by the `remarkTocHeadings` plugin
  return vfile.data.toc;
}
