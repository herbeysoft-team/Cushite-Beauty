import { cva } from "class-variance-authority";
import { cn } from "../../../lib/cn";

const headingVariants = cva("font-bold text-[var(--primary)]", {
  variants: {
    level: {
      h1: "text-5xl md:text-7xl leading-tight",
      h2: "text-4xl md:text-5xl",
      h3: "text-2xl md:text-3xl",
      h4: "text-xl md:text-2xl",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: { level: "h2", align: "left" },
});

export function Heading({ level = "h2", align, as, className, style, children, ...props }) {
  const Tag = as || level;
  return (
    <Tag
      className={cn(headingVariants({ level, align }), className)}
      style={{ fontFamily: "Playfair Display", ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

const textVariants = cva("text-[var(--text)]", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg leading-8",
      xl: "text-xl",
    },
    tone: {
      default: "text-[var(--text)]",
      muted: "text-[var(--text-light)]",
      inverse: "text-[var(--surface)]",
      accent: "text-[var(--secondary)]",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: { size: "base", tone: "default", align: "left" },
});

export function Text({ size, tone, align, as: Tag = "p", className, style, children, ...props }) {
  return (
    <Tag
      className={cn(textVariants({ size, tone, align }), className)}
      style={{ fontFamily: "'Poppins', sans-serif", ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default { Heading, Text };
