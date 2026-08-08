import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

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
import {
  hasVariants,
  getVariantOptions,
  findVariant,
  isInStock,
} from "../../lib/productPricing";

function Product() {
  const { id: slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;

    async function fetchProduct() {
      setLoading(true);
      const data = await getProductBySlug(slug);
      if (active) {
        setProduct(data);
        setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  const { sizes, colors } = useMemo(
    () => (product ? getVariantOptions(product) : { sizes: [], colors: [] }),
    [product]
  );

  const activeVariant = useMemo(
    () => (product && hasVariants(product) ? findVariant(product, selected) : null),
    [product, selected]
  );

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

  const displayImage = product.image || product.images?.[0];
  const price = activeVariant?.price ?? product.price;
  const compareAtPrice = activeVariant?.compareAtPrice ?? product.compareAtPrice;
  const inStock = activeVariant
    ? (activeVariant.stock ?? 0) > 0
    : isInStock(product);

  const handleAddToCart = () => {
    if (hasVariants(product) && !activeVariant) {
      toast.error("Please select a variant");
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

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[var(--background)]">
            {displayImage ? (
              <img src={displayImage} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-2xl text-[var(--surface)]">
                {product.name}
              </div>
            )}
          </div>

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

            <ProductPrice price={price} compareAtPrice={compareAtPrice} />

            {product.description && (
              <Text tone="muted" size="lg">
                {product.description}
              </Text>
            )}

            {hasVariants(product) && (
              <VariantSelector
                sizes={sizes}
                colors={colors}
                selected={selected}
                onChange={setSelected}
              />
            )}

            <div className="flex items-center gap-4">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                variant="primary"
                size="lg"
                disabled={!inStock}
                onClick={handleAddToCart}
                className="flex-1"
              >
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>

            <ShippingEstimate product={product} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Product;
