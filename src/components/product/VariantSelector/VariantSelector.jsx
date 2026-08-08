import { cn } from "../../../lib/cn";

/**
 * VariantSelector — pill buttons for choosing size and/or color.
 * Controlled: pass the product's `sizes`/`colors` option lists plus
 * the current `selected` { size, color } and `onChange`.
 */
function VariantSelector({ sizes = [], colors = [], selected = {}, onChange }) {
  return (
    <div className="flex flex-col gap-5">
      {sizes.length > 0 && (
        <div>
          <span
            className="mb-2 block text-sm font-medium text-[var(--text)]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Size
          </span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange?.({ ...selected, size })}
                className={cn(
                  "rounded-[var(--radius-xl)] border px-4 py-2 text-sm transition-colors",
                  selected.size === size
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--surface)]"
                    : "border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]"
                )}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <span
            className="mb-2 block text-sm font-medium text-[var(--text)]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Color
          </span>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange?.({ ...selected, color })}
                className={cn(
                  "rounded-[var(--radius-xl)] border px-4 py-2 text-sm transition-colors",
                  selected.color === color
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--surface)]"
                    : "border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]"
                )}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VariantSelector;
