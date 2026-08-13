import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { getProductBySlug } from "../../services/firebase/firestore";
import {
  ProductPrice,
  ProductRating,
  QuantitySelector,
  VariantSelector,
  ShippingEstimate,
} from "../../components/product";
import { Loader, EmptyState } from "../../components/common";
import Button from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  hasVariants,
  getAttributes,
  findVariantByOptions,
  getPriceRange,
} from "../../lib/productPricing";
import { cn } from "../../lib/cn";

function Product() {
  const { id: slug } = useParams();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchProduct() {
      setLoading(true);
      const data = await getProductBySlug(slug);
      if (active) {
        setProduct(data);
        setSelected({});
        setActiveImage(data?.images?.[0] || data?.image || null);
        setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  const attributes = useMemo(() => (product ? getAttributes(product) : []), [product]);

  const activeVariant = useMemo(
    () => (product ? findVariantByOptions(product, selected) : null),
    [product, selected]
  );

  // Swap the main image to the variant's own image, if it has one.
  useEffect(() => {
    if (activeVariant?.image) {
      setActiveImage(activeVariant.image);
    }
  }, [activeVariant]);

  if (loading) return <Loader fullScreen label="Loading product..." />;

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <EmptyState
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          actionLabel="Back to Shop"
          onAction={() => (window.location.href = "/shop")}
        />
      </main>
    );
  }

  const gallery = product.images?.length > 0 ? product.images : product.image ? [product.image] : [];
  const needsSelection = hasVariants(product);
  const selectionComplete = !needsSelection || Boolean(activeVariant);

  const price = activeVariant?.price ?? product.price;
  const compareAtPrice = activeVariant?.compareAtPrice ?? product.compareAtPrice;
  const { min, max } = getPriceRange(product);

  const inStock = activeVariant
    ? (activeVariant.stock ?? 0) > 0
    : needsSelection
    ? true // unknown until fully selected — don't block browsing
    : typeof product.stock === "number"
    ? product.stock > 0
    : product.inStock !== false;

  const handleAddToCart = () => {
    if (needsSelection && !activeVariant) {
      toast.error("Please select all options");
      return;
    }
    addItem(product, activeVariant, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Link to="/shop" className="mb-6 inline-block text-sm text-[var(--text-light)]">
          ← Back to Shop
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid gap-10 lg:grid-cols-2"
        >
          {/* Gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[var(--background)]">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-2xl text-[var(--surface)]">
                  {product.name}
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 flex gap-3">
                {gallery.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActiveImage(url)}
                    className={cn(
                      "h-16 w-16 overflow-hidden rounded-[var(--radius-sm)] border-2",
                      activeImage === url ? "border-[var(--primary)]" : "border-transparent"
                    )}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            {product.category && (
              <span
                className="text-xs uppercase tracking-wide text-[var(--text-light)]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {product.category}
              </span>
            )}

            <Heading level="h2">{product.name}</Heading>

            {product.rating != null && (
              <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
            )}

            {activeVariant ? (
              <ProductPrice price={activeVariant.price} compareAtPrice={activeVariant.compareAtPrice} />
            ) : (
              <ProductPrice min={min} max={max} compareAtPrice={compareAtPrice} />
            )}

            {product.shortDescription && (
              <Text tone="muted" size="lg">
                {product.shortDescription}
              </Text>
            )}

            {attributes.length > 0 && (
              <VariantSelector
                attributes={attributes}
                selected={selected}
                onChange={(name, value) => setSelected((prev) => ({ ...prev, [name]: value }))}
              />
            )}

            <div className="flex items-center gap-4">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                variant="primary"
                size="lg"
                disabled={!selectionComplete || !inStock}
                onClick={handleAddToCart}
                className="flex-1"
              >
                {!selectionComplete ? "Select Options" : inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => toggleItem(product)}
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isInWishlist(product.id)
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--border)] text-[var(--primary)]"
                )}
              >
                <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </motion.button>
            </div>

            <ShippingEstimate product={product} />

            {product.description && (
              <div className="border-t border-[var(--border)] pt-5">
                <Heading level="h4" className="mb-2">
                  Description
                </Heading>
                <Text tone="muted" style={{ whiteSpace: "pre-line" }}>
                  {product.description}
                </Text>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default Product;
