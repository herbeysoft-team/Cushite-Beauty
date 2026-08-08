import { cn } from "../../../lib/cn";

function Divider({ orientation = "horizontal", className, ...props }) {
  if (orientation === "vertical") {
    return <div className={cn("w-px self-stretch bg-[var(--border)]", className)} {...props} />;
  }
  return <hr className={cn("border-t border-[var(--border)]", className)} {...props} />;
}

export default Divider;
