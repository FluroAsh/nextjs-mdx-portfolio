import { sortedPostsByDateDesc } from "@/data/content";
import type { LatestPost, SystemStatus } from "@/data/identity";
import { RecentPosts } from "@/features/blog/components/recent-posts";
import { AboutSection } from "@/features/home/components/about-section";
import { HeroSection } from "@/features/home/components/hero";
import { SkillsSection } from "@/features/home/components/skills-section";
import { TimelineSection } from "@/features/home/components/timeline";
import { formatDate } from "@/utils/dates";
import { formatMelbourneDateTime } from "@/utils/melbourne-time";

/**
 * Built on the server: formatting here keeps date-fns and the post index out of
 * the client bundle. `sortedPostsByDateDesc` really is newest first — the sort
 * function it uses is the thing that's misnamed.
 */
const latestPosts: LatestPost[] = sortedPostsByDateDesc
  .slice(0, 3)
  .map((post) => ({
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
      <AboutSection />
      <SkillsSection />
      <TimelineSection />

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
