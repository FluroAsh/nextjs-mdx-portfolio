import type { Metadata } from "next";

import { LayoutWrapper } from "@/components/layouts/layout-wrapper";
import { catamaran, firaSans } from "../fonts";

import "@/css/globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${catamaran.variable} ${firaSans.variable} antialiased text-white`}
      >
        <div className="page-outer relative">
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
