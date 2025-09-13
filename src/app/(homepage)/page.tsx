import { RecentPosts } from "@/features/blog/components/recent-posts";
import { AboutSection } from "@/features/home/components/about-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { SkillsSection } from "@/features/home/components/skills-section";
import { TimelineSection } from "@/features/home/components/timeline-section";

export default function Home() {
  return (
    <div className="pt-0">
      <HeroSection />
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
