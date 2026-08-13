import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import ProductPrice from "../ProductPrice";
import ProductRating from "../ProductRating";
import { cn } from "../../../lib/cn";
import { getPriceRange, isInStock, hasVariants } from "../../../lib/productPricing";
import { useWishlist } from "../../../context/WishlistContext";

function ProductCard({ product, onAddToCart, className }) {
  const { name, slug, image, images, rating, reviewCount, isNew } = product;
  const { isInWishlist, toggleItem } = useWishlist();

  const displayImage = image || images?.[0];
  const { min, max, compareAtPrice } = getPriceRange(product);
  const inStock = isInStock(product);
  const needsOptions = hasVariants(product);
  const wishlisted = isInWishlist(product.id);

  return (
    <Card className={cn("group relative overflow-hidden", className)}>
      <Link to={`/product/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[var(--background)]">
          {displayImage ? (
            <img
              src={displayImage}
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

          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product);
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-opacity",
              wishlisted
                ? "bg-[var(--primary)] text-white opacity-100"
                : "bg-[var(--surface)]/90 text-[var(--primary)] opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
          </motion.button>
        </div>

        <Card.Body className="!pb-3">
          {product.category && (
            <span
              className="mb-1 block text-xs uppercase tracking-wide text-[var(--text-light)]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {product.category}
            </span>
          )}
          {rating != null && (
            <ProductRating rating={rating} reviewCount={reviewCount} className="mb-2" />
          )}
          <h3
            className="truncate text-sm font-semibold text-[var(--text)]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {name}
          </h3>
          <ProductPrice min={min} max={max} compareAtPrice={compareAtPrice} className="mt-2" />
        </Card.Body>
      </Link>

      <Card.Footer className="!pt-0 !border-t-0 !pb-5">
        {needsOptions ? (
          <Link
            to={`/product/${slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-xl)] border-2 border-[var(--primary)] py-2.5 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[var(--surface)]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Select Options
          </Link>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
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
          </motion.button>
        )}
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
