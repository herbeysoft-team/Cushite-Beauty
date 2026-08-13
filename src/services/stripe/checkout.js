/**
 * Calls the Netlify Function that creates a Stripe Checkout Session
 * (the secret key can never live in the browser, so this has to go
 * through a small server-side function — see
 * netlify/functions/create-checkout-session.js).
 *
 * Only works once deployed to Netlify with STRIPE_SECRET_KEY set as
 * an environment variable there — it has no effect in local dev
 * unless you're running `netlify dev`.
 */
export async function createStripeCheckoutSession({ orderId, items, shippingCost, successUrl, cancelUrl }) {
  const response = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, items, shippingCost, successUrl, cancelUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Card payment is not configured.");
  }

  return response.json(); // { url }
}
