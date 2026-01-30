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

      {/* Professional Bento Grid Layout */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Skills - Spans 8 columns on desktop */}
          <div className="lg:col-span-8">
            <SkillsSection />
          </div>

          {/* Recent Posts - Spans 4 columns on desktop */}
          <div className="lg:col-span-4">
            <RecentPosts />
          </div>
        </div>
      </section>

      <TimelineSection />
    </div>
  );
}
