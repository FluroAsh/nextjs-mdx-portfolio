"use client";

import { usePathname } from "next/navigation";
import { useMedia } from "react-use";

import { cn } from "@/utils/misc";
import { FloatingNav } from "@/components/navigation/floating-nav";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Footer } from "@/components/footer";
import { NavigationHeader } from "../navigation/navigation-header";

export const BackgroundOverlay = () => (
  <div
    id="background-overlay"
    className={cn(
      "before:pointer-events-none after:pointer-events-none before:content-[''] before:bg-[url('/static/images/green-dust-and-scratches.png')] before:bg-repeat",
      "before:absolute before:inset-0 before:opacity-30 before:z-[-1]",
      "after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-transparent after:to-green-800/5 after:z-[-5]",
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
    <div className="page-inner min-h-screen flex flex-col">
      <BackgroundOverlay />
      {isMobile ? <FloatingNav isMobile /> : <NavigationHeader />}
      <main
        className={cn(
          "flex-1 flex justify-center flex-grow [&>div]:w-full pt-16 sm:pt-0",
          isHomepage && "pt-0",
        )}
      >
        {children}
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
};
