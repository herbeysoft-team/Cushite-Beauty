import { cn } from "../../../lib/cn";
import { badgeVariants } from "./badgeVariants";

function Badge({ variant, className, style, children, ...props }) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      style={{ fontFamily: "'Poppins', sans-serif", ...style }}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
