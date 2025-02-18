import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  to: `/tags/${string}` | "/blog";
};

export const Pagination = ({ page, totalPages, to }: PaginationProps) => {
  return (
    <div className="flex justify-between py-4">
      {page === 1 ? (
        <span className="text-neutral-500">&larr; Previous</span>
      ) : (
        <Link href={`${to}/page/${page - 1}`}>&larr; Previous</Link>
      )}

      {page < totalPages ? (
        <Link href={`${to}/page/${page + 1}`}>Next &rarr;</Link>
      ) : (
        <span className="text-neutral-500">Next &rarr;</span>
      )}
    </div>
  );
};
