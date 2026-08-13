import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Truck, Banknote, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getProductBySlug, createOrder } from "../../services/firebase/firestore";
import { createStripeCheckoutSession } from "../../services/stripe/checkout";
import { SHIPPING_LOCATIONS, getCartShippingTotal } from "../../lib/productPricing";
import { formatGBP } from "../../lib/currency";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";
import Button from "../../components/ui/Button";
import { Loader, EmptyState } from "../../components/common";
import { Heading, Text } from "../../components/ui/Typography";
import { cn } from "../../lib/cn";

const addressSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  addressLine1: z.string().min(3, "Enter your address"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  postcode: z.string().min(3, "Enter your postcode"),
  region: z.enum(["edinburgh", "uk", "africa"], {
    errorMap: () => ({ message: "Select a shipping region" }),
  }),
  paymentMethod: z.enum(["cod", "bank_transfer", "card"], {
    errorMap: () => ({ message: "Select a payment method" }),
  }),
});

const PAYMENT_OPTIONS = [
  { value: "cod", label: "Pay on Delivery", description: "Pay in cash or by card when it arrives", icon: Truck },
  { value: "bank_transfer", label: "Bank Transfer", description: "Transfer to our account, we confirm and ship", icon: Banknote },
  { value: "card", label: "Card Payment", description: "Pay securely now via Stripe", icon: CreditCard },
];

function Checkout() {
  const { items, cartLoading, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingRates, setShippingRates] = useState({}); // { [productId]: { edinburgh, uk, africa } }
  const [ratesLoading, setRatesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      paymentMethod: "cod",
    },
  });

  const region = watch("region");
  const paymentMethod = watch("paymentMethod");

  // Fetch each unique product's shipping rate map once, up front.
  useEffect(() => {
    if (cartLoading || items.length === 0) {
      setRatesLoading(false);
      return;
    }

    let active = true;
    async function loadRates() {
      setRatesLoading(true);
      const uniqueSlugs = [...new Map(items.map((i) => [i.productId, i.slug])).entries()];
      const rates = {};

      await Promise.all(
        uniqueSlugs.map(async ([productId, slug]) => {
          const product = await getProductBySlug(slug);
          rates[productId] = product?.shipping || {};
        })
      );

      if (active) {
        setShippingRates(rates);
        setRatesLoading(false);
      }
    }

    loadRates();
    return () => {
      active = false;
    };
  }, [items, cartLoading]);

  const shippingCost = useMemo(() => {
    if (!region) return 0;
    return getCartShippingTotal(items, shippingRates, region);
  }, [items, shippingRates, region]);

  const total = subtotal + shippingCost;

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const order = {
        userId: user?.uid || null,
        items: items.map(({ lineId, ...item }) => item),
        address: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || "",
          city: data.city,
          postcode: data.postcode,
        },
        region: data.region,
        paymentMethod: data.paymentMethod,
        subtotal,
        shippingCost,
        total,
        status: data.paymentMethod === "card" ? "awaiting_payment" : "pending",
      };

      const orderId = await createOrder(order);

      if (data.paymentMethod === "card") {
        // Hands off to Stripe Checkout (via a Netlify Function — see
        // services/stripe/checkout.js). The order stays "awaiting_payment"
        // until the webhook confirms it.
        const { url } = await createStripeCheckoutSession({
          orderId,
          items,
          shippingCost,
          successUrl: `${window.location.origin}/order-confirmation/${orderId}`,
          cancelUrl: `${window.location.origin}/checkout`,
        });
        window.location.href = url;
        return;
      }

      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error(err);
      toast.error(
        err.message?.includes("not configured")
          ? "Card payment isn't set up yet — try Pay on Delivery or Bank Transfer instead."
          : "Something went wrong placing your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading || ratesLoading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <Loader fullScreen label="Loading checkout..." />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <EmptyState
          title="Your cart is empty"
          description="Add something to your cart before checking out."
          actionLabel="Browse the Shop"
          onAction={() => navigate("/shop")}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Heading level="h1" className="mb-10">
          Checkout
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Delivery address */}
            <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
              <Text className="mb-4 font-semibold">Delivery Address</Text>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
                <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
                <Select
                  label="Shipping Region"
                  placeholder="Select a region"
                  options={SHIPPING_LOCATIONS}
                  error={errors.region?.message}
                  {...register("region")}
                />
              </div>
              <div className="mt-4">
                <Input label="Address Line 1" error={errors.addressLine1?.message} {...register("addressLine1")} />
              </div>
              <div className="mt-4">
                <Input label="Address Line 2 (optional)" {...register("addressLine2")} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input label="City" error={errors.city?.message} {...register("city")} />
                <Input label="Postcode" error={errors.postcode?.message} {...register("postcode")} />
              </div>
            </section>

            {/* Payment method */}
            <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
              <Text className="mb-4 font-semibold">Payment Method</Text>
              {errors.paymentMethod && (
                <Text size="sm" className="mb-2 text-[var(--danger)]">
                  {errors.paymentMethod.message}
                </Text>
              )}
              <div className="flex flex-col gap-3">
                {PAYMENT_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                  <label
                    key={value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border p-4 transition-colors",
                      paymentMethod === value
                        ? "border-[var(--primary)] bg-[var(--primary)]/5"
                        : "border-[var(--border)]"
                    )}
                  >
                    <input
                      type="radio"
                      value={value}
                      className="sr-only"
                      {...register("paymentMethod")}
                    />
                    <Icon size={20} className="text-[var(--primary)]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {label}
                      </p>
                      <p className="text-xs text-[var(--text-light)]">{description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
            <Heading level="h4" className="mb-4">
              Order Summary
            </Heading>

            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div key={item.lineId} className="flex justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <span className="text-[var(--text-light)]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-[var(--text)]">{formatGBP(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border)] pt-4 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="flex justify-between">
                <span className="text-[var(--text-light)]">Subtotal</span>
                <span>{formatGBP(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-light)]">Shipping</span>
                <span>{region ? formatGBP(shippingCost) : "Select a region"}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold text-[var(--text)]">
                <span>Total</span>
                <span>{formatGBP(total)}</span>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={submitting} className="mt-6 w-full">
              Place Order
            </Button>
            <Link to="/cart" className="mt-3 block text-center text-xs text-[var(--text-light)]">
              ← Back to Cart
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Checkout;
