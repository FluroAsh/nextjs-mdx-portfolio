import type { Metadata } from "next";
import { Catamaran, Fira_Sans } from "next/font/google";

import { RootLayoutWrapper } from "@/components/layouts/root-layout-wrapper";
import "@/css/globals.css";
import { siteMetaData } from "@/data/site-metadata";

export const metadata: Metadata = {
  title: {
    default: siteMetaData.title,
    template: `%s | ${siteMetaData.title}`,
  },
  description: siteMetaData.description,
  openGraph: {
    title: siteMetaData.title,
    description: siteMetaData.description,
    url: "./",
    siteName: siteMetaData.title,
    images: [siteMetaData.socialBanner],
    locale: siteMetaData.locale,
    type: "website",
  },
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: siteMetaData.title,
    card: "summary_large_image",
    images: [siteMetaData.socialBanner],
  },
};

/* `subsets` only controls preload — unused unicode-range files still ship but
   aren't fetched unless those code points appear on the page. */
const catamaran = Catamaran({
  subsets: ["latin"],
  variable: "--font-catamaran",
});

/* No variable build: each weight is a separate file and is preloaded by default. */
const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-sans",
});

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
        <div className="relative">
          <RootLayoutWrapper>{children}</RootLayoutWrapper>
        </div>
      </body>
    </html>
  );
}
