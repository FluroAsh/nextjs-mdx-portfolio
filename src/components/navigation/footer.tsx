import Link from "next/link";

import { LucideCoffee, LucideMail } from "lucide-react";

import { author } from "@/data/author";
import { siteMetaData } from "@/data/site-metadata";
import { getFullYear } from "@/utils/dates";

import { GitHub } from "../icons/social-icons";
import { SocialLinks } from "./social-links";

const Heading = ({ text }: { text: string }) => (
  <h3 className="text-lg font-semibold">{text}</h3>
);

const navLinkClasses =
  "text-sm text-neutral-400 hover:text-green-500 transition-colors duration-75";

export const Footer = () => (
  <div className="mt-8 border-t border-neutral-800 bg-linear-to-t from-black/80 to-neutral-900/80">
    <footer className="mx-auto max-w-5xl px-8 py-6">
      <div className="grid grid-cols-1 gap-4 pt-2 pb-6 sm:grid-cols-[1fr_150px_1fr]">
        <div className="space-y-2">
          <Heading text="About" />
          <p className="text-sm text-neutral-400">
            © {getFullYear()} {author.name}
          </p>
          <p className="text-sm text-neutral-400">
            Inserting myself into the great big world wide web.
          </p>
        </div>

        <nav className="space-y-2">
          <Heading text="Navigation" />
          <ul>
            <li>
              <Link className={navLinkClasses} href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className={navLinkClasses} href="/blog">
                Blog
              </Link>
            </li>
            <li>
              <Link className={navLinkClasses} href="/gallery">
                Gallery
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-2 sm:justify-self-end">
          <Heading text="Connect" />
          <ul className="flex gap-3">
            <SocialLinks toggleNeutral />
            <a href="mailto:workashleythompson+blog@gmail.com">
              <LucideMail className="size-5 stroke-neutral-400 hover:stroke-green-500" />
            </a>
          </ul>
          <p className="pt-2 text-sm text-neutral-400">
            Questions or ideas? Let&apos;s talk!
          </p>
          <Link
            href={siteMetaData.siteRepo}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-green-500"
          >
            <GitHub className="size-4" />
            <span>View on GitHub</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-neutral-700 px-8 pt-4">
        <p className="text-center text-sm text-neutral-500 italic">
          Made with <LucideCoffee className="mx-0.5 inline size-4" /> in the
          evenings by yours truly, AI and a little bit of magic
        </p>
      </div>
    </footer>
  </div>
);
