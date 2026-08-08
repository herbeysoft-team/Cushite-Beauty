import { Loader2 } from "lucide-react";
import { cn } from "../../../lib/cn";

function Loader({ size = 32, fullScreen = false, label, className }) {
  const spinner = (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <Loader2 size={size} className="animate-spin text-[var(--primary)]" />
      {label && (
        <span
          className="text-sm text-[var(--text-light)]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default Loader;
