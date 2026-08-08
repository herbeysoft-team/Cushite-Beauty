import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

const Input = forwardRef(function Input(
  { label, error, className, id, style, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text)]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          "h-12 rounded-[var(--radius-md)] border bg-[var(--surface)] px-4 text-sm text-[var(--text)] outline-none transition-colors",
          "border-[var(--border)] focus:border-[var(--primary)]",
          error && "border-[var(--danger)] focus:border-[var(--danger)]",
          className
        )}
        style={{ fontFamily: "'Poppins', sans-serif", ...style }}
        {...props}
      />
      {error && (
        <span className="text-xs text-[var(--danger)]">{error}</span>
      )}
    </div>
  );
});

export default Input;
