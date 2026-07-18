import { Star } from "lucide-react";
import { cn } from "../../../lib/cn";

/** ProductRating — star rating display, optionally with a review count. */
function ProductRating({ rating = 0, reviewCount, size = 14, className }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "fill-[var(--secondary)] text-[var(--secondary)]"
              : "fill-transparent text-[var(--border)]"
          }
        />
      ))}
      {typeof reviewCount === "number" && (
        <span
          className="ml-1 text-xs text-[var(--text-light)]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

export default ProductRating;
