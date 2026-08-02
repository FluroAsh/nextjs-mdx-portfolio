import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { zeroPad } from "@/utils/misc";

import { DrawerMarker } from "../mobile-drawer";

export const MobileSeriesHeader = ({
  seriesTitle,
  currentIndex,
  totalPosts,
}: {
  seriesTitle: string;
  currentIndex: number;
  totalPosts: number;
}) => (
  <DrawerHeader className="gap-0 p-0">
    <DrawerMarker
      zh="系列"
      en="SERIES"
      readout={`${zeroPad(currentIndex + 1)}/${zeroPad(totalPosts)}`}
    />

    <DrawerTitle className="px-4 pt-4 font-mono text-[13px] font-normal text-neutral-400">
      {seriesTitle}
    </DrawerTitle>
  </DrawerHeader>
);
