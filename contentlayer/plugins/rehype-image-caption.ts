import { type Element, type Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin to handle image captions.
 *
 * This plugin detects paragraphs containing an image (img/picture) followed by
 * an em element (used as caption) and transforms them into a figure with figcaption.
 *
 * This is mostly applicable for standalone images that are not part of a collection, or
 * are not a lightbox image.
 *
 * Before:
 * <p>
 *   <picture>...</picture>
 *   <em>Caption text</em>
 * </p>
 *
 * After:
 * <figure>
 *   <picture>...</picture>
 *   <figcaption>Caption text</figcaption>
 * </figure>
 */
export function rehypeImageCaption() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      // Only process container paragraph elements
      if (node.tagName !== "p" || !parent || index === undefined) {
        return;
      }

      // Check if paragraph contains an image followed by em
      const hasImageWithCaption = checkForImageWithCaption(node);

      if (hasImageWithCaption) {
        // Find the image and caption elements
        const imageIndex = node.children.findIndex(
          (child) =>
            child.type === "element" &&
            (child.tagName === "img" || child.tagName === "picture"),
        );

        const captionIndex = node.children.findIndex(
          (child) => child.type === "element" && child.tagName === "em",
        );

        if (imageIndex !== -1 && captionIndex !== -1) {
          const imageElement = node.children[imageIndex] as Element;
          const captionElement = node.children[captionIndex] as Element;

          // Create figure element
          const figure: Element = {
            type: "element",
            tagName: "figure",
            properties: {},
            children: [
              imageElement,
              {
                type: "element",
                tagName: "figcaption",
                properties: {},
                children: captionElement.children,
              },
            ],
          };

          // Replace the paragraph with the figure
          parent.children[index] = figure;
        }
      }
    });
  };
}

/**
 * Check if a paragraph element contains an image followed by an em element
 */
function checkForImageWithCaption(node: Element): boolean {
  let hasImage = false;
  let hasEmAfterImage = false;

  for (const child of node.children) {
    if (child.type === "element") {
      if (child.tagName === "img" || child.tagName === "picture") {
        hasImage = true;
      } else if (hasImage && child.tagName === "em") {
        hasEmAfterImage = true;
        break;
      }
    }
  }

  return hasImage && hasEmAfterImage;
}
