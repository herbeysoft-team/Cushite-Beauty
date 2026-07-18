import { cn } from "../../../lib/cn";

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * ProductPrice — shows the current price, and a struck-through
 * compareAtPrice + discount badge when the item is on sale.
 */
function ProductPrice({ price, compareAtPrice, className }) {
  const onSale = compareAtPrice && compareAtPrice > price;
  const discount = onSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <span className="text-lg font-bold text-[var(--primary)]">
        {formatNaira(price)}
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
