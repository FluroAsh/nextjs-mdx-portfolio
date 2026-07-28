"use client";

import { usePathname } from "next/navigation";

import { useMedia } from "react-use";

import { Footer } from "@/components/navigation/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { cn } from "@/utils/misc";

import { CommandPalette } from "../command-palette";
import { MobileNav } from "../navigation/mobile-nav";
import { NavigationHeader } from "../navigation/navigation-header";

/**
 * The page texture. Three things keep it visible, and getting any of them wrong
 * makes it disappear completely rather than just look faint:
 *
 * - `soft-light`, not `overlay` — overlay flattens to nothing on a dark page.
 * - Tiled at its real size of 256px; scaling it down averages the pattern away.
 * - No opacity. The blend mode already softens it, so the strength is set in
 *   the image itself (a 90–170 range around mid-grey).
 */
export const BackgroundOverlay = () => (
  // Paints the background colour here and isolates, so the texture has
  // something to blend with. A background on `body` gets handed to the canvas,
  // outside every stacking context, leaving a blended child with nothing under
  // it.
  <div
    id="background-overlay"
    aria-hidden
    className={cn(
      "bg-surface-page pointer-events-none absolute inset-0 isolate z-[-1]",
      "before:absolute before:inset-0 before:content-['']",
      "before:bg-[url('/static/images/texture-bayer-matrix-256.png')]",
      "before:bg-[length:256px_256px] before:bg-repeat before:mix-blend-soft-light",
      "after:absolute after:inset-0 after:content-['']",
      "after:bg-linear-to-t after:from-transparent after:to-green-800/5",
    )}
  />
);

export const RootLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useMedia("(max-width: 640px)", false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <CommandPalette>
      <div className="page-inner flex min-h-dvh flex-col">
        <BackgroundOverlay />
        {isMobile ? <MobileNav /> : <NavigationHeader />}
        <main
          className={cn(
            "flex flex-1 grow justify-center pt-8 sm:pt-0 [&>div]:w-full",
            isHomepage && "pt-0",
          )}
        >
          {children}
        </main>
        <ScrollToTop isMobile={isMobile} />
        <Footer />
      </div>
    </CommandPalette>
  );
};
