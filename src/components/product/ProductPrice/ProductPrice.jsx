import { cn } from "../../../lib/cn";

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * ProductPrice — pass either a flat `price` (+ optional `compareAtPrice`),
 * or `min`/`max` for a variant price range. When min !== max it renders
 * "From ₦X"; when min === max it behaves like a single price.
 */
function ProductPrice({ price, compareAtPrice, min, max, className }) {
  const rangeMode = min != null && max != null;
  const lowPrice = rangeMode ? min : price;
  const isRange = rangeMode && min !== max;

  const onSale = compareAtPrice && compareAtPrice > lowPrice;
  const discount = onSale
    ? Math.round(((compareAtPrice - lowPrice) / compareAtPrice) * 100)
    : 0;

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <span className="text-lg font-bold text-[var(--primary)]">
        {isRange && "From "}
        {formatNaira(lowPrice)}
      </span>
      {onSale && (
        <>
          <span className="text-sm text-[var(--text-light)] line-through">
            {formatNaira(compareAtPrice)}
          </span>
          <span className="text-xs font-semibold text-[var(--danger)]">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}

export default ProductPrice;
