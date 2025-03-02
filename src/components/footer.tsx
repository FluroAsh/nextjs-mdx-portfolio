import Link from "next/link";
import { LucideCoffee, LucideMail } from "lucide-react";

import { getFullYear } from "@/utils/dates";
import { SocialLinks } from "./navigation/social-links";

const Heading = ({ text }: { text: string }) => (
  <h3 className="text-lg font-semibold">{text}</h3>
);

const navLinkClasses =
  "text-sm text-neutral-400 hover:text-green-500 transition-colors duration-75";

export const Footer = () => (
  <div className="bg-linear-to-t from-black/80 to-neutral-900/60 border-t border-neutral-800 mt-8">
    <footer className="mx-auto max-w-5xl px-8 py-6 pb-22 sm:pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px_1fr] pt-2 pb-6 gap-4">
        <div className="space-y-2">
          <Heading text="About" />
          <p className="text-sm text-neutral-400">
            © {getFullYear()} Ashley Thompson · All rights reserved
          </p>
          <p className="text-sm text-neutral-400">
            Inserting myself into the great big world wide web.
          </p>
        </div>

        <div className="space-y-2">
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
        </div>

        <div className="space-y-2 sm:justify-self-end">
          <Heading text="Connect" />
          <ul className="flex gap-3">
            <SocialLinks toggleNeutral />
            <a href="mailto:workashleythompson+blog@gmail.com">
              <LucideMail className="size-5 stroke-neutral-400 hover:stroke-green-500" />
            </a>
          </ul>
          <p className="text-neutral-400 text-sm pt-2">
            Questions or ideas? Let&apos;s talk!
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-700 px-8">
        <p className="text-sm text-neutral-500 italic text-center">
          Made with <LucideCoffee className="inline mx-0.5 size-4" /> in the
          evenings by yours truly, AI and a little bit of magic
        </p>
      </div>
    </footer>
  </div>
);
