import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/css/globals.css";

import { cn } from "@/lib/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased text-white`,
          "before:pointer-events-none before:content-[''] before:bg-[url('/static/images/otis-redding.png')] before:bg-repeat before:bg-[length:150px]",
          "before:fixed before:inset-0 before:opacity-[25%]",
        )}
      >
        <header />
        {children}
        <footer>
          <p>X</p>
          <p>LinkedIn</p>
          <p>Github</p>
        </footer>
      </body>
    </html>
  );
}
