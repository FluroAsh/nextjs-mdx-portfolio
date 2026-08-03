import {
  LucideArrowDown,
  LucideArrowUp,
  LucideCornerDownLeft,
  LucideX,
} from "lucide-react";

export const KeyHint = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <span className="flex items-center gap-1.5">
    <span className="flex items-center gap-0.5 text-green-400 [&_svg]:size-3">
      {icon}
    </span>
    <span className="font-mono text-[10px] tracking-wider text-green-600 uppercase">
      {label}
    </span>
  </span>
);

export const NavIcons = (
  <>
    <LucideArrowUp />
    <LucideArrowDown />
  </>
);

export const OpenIcon = <LucideCornerDownLeft />;
export const ExitIcon = <LucideX />;
