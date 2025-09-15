"use client";

import { usePathname } from "next/navigation";

import { useMedia } from "react-use";

import { Footer } from "@/components/navigation/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { cn } from "@/utils/misc";

import { CommandPalette } from "../command-palette";
import { MobileNav } from "../navigation/mobile-nav";
import { NavigationHeader } from "../navigation/navigation-header";

export const BackgroundOverlay = () => (
  <div
    id="background-overlay"
    className={cn(
      "before:pointer-events-none before:bg-[url('/static/images/green-dust-and-scratches.png')] before:bg-repeat before:content-[''] after:pointer-events-none",
      "before:absolute before:inset-0 before:z-[-1] before:opacity-30",
      "after:absolute after:inset-0 after:z-[-5] after:bg-linear-to-t after:from-transparent after:to-green-800/5 after:content-['']",
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
