"use client";

import { usePathname } from "next/navigation";

import { MotionConfig } from "motion/react";
import { useMedia } from "react-use";

import { Footer } from "@/components/navigation/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { cn } from "@/utils/misc";

import { CommandPalette } from "../command-palette";
import { MobileNav } from "../navigation/mobile-nav";
import { NavigationHeader } from "../navigation/navigation-header";

/**
 * Any of these three will make the texture vanish entirely: `overlay` instead
 * of `soft-light` (flattens on a dark page), tiling below its real 256px
 * (averages the pattern away), or adding opacity (strength lives in the image).
 */
export const BackgroundOverlay = () => (
  // The background sits here, not on `body` — there it goes to the canvas,
  // outside every stacking context, leaving the blended child nothing to mix with.
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
    // `reducedMotion="user"` keeps opacity but drops transforms, so nothing
    // animates into place yet everything still ends up visible.
    <MotionConfig reducedMotion="user">
      <CommandPalette>
        <div className="page-inner flex min-h-dvh flex-col">
          <BackgroundOverlay />
          <MobileNav />
          <NavigationHeader />
          <main
            className={cn(
              "flex flex-1 grow justify-center pb-16 [&>div]:w-full",
              // The homepage sections carry their own padding and must run edge to edge into the footer.
              isHomepage && "pb-0",
            )}
          >
            {children}
          </main>
          <ScrollToTop isMobile={isMobile} />
          <Footer />
        </div>
      </CommandPalette>
    </MotionConfig>
  );
};
