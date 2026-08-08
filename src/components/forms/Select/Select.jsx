import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, className, id, style, ...props },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-[var(--text)]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "h-12 w-full appearance-none rounded-[var(--radius-md)] border bg-[var(--surface)] px-4 pr-10 text-sm text-[var(--text)] outline-none transition-colors",
            "border-[var(--border)] focus:border-[var(--primary)]",
            error && "border-[var(--danger)] focus:border-[var(--danger)]",
            className
          )}
          style={{ fontFamily: "'Poppins', sans-serif", ...style }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
        />
      </div>
      {error && (
        <span className="text-xs text-[var(--danger)]">{error}</span>
      )}
    </div>
  );
});

export default Select;
