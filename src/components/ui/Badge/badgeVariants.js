import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        primary: "bg-[var(--primary)]/10 text-[var(--primary)]",
        secondary: "bg-[var(--secondary)]/10 text-[var(--secondary-dark)]",
        success: "bg-[var(--success)]/10 text-[var(--success)]",
        danger: "bg-[var(--danger)]/10 text-[var(--danger)]",
        warning: "bg-[var(--warning)]/20 text-[#92660a]",
        neutral: "bg-[var(--border)] text-[var(--text-light)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export default badgeVariants;
