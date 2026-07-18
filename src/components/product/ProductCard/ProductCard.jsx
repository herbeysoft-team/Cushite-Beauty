import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import ProductPrice from "../ProductPrice";
import ProductRating from "../ProductRating";
import { cn } from "../../../lib/cn";

/**
 * ProductCard — the tile used in Shop grids, Home "featured"
 * sections, and search results.
 *
 * product: {
 *   id, name, slug, image, price, compareAtPrice,
 *   rating, reviewCount, isNew, inStock
 * }
 */
function ProductCard({ product, onAddToCart, onToggleWishlist, className }) {
  const {
    name,
    slug,
    image,
    price,
    compareAtPrice,
    rating,
    reviewCount,
    isNew,
    inStock = true,
  } = product;

  return (
    <Card className={cn("group relative overflow-hidden", className)}>
      <Link to={`/product/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[var(--background)]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-[var(--surface)]">
              {name}
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {isNew && <Badge variant="secondary">New</Badge>}
            {!inStock && <Badge variant="danger">Out of stock</Badge>}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist?.(product);
            }}
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface)]/90 text-[var(--primary)] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          >
            <Heart size={15} />
          </button>
        </div>

        <Card.Body className="!pb-3">
          {rating != null && (
            <ProductRating rating={rating} reviewCount={reviewCount} className="mb-2" />
          )}
          <h3
            className="truncate text-sm font-semibold text-[var(--text)]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {name}
          </h3>
          <ProductPrice price={price} compareAtPrice={compareAtPrice} className="mt-2" />
        </Card.Body>
      </Link>

      <Card.Footer className="!pt-0 !border-t-0 !pb-5">
        <button
          type="button"
          disabled={!inStock}
          onClick={() => onAddToCart?.(product)}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-[var(--radius-xl)] py-2.5 text-sm font-medium transition-colors",
            inStock
              ? "bg-[var(--primary)] text-[var(--surface)] hover:bg-[var(--primary-dark)]"
              : "cursor-not-allowed bg-[var(--border)] text-[var(--text-light)]"
          )}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <ShoppingBag size={15} />
          {inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
