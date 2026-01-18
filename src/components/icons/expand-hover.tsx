import { ExpandIcon } from "lucide-react";

export const ExpandIconHover = () => (
  <div aria-hidden="true" role="presentation" className="user-select-none absolute inset-0 z-10 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:cursor-pointer group-hover:opacity-100">
    <span className="rounded-full bg-black/50 p-3">
      <ExpandIcon className="size-4 fill-neutral-100 stroke-neutral-100" />
    </span>
  </div>
);
