/**
 * Netlify Function: creates a Stripe Checkout Session for an order
 * that's already been written to Firestore with status
 * "awaiting_payment" (see src/pages/Checkout).
 *
 * Requires these env vars set in Netlify (Site settings → Environment
 * variables), NOT in .env.local — they must never reach the browser:
 *   STRIPE_SECRET_KEY
 *
 * GBP amounts are stored in pounds in Firestore/cart state; Stripe
 * wants the smallest currency unit (pence), hence the *100 below.
 */
import Stripe from "stripe";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Card payment is not configured (missing STRIPE_SECRET_KEY)." }),
    };
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const { orderId, items, shippingCost, successUrl, cancelUrl } = JSON.parse(event.body);

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { orderId },
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return { statusCode: 500, body: JSON.stringify({ message: "Could not start checkout." }) };
  }
}
