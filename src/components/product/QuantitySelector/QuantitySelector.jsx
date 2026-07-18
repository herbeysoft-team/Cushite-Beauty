import { Minus, Plus } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * QuantitySelector — stepper for choosing item quantity.
 * Controlled: pass `value` and `onChange`.
 */
function QuantitySelector({ value = 1, onChange, min = 1, max = 99, className }) {
  const decrease = () => onChange?.(Math.max(min, value - 1));
  const increase = () => onChange?.(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[var(--radius-xl)] border border-[var(--border)]",
        className
      )}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-[var(--text)] disabled:opacity-30"
      >
        <Minus size={14} />
      </button>
      <span
        className="w-8 text-center text-sm font-medium text-[var(--text)]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-[var(--text)] disabled:opacity-30"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default QuantitySelector;
