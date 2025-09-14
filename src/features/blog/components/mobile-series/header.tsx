import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface MobileSeriesHeaderProps {
  seriesTitle: string;
  currentIndex: number;
  totalPosts: number;
}

export const MobileSeriesHeader = ({
  seriesTitle,
  currentIndex,
  totalPosts,
}: MobileSeriesHeaderProps) => (
  <DrawerHeader>
    <DrawerTitle className="text-center text-2xl text-neutral-100">
      {seriesTitle}
    </DrawerTitle>
    <p className="text-center text-sm text-neutral-400">
      Part {currentIndex + 1} of {totalPosts}
    </p>
  </DrawerHeader>
);