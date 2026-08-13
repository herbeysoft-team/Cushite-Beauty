/** Formats a number as GBP, e.g. formatGBP(24.5) -> "£24.50" */
export function formatGBP(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}
