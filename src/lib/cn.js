import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes conditionally, resolving conflicts
 * (e.g. "px-4" vs "px-8") in favor of the last class applied.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
