import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";

/** Checkbox — custom-styled checkbox with a label. Forwards ref for react-hook-form. */
const Checkbox = forwardRef(function Checkbox(
  { label, className, id, ...props },
  ref
) {
  const boxId = id || props.name;

  return (
    <label
      htmlFor={boxId}
      className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--text)]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <input
          id={boxId}
          ref={ref}
          type="checkbox"
          className={cn("peer sr-only", className)}
          {...props}
        />
        <span
          className={cn(
            "h-5 w-5 rounded-[var(--radius-sm)] border-2 border-[var(--border)] transition-colors",
            "peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary)]/30"
          )}
        />
        <Check
          size={14}
          strokeWidth={3}
          className="pointer-events-none absolute text-[var(--surface)] opacity-0 peer-checked:opacity-100"
        />
      </span>
      {label}
    </label>
  );
});

export default Checkbox;
