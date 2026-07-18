import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-xl)] font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-[var(--surface)] shadow-[var(--shadow-button)] hover:bg-[var(--primary-dark)] hover:scale-105",
        secondary:
          "bg-[var(--secondary)] text-[var(--surface)] hover:bg-[var(--secondary-dark)] hover:scale-105",
        outline:
          "border-2 border-[var(--primary)] text-[var(--primary)] bg-transparent hover:bg-[var(--primary)] hover:text-[var(--surface)]",
        ghost:
          "bg-transparent text-[var(--primary)] hover:bg-[var(--primary)]/10",
        danger:
          "bg-[var(--danger)] text-[var(--surface)] hover:opacity-90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export default buttonVariants;
