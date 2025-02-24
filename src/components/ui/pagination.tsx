import { cn } from "@/utils/misc";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export type PaginationProps = {
  page: number;
  totalPages: number;
  to: string;
};

const PageNumber = ({
  page,
  to,
  disabled,
  children,
}: {
  page: number;
  to: string;
  disabled?: boolean;
  children?: React.ReactNode;
}) =>
  disabled ? (
    <span className="py-2 px-3 border border-neutral-700 rounded-md text-neutral-700 font-semibold select-none">
      {children}
    </span>
  ) : (
    <Link
      href={`${to}/page/${page}`}
      className={cn(
        "py-2 px-3 border border-neutral-100 rounded-md font-semibold select-none",
        "hover:text-green-500 hover:border-green-500 transition-colors duration-75",
      )}
      aria-label={`Go to page ${page}`}
      aria-disabled
    >
      {children}
    </Link>
  );

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
  const horizontalPadding = type === "prev" ? "pl-3" : "pr-3";

  return disabled ? (
    <span className={`py-2 text-neutral-700 ${horizontalPadding}`}>
      <ChevronIcon />
    </span>
  ) : (
    <Link
      href={`${to}/page/${page}`}
      className={`py-2 hover:text-green-500 ${horizontalPadding}`}
    >
      <ChevronIcon />
    </Link>
  );
};

export const Pagination = ({ page, totalPages, to }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1);

  return (
    <div className="flex justify-center gap-4 py-4 sm:col-span-2">
      <PaginateButton
        to={to}
        page={page - 1}
        disabled={page === 1}
        type="prev"
      />

      {pages.map((pageCount) => (
        <PageNumber
          key={pageCount}
          page={pageCount}
          to={to}
          disabled={pageCount === page}
        >
          {pageCount}
        </PageNumber>
      ))}

      <PaginateButton
        to={to}
        page={page + 1}
        disabled={page === totalPages}
        type="next"
      />
    </div>
  );
};
