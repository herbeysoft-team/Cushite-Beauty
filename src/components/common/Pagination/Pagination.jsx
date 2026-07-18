import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Pagination — page-number strip with prev/next controls.
 * Controlled: pass `page` and `onPageChange`.
 */
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center justify-center gap-2"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
            p === page
              ? "bg-[var(--primary)] text-[var(--surface)]"
              : "text-[var(--text)] hover:bg-[var(--primary)]/10"
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export default Pagination;
