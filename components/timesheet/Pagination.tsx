"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  /** Build the page number list with ellipsis */
  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;

    // Always show first pages up to some point, then ellipsis, then last page
    for (let i = 1; i <= Math.min(8, totalPages - 1); i++) {
      pages.push(i);
    }

    if (totalPages > 9) {
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }

  const pages = getPageNumbers();

  const itemBase =
    "flex items-center justify-center px-3 h-9 text-sm text-gray-600 hover:text-blue-500 transition-colors cursor-pointer select-none";
  const activeItem = "text-blue-500 font-semibold";
  const divider = "w-px h-5 bg-gray-200 self-center";

  return (
    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden divide-x divide-gray-200 bg-white shadow-sm">
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`${itemBase} px-4 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        Previous
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className={`${itemBase} cursor-default`}>
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`${itemBase} min-w-[2.5rem] ${
              currentPage === page ? activeItem : ""
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${itemBase} px-4 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        Next
      </button>
    </div>
  );
}