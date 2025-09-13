import Link from "next/link";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/utils/misc";

const PageNumber = ({
  page,
  to,
  currentPage,
}: {
  page: number;
  to: string;
  currentPage: number;
}) => {
  const isActive = page === currentPage;

  return (
    <Link
      href={`${to}/page/${page}`}
      className={cn(
        "min-w-[36px] rounded-md p-3 text-center font-semibold select-none",
        "transition-colors duration-75 hover:border-green-500 hover:text-green-500",
        isActive
          ? "pointer-events-none bg-green-500/10 text-green-500"
          : "hover:bg-neutral-600/20 hover:text-green-500",
      )}
      aria-label={`Go to page ${page}`}
      aria-disabled={isActive}
    >
      <span>{page}</span>
    </Link>
  );
};

const PaginateButton = ({
  page,
  to,
  disabled,
  type,
}: {
  page: number;
  to: string;
  disabled?: boolean;
  type: "prev" | "next";
}) => {
  const ChevronIcon = type === "prev" ? ChevronLeft : ChevronRight;
  const label = type === "prev" ? "Previous page" : "Next page";

  return (
    <Link
      href={disabled ? "#" : `${to}/page/${page}`}
      aria-disabled={disabled}
      className={cn(
        "flex items-center rounded-md p-2 transition-colors duration-75 hover:text-green-500",
        disabled
          ? "pointer-events-none text-neutral-700"
          : "hover:bg-neutral-600/10 hover:text-green-500",
      )}
    >
      <ChevronIcon className="size-5" />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export type PaginationProps = {
  page: number;
  totalPages: number;
  to: string;
};

export const Pagination = ({ page, totalPages, to }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1);

  return (
    <nav className="flex justify-center gap-1 py-4 sm:col-span-2 md:gap-1.5">
      <PaginateButton
        to={to}
        page={page - 1}
        disabled={page === 1}
        type="prev"
      />

      {pages.map((pageCount) => (
        <PageNumber
          key={pageCount}
          currentPage={page}
          page={pageCount}
          to={to}
        />
      ))}

      <PaginateButton
        to={to}
        page={page + 1}
        disabled={page === totalPages}
        type="next"
      />
    </nav>
  );
};
