"use client";

import { cn } from "@/lib/utils";

import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

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
  return (
    <div className="page-inner min-h-screen flex flex-col">
      <BackgroundOverlay />
      <header />
      <main className="flex-1 flex justify-center flex-grow [&>div]:w-full">
        {children}
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
};
