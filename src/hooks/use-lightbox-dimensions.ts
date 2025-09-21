"use client";

import { useEffect, useRef, useState } from "react";

type ImageDimensions = {
  width: number;
  height: number;
};

/**
 * Hook to extract image dimensions from SSG-generated images for client-side lightbox use.
 * Works for both single images and image collections.
 *
 * Necesary for yet-another-react-lightbox to propertly handle zoom, as width/height is required,
 * and only available on the server-side during build time via the `MarkdownImage` component.
 */
export const useLightboxDimensions = () => {
  const [dimensions, setDimensions] = useState<ImageDimensions[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const extractDimensions = () => {
      const images = containerRef.current?.querySelectorAll("img") || [];
      const newDimensions: ImageDimensions[] = [];

      images.forEach((img) => {
        // Try to get dimensions from Next.js Image attributes (SSR-computed)
        const width = parseInt(img.getAttribute("width") || "0");
        const height = parseInt(img.getAttribute("height") || "0");

        if (width && height) {
          newDimensions.push({ width, height });
        } else if (img.complete) {
          // Fallback: use natural dimensions if image is already loaded
          newDimensions.push({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        } else {
          // If image isn't loaded yet, we'll need to wait
          // For now, push a placeholder that will be updated
          newDimensions.push({ width: 0, height: 0 });
        }
      });

      setDimensions(newDimensions);
    };

    // Initial extraction
    extractDimensions();

    // Set up listeners for images that might still be loading
    const images = containerRef.current.querySelectorAll("img");
    const loadHandlers: (() => void)[] = [];

    images.forEach((img, index) => {
      if (!img.complete) {
        const handleLoad = () => {
          setDimensions((prev) => {
            const updated = [...prev];
            updated[index] = {
              width: img.naturalWidth,
              height: img.naturalHeight,
            };
            return updated;
          });
        };

        img.addEventListener("load", handleLoad, { once: true });
        loadHandlers.push(() => img.removeEventListener("load", handleLoad));
      }
    });

    return () => {
      loadHandlers.forEach((cleanup) => cleanup());
    };
  }, []);

  return { dimensions, containerRef };
};
