import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

const TextArea = forwardRef(function TextArea(
  { label, error, className, id, rows = 4, style, ...props },
  ref
) {
  const areaId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={areaId}
          className="text-sm font-medium text-[var(--text)]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        ref={ref}
        rows={rows}
        className={cn(
          "rounded-[var(--radius-md)] border bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors resize-y",
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

export default TextArea;
