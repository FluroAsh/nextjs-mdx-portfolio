import { useState } from "react";

import { LucideList } from "lucide-react";
import { useScroll } from "motion/react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRangeScroll } from "@/hooks/use-range-scroll";
import { type TocItem } from "@/lib/plugins/extract-headings";
import { cn, zeroPad } from "@/utils/misc";

import { DRAWER_SHELL, DrawerMarker } from "./mobile-drawer";

/** Explicit per depth — an interpolated `pl-` class is never generated. */
const INDENT: Record<number, string> = { 3: "pl-6", 4: "pl-9", 5: "pl-12" };

export const MobileTableOfContents = ({
  headingContent,
  className,
}: {
  headingContent: TocItem[];
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
            // One button-width inboard of the scroll-to-top control.
            "fixed right-19 bottom-20 z-40 size-12 sm:bottom-4",
            "clip-chamfer bg-green-500/25 p-px transition-opacity duration-300",
            className,
          )}
          aria-label="Open Table of Contents"
        >
          <span className="clip-chamfer bg-surface-page flex size-full items-center justify-center">
            <LucideList size={18} className="stroke-green-400" />
          </span>
        </button>
      </DrawerTrigger>

      <DrawerContent className={DRAWER_SHELL}>
        <DrawerHeader className="p-0">
          <DrawerMarker
            zh="目錄"
            en="CONTENTS"
            readout={zeroPad(headingContent.length)}
          />
          <DrawerTitle className="sr-only">Table of Contents</DrawerTitle>
        </DrawerHeader>

        {/* Track on the list, padding on the wrapper — on the list itself the
            border lands on the drawer edge and disappears. */}
        <div className="max-h-[55dvh] overflow-y-auto px-4 py-4">
          <ul className="border-l border-green-500/20">
            {headingContent.map((heading) => (
              <li key={heading.url}>
                <a
                  href={heading.url}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block py-2 pl-3 font-mono text-[13px] tracking-wide text-neutral-300 transition-colors duration-150 ease-linear active:text-green-300",
                    INDENT[heading.depth],
                  )}
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
