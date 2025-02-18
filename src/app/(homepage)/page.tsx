import Link from "next/link";

import { paths } from "@/config/paths";
import { cn } from "@/utils/misc";

export default function Home() {
  return (
    <div className="pt-0">
      <section
        className={cn(
          "h-screen sm:h-[calc(100vh_-_var(--header-height))] relative",
          "bg-gradient-to-b from-black via-neutral-900 to-black",
        )}
      >
        <div className="grid place-items-center mx-auto p-8 h-full max-w-screen-xl">
          <div className="text-center">
            <p className="font-bold text-3xl tracking-wider">Ashley Thompson</p>
            <div className="mt-2">
              <span className="text-green-500">Web Developer</span> |{" "}
              <span className="text-green-500">Designer</span> |{" "}
              <span className="text-green-500">Photographer</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      <section className="bg-yellow-600">
        <div className="p-8 sm:p-20 max-w-xl">Tech Stack</div>
      </section>

      <section className="bg-purple-600">
        <div className="p-8 sm:p-20 max-w-xl">Timeline</div>
      </section>

      <section className="bg-sky-600">
        <div className="p-8 sm:p-20 max-w-xl">Projects</div>
      </section>

      <section className="bg-green-600">
        <div className="p-8 sm:p-20 max-w-xl">Recent Posts</div>
      </section>

      <section className="p-8 pb-20 sm:p-20 max-w-xl">
        <h1 className="text-xl font-bold">Section 1</h1>
        <div className="flex flex-col gap-2">
          <Link href={paths.blog}>Blog</Link>
          <Link href={paths.post.getPathname("test")}>Test Post</Link>
        </div>
      </section>
    </div>
  );
}
