/**
 * Products can either have a flat price (legacy / simple products) or a
 * `variants` array where each variant (a size/color combo) carries its
 * own price, compareAtPrice and stock. These helpers let ProductCard,
 * ProductPrice, etc. work with either shape without caring which one
 * they got.
 */

export function hasVariants(product) {
  return Array.isArray(product.variants) && product.variants.length > 0;
}

/** Returns { min, max, compareAtPrice } across all variants, or the flat price. */
export function getPriceRange(product) {
  if (!hasVariants(product)) {
    return {
      min: product.price,
      max: product.price,
      compareAtPrice: product.compareAtPrice,
    };
  }

  const prices = product.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  // Only show a "compare at" price if every variant is discounted —
  // otherwise a range with a single strike-through price is misleading.
  const allDiscounted = product.variants.every(
    (v) => v.compareAtPrice && v.compareAtPrice > v.price
  );
  const compareAtPrice = allDiscounted
    ? Math.max(...product.variants.map((v) => v.compareAtPrice))
    : undefined;

  return { min, max, compareAtPrice };
}

/** Total stock across all variants, or the flat inStock flag. */
export function isInStock(product) {
  if (!hasVariants(product)) {
    return product.inStock !== false;
  }
  return product.variants.some((v) => (v.stock ?? 0) > 0);
}

/** Unique sizes/colors available, for building selector options. */
export function getVariantOptions(product) {
  if (!hasVariants(product)) return { sizes: [], colors: [] };

  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];

  return { sizes, colors };
}

/** Finds the variant matching a given size/color selection. */
export function findVariant(product, { size, color } = {}) {
  if (!hasVariants(product)) return null;

  return (
    product.variants.find(
      (v) => (!size || v.size === size) && (!color || v.color === color)
    ) || product.variants[0]
  );
}

export const SHIPPING_LOCATIONS = [
  { value: "edinburgh", label: "Edinburgh" },
  { value: "uk", label: "Rest of UK" },
  { value: "africa", label: "Africa" },
];

/** Shipping cost for a location, or null if the product has no shipping map. */
export function getShippingCost(product, location) {
  if (!product.shipping) return null;
  return product.shipping[location] ?? null;
}
