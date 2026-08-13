import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { EmptyState, Loader } from "../../components/common";
import Button from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";
import { formatGBP } from "../../lib/currency";

function Wishlist() {
  const { items, wishlistLoading, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item) => {
    addItem(
      { id: item.productId, slug: item.slug, name: item.name, image: item.image, price: item.price },
      undefined,
      1
    );
    toast.success(`${item.name} added to cart`);
  };

  if (wishlistLoading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <Loader fullScreen label="Loading your wishlist..." />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <EmptyState
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here."
          actionLabel="Browse the Shop"
          onAction={() => (window.location.href = "/shop")}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Heading level="h1" className="mb-1">
          Your Wishlist
        </Heading>
        <Text tone="muted" className="mb-10">
          {items.length} item{items.length !== 1 && "s"} saved
        </Text>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"
              >
                <button
                  onClick={() => removeItem(item.productId)}
                  aria-label="Remove from wishlist"
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface)]/90 text-[var(--text)] shadow-sm"
                >
                  <X size={15} />
                </button>

                <Link to={`/product/${item.slug}`} className="block">
                  <div className="aspect-square overflow-hidden bg-[var(--background)]">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-[var(--surface)]">
                        {item.name}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="truncate text-sm font-semibold text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {item.name}
                    </p>
                    {item.price != null && (
                      <p className="mt-1 text-sm font-bold text-[var(--primary)]">{formatGBP(item.price)}</p>
                    )}
                  </div>
                </Link>

                <div className="px-4 pb-4">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

export default Wishlist;
