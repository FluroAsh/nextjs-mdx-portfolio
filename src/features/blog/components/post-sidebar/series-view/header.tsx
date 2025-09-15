interface SeriesHeaderProps {
  title: string;
  currentIndex: number;
  totalPosts: number;
}

export const SeriesHeader = ({
  title,
  currentIndex,
  totalPosts,
}: SeriesHeaderProps) => (
  <div className="mb-4">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-sm font-bold tracking-wider uppercase">Series</h3>
      <span className="text-xs text-neutral-500">
        {currentIndex + 1} of {totalPosts}
      </span>
    </div>
    <p className="text-sm font-medium text-neutral-400">{title}</p>
  </div>
);
