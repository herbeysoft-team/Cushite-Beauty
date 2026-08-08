import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { QuantitySelector } from "../../components/product";
import { EmptyState, Loader } from "../../components/common";
import Button from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Cart() {
  const { items, cartLoading, removeItem, updateQuantity, subtotal } = useCart();

  if (cartLoading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <Loader fullScreen label="Loading your cart..." />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          actionLabel="Browse the Shop"
          onAction={() => (window.location.href = "/shop")}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Heading level="h1" className="mb-10">
          Your Cart
        </Heading>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.lineId}
                className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--background)]">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-xs text-[var(--surface)]">
                      {item.name}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-semibold text-[var(--text)]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {item.name}
                    </Link>
                    {(item.size || item.color) && (
                      <Text tone="muted" size="sm" className="mt-1">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </Text>
                    )}
                    <Text tone="muted" size="sm" className="mt-1">
                      {formatNaira(item.price)} each
                    </Text>
                  </div>

                  <div className="flex items-center justify-between">
                    <QuantitySelector
                      value={item.quantity}
                      max={item.maxStock}
                      onChange={(qty) => updateQuantity(item.lineId, qty)}
                    />
                    <button
                      onClick={() => removeItem(item.lineId)}
                      aria-label="Remove item"
                      className="text-[var(--text-light)] hover:text-[var(--danger)]"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
            <Heading level="h4" className="mb-4">
              Order Summary
            </Heading>
            <div className="flex items-center justify-between text-sm text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <span>Subtotal</span>
              <span className="font-semibold">{formatNaira(subtotal)}</span>
            </div>
            <Text tone="muted" size="xs" className="mt-2">
              Shipping is calculated at checkout.
            </Text>
            <Link to="/checkout">
              <Button variant="primary" size="lg" className="mt-6 w-full">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Cart;
