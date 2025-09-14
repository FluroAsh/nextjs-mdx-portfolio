import { useState } from "react";

import { useScroll } from "motion/react";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { seriesPosts } from "@/data/content";
import { useRangeScroll } from "@/hooks/use-range-scroll";
import { usePostContext } from "@/lib/contexts/post-context";

import { MobileSeriesButton } from "./button";
import { MobileSeriesFooter } from "./footer";
import { MobileSeriesHeader } from "./header";
import { MobileSeriesItem } from "./item";

export const MobileSeriesNavigation = ({
  className,
}: {
  className?: string;
}) => {
  const { post } = usePostContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { scrollY } = useScroll();
  const { shouldBeVisible, lastScrollY } = useRangeScroll(
    true,
    scrollY,
    50,
    200,
  );

  if (post.type !== "BlogSeries") {
    return null;
  }

  const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <MobileSeriesButton
        isVisible={lastScrollY >= 200 && shouldBeVisible}
        seriesCount={seriesPosts.length}
        className={className}
      />

      <DrawerContent>
        <MobileSeriesHeader
          seriesTitle={post.seriesTitle}
          currentIndex={currentIndex}
          totalPosts={seriesPosts.length}
        />

        <div className="px-4 pb-6">
          <div className="mb-4 max-h-[50dvh] overflow-x-hidden overflow-y-scroll">
            <div className="space-y-2">
              {seriesPosts.map((seriesPost, index) => (
                <MobileSeriesItem
                  key={seriesPost.slug}
                  title={seriesPost.title}
                  url={seriesPost.url}
                  index={index}
                  isCurrent={seriesPost.slug === post.slug}
                  onItemClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          </div>

          <MobileSeriesFooter onFooterClick={() => setIsOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
