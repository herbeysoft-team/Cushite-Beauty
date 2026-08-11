import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * VariantSelector — one row per product attribute. Color-type
 * attributes render as circular swatches, everything else (Size,
 * Material, etc.) renders as label pill buttons — matching how
 * WooCommerce distinguishes attribute display types.
 *
 * attributes: [{ name, type: "color"|"button", options: [{ label, value, swatch? }] }]
 * selected: { [attributeName]: value }
 * onChange: (attributeName, value) => void
 */
function VariantSelector({ attributes = [], selected = {}, onChange }) {
  return (
    <div className="flex flex-col gap-5">
      {attributes.map((attribute) => (
        <div key={attribute.name}>
          <span
            className="mb-2 block text-sm font-medium text-[var(--text)]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {attribute.name}
            {selected[attribute.name] && (
              <span className="ml-1.5 font-normal text-[var(--text-light)]">
                {attribute.options.find((o) => o.value === selected[attribute.name])?.label}
              </span>
            )}
          </span>

          {attribute.type === "color" ? (
            <div className="flex flex-wrap gap-2">
              {attribute.options.map((option) => {
                const isSelected = selected[attribute.name] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange?.(attribute.name, option.value)}
                    title={option.label}
                    aria-label={option.label}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform",
                      isSelected ? "border-[var(--primary)] scale-110" : "border-transparent"
                    )}
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10"
                      style={{ background: option.swatch || "#ccc" }}
                    >
                      {isSelected && (
                        <Check
                          size={13}
                          strokeWidth={3}
                          className="text-white mix-blend-difference"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {attribute.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange?.(attribute.name, option.value)}
                  className={cn(
                    "rounded-[var(--radius-xl)] border px-4 py-2 text-sm transition-colors",
                    selected[attribute.name] === option.value
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--surface)]"
                      : "border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]"
                  )}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default VariantSelector;
