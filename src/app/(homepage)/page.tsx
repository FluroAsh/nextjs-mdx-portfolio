import { cn } from "@/utils/misc";

import { RecentPosts } from "@/features/blog/components/recent-posts";

export default function Home() {
  return (
    <div className="pt-0">
      <section
        className={cn(
          "h-screen sm:h-[calc(100vh_-_var(--spacing-header))] relative",
          "bg-linear-to-b from-black via-neutral-900 to-black",
        )}
      >
        <div className="grid place-items-center mx-auto p-8 h-full max-w-7xl)">
          <div className="text-center">
            <p className="font-bold text-3xl tracking-wider">Ashley Thompson</p>
            <div className="mt-2">
              <span className="text-green-500">Web Developer</span> |{" "}
              <span className="text-green-500">Designer</span> |{" "}
              <span className="text-green-500">Photographer</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent" />
      </section>

      <section className="mx-auto bg-yellow-600">
        <div className="p-8 sm:p-20 max-w-5xl">Tech Stack</div>
      </section>

      <section className="mx-auto bg-purple-600">
        <div className="p-8 sm:p-20 max-w-5xl">
          <h3>Timeline</h3>
          <ul>
            <li>
              Swinburne University - Bachelors of Information Systems (2014 -
              2017)
            </li>
            <li>
              <a href="https://liquipedia.net/overwatch/Fluro" target="_blank">
                Overwatch: Semi-Pro Player
              </a>{" "}
              (2018 - 2020)
            </li>
            <li>CoderAcademy Fullstack Bootcamp (2021 - 2022)</li>
            <li>MYER - Frontend Engineer (2022 - Current)</li>
          </ul>
        </div>
      </section>

      {/* TODO: Create some more meaningful full-stack projects */}
      {/* <section className="mx-auto bg-sky-600">
        <div className="p-8 sm:p-20 max-w-5xl">Projects</div>
      </section> */}

      <section className="mx-auto p-8 pb-0 sm:p-12 max-w-5xl">
        <RecentPosts />
      </section>
    </div>
  );
}
