import { HeroSection } from "@/features/home/components/hero-section";
import { RecentPosts } from "@/features/blog/components/recent-posts";
import { AboutSection } from "@/features/home/components/about-me";

export default function Home() {
  return (
    <div className="pt-0">
      <HeroSection />
      <AboutSection />

      <section className="mx-auto bg-yellow-600">
        <div className="max-w-5xl p-8 sm:p-20">Tech Stack</div>
      </section>

      <section className="mx-auto bg-purple-600">
        <div className="max-w-5xl p-8 sm:p-20">
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

      <section className="mx-auto max-w-5xl p-8 pb-0 sm:p-12">
        <RecentPosts />
      </section>
    </div>
  );
}
