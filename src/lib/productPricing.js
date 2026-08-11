/**
 * WooCommerce-style product model:
 *
 * product = {
 *   price, compareAtPrice, stock,        // base/default — used when there are no variants
 *   attributes: [                          // e.g. Color, Size
 *     { name: "Color", type: "color", options: [{ label, value, swatch }] },
 *     { name: "Size",  type: "button", options: [{ label, value }] },
 *   ],
 *   variants: [                            // one per attribute-value combination
 *     { id, options: { Color: "red", Size: "m" }, price, compareAtPrice, stock, image },
 *   ],
 * }
 *
 * A product with no attributes/variants just uses its base price/stock —
 * these helpers handle both shapes transparently.
 */

export function hasVariants(product) {
  return Array.isArray(product.variants) && product.variants.length > 0;
}

export function getAttributes(product) {
  return product.attributes || [];
}

/** Returns { min, max, compareAtPrice } across all variants, or the base price. */
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

/** Total stock across all variants, or the base stock/inStock flag. */
export function isInStock(product) {
  if (hasVariants(product)) {
    return product.variants.some((v) => (v.stock ?? 0) > 0);
  }
  if (typeof product.stock === "number") return product.stock > 0;
  return product.inStock !== false; // legacy fallback for older docs
}

/**
 * Finds the variant whose `options` match the given selection exactly
 * for every attribute the product has. Returns null until the person
 * has picked a value for every attribute.
 */
export function findVariantByOptions(product, selected = {}) {
  if (!hasVariants(product)) return null;

  const attributeNames = getAttributes(product).map((a) => a.name);
  const isComplete = attributeNames.every((name) => selected[name]);
  if (!isComplete) return null;

  return (
    product.variants.find((v) =>
      attributeNames.every((name) => v.options?.[name] === selected[name])
    ) || null
  );
}

/** The image to show for the current selection — variant image if it has one, else the product's featured image. */
export function getDisplayImage(product, variant) {
  return variant?.image || product.images?.[0] || product.image;
}

/**
 * Cartesian product of every attribute's option values — used by the
 * admin "Generate Variations" button, same as WooCommerce's
 * "Generate variations from all attributes".
 */
export function generateVariantCombinations(attributes) {
  const usable = attributes.filter((a) => a.name && a.options?.length > 0);
  if (usable.length === 0) return [];

  return usable.reduce(
    (combos, attribute) =>
      combos.flatMap((combo) =>
        attribute.options.map((option) => ({
          ...combo,
          [attribute.name]: option.value,
        }))
      ),
    [{}]
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
