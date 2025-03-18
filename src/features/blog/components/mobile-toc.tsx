import { useState } from "react";
import { LucideBookmark } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { type TocItem } from "@/lib/plugins/extract-headings";
import { cn } from "@/utils/misc";
import { useRangeScroll } from "@/hooks/use-range-scroll";
import { useScroll } from "motion/react";
import { useMedia } from "react-use";

type Props = {
  headingContent: TocItem[];
  className?: string;
};

export const MobileTableOfContents = ({
  headingContent,

  className,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isTablet = useMedia(
    "(min-width: 768px) and (max-width: 1024px)",
    false,
  );

  const { scrollY } = useScroll();
  const { shouldBeVisible, lastScrollY } = useRangeScroll(
    true,
    scrollY,
    50,
    200,
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button
          className={cn(
            lastScrollY >= 200 && shouldBeVisible
              ? "opacity-100"
              : "pointer-events-none opacity-0",
            "fixed z-10 mr-2 size-12 -translate-x-full transition-opacity duration-300",
            isTablet ? "right-4 bottom-3" : "right-4 bottom-19",
            className,
          )}
          aria-label="Open Table of Contents"
        >
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full border-2 border-neutral-700 bg-gradient-to-b from-neutral-800 to-neutral-900">
            <LucideBookmark size={20} className="stroke-neutral-400" />
          </div>
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center text-2xl text-neutral-100">
            Table of Contents
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6">
          <ul className="max-h-[50dvh] list-none overflow-x-hidden overflow-y-scroll">
            {headingContent.map((heading) => (
              <li
                key={heading.value}
                data-depth={heading.depth}
                className={cn(
                  "relative",
                  heading.depth === 2 && "my-2 text-lg font-bold",
                  heading.depth === 2
                    ? "text-neutral-100"
                    : "text-sm text-neutral-400",
                  heading.depth > 2 &&
                    `ml-${heading.depth * 2} before:absolute before:top-0 before:left-0 before:block before:h-full before:w-px before:bg-green-500 before:content-['']`,
                )}
              >
                <a
                  href={heading.url}
                  onClick={() => setIsOpen(false)}
                  className="ml-2 block max-w-fit truncate rounded-md px-2 py-1 transition-colors duration-75 hover:bg-neutral-300/10 hover:text-green-500"
                >
                  {heading.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
