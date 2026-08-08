import { Loader2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import { buttonVariants } from "./buttonVariants";

function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  style,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      style={{ fontFamily: "'Poppins', sans-serif", ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export default Button;
