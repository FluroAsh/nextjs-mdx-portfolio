import type { Metadata } from "next";

import "yet-another-react-lightbox/styles.css";

import { RootLayoutWrapper } from "@/components/layouts/root-layout-wrapper";
import "@/css/globals.css";
import { siteMetaData } from "@/data/site-metadata";

import { catamaran, firaSans } from "../fonts";

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
    locale: "en_AU",
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
