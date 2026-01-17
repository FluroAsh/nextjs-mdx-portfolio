import { getSeriesPosts, isBlogSeries } from "@/data/content";
import { usePostContext } from "@/lib/contexts/post-context";

import { ArticleSeparator } from "..";
import { SeriesFooter } from "./footer";
import { SeriesHeader } from "./header";
import { SeriesItem } from "./item";

export const SeriesView = () => {
  const { post } = usePostContext();

  if (!isBlogSeries(post)) {
    return null;
  }

  const currentSeriesPosts = getSeriesPosts(post);
  const currentIndex = currentSeriesPosts.findIndex((p) => p.slug === post.slug);

  return (
    <>
      <ArticleSeparator />

      <div className="my-4 px-2">
        <SeriesHeader
          title={post.seriesTitle}
          currentIndex={currentIndex}
          totalPosts={currentSeriesPosts.length}
        />

        <div className="space-y-1">
          {currentSeriesPosts.map((seriesPost, index) => (
            <SeriesItem
              key={seriesPost.slug}
              title={seriesPost.title}
              url={seriesPost.url}
              index={index}
              isCurrent={seriesPost.slug === post.slug}
            />
          ))}
        </div>

        <SeriesFooter />
      </div>
    </>
  );
};
