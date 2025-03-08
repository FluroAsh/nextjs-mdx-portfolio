import type { Metadata } from "next";

import { RootLayoutWrapper } from "@/components/layouts/root-layout-wrapper";
import { catamaran, firaSans } from "../fonts";

import "@/css/globals.css";

export const metadata: Metadata = {
  title: "Ashley Thompson",
  description:
    "A digital portfolio showcasing Ashley Thompson's work, projects, travels & photography.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${catamaran.variable} ${firaSans.variable} text-white antialiased`}
      >
        <div className="page-outer relative">
          <RootLayoutWrapper>{children}</RootLayoutWrapper>
        </div>
      </body>
    </html>
  );
}
