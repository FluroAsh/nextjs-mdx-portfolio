import { sortedPostsByDateDesc } from "@/data/content";
import type { LatestPost, SystemStatus } from "@/data/identity";
import { AboutSection } from "@/features/home/components/about-section";
import {
  CHAPTERS,
  CHAPTER_BAND,
  ChapterWithRail,
} from "@/features/home/components/chapters";
import { HeroSection } from "@/features/home/components/hero";
import { RecordsChapter } from "@/features/home/components/records-chapter";
import { SkillsSection } from "@/features/home/components/skills-section";
import { formatDate } from "@/utils/dates";
import { formatMelbourneDateTime } from "@/utils/melbourne-time";

/**
 * Built on the server: formatting here keeps date-fns and the post index out of
 * the client bundle. `sortedPostsByDateDesc` really is newest first — the sort
 * function it uses is the thing that's misnamed.
 */
const recentPosts = sortedPostsByDateDesc.slice(0, 3);

const latestPosts: LatestPost[] = recentPosts.map((post) => ({
  title: post.title,
  date: formatDate(post.date, "dd.MM.yy"),
  url: post.url,
}));

const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;

const systemStatus: SystemStatus = {
  commitSubject: process.env.NEXT_PUBLIC_COMMIT_SUBJECT || "—",
  deployedAt: buildTime ? formatMelbourneDateTime(buildTime) : "—",
  buildId: process.env.NEXT_PUBLIC_BUILD_ID || "—",
};

// No `searchParams`: reading it would force this page to render dynamically.
export default function Home() {
  return (
    <div className="pt-0">
      <HeroSection posts={latestPosts} system={systemStatus} />

      <AboutSection className={CHAPTER_BAND} />

      <ChapterWithRail chapter={CHAPTERS.toolchain}>
        <SkillsSection />
      </ChapterWithRail>

      {/* Posts fold in here rather than taking a chapter of their own, so the
          spine ends at 03 on every viewport. */}
      <ChapterWithRail chapter={CHAPTERS.timeline}>
        <RecordsChapter posts={recentPosts} className={CHAPTER_BAND} />
      </ChapterWithRail>

      {/* TODO: Create some more meaningful full-stack projects */}
      {/* <section className="mx-auto bg-sky-600">
        <div className="p-8 sm:p-20 max-w-5xl">Projects</div>
      </section> */}
    </div>
  );
}
