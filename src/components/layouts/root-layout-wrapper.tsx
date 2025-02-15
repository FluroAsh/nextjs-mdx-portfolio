"use client";

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
      "after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-transparent after:to-green-800/5 after:z-[-1]",
    )}
  />
);

export const RootLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useMedia("(max-width: 640px)", false);

  return (
    <div className="page-inner min-h-screen flex flex-col">
      <BackgroundOverlay />
      {isMobile ? <FloatingNav isMobile /> : <NavigationHeader />}
      <main
        className={cn(
          isMobile && "pt-16",
          "flex-1 flex justify-center flex-grow [&>div]:w-full",
        )}
      >
        {children}
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
};
