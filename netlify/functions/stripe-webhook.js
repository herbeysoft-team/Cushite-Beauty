/**
 * Netlify Function: Stripe webhook. Listens for `checkout.session.completed`
 * and marks the matching Firestore order as "paid".
 *
 * Setup:
 *   1. Deploy this site to Netlify.
 *   2. Stripe Dashboard → Developers → Webhooks → Add endpoint:
 *      https://<your-site>.netlify.app/.netlify/functions/stripe-webhook
 *      → select event: checkout.session.completed
 *   3. Copy the webhook's signing secret into Netlify env var STRIPE_WEBHOOK_SECRET.
 *   4. Set FIREBASE_SERVICE_ACCOUNT in Netlify env vars to the full JSON
 *      contents of a service account key (Firebase Console → Project
 *      Settings → Service Accounts → Generate new private key) as a
 *      single-line string.
 *
 * None of these are VITE_-prefixed — they only exist server-side here,
 * never shipped to the browser.
 */
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getDb() {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({ credential: cert(serviceAccount) });
  }
  return getFirestore();
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) {
    return { statusCode: 500, body: "Webhook not configured" };
  }

  const stripe = new Stripe(stripeSecretKey);
  const signature = event.headers["stripe-signature"];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        const db = getDb();
        await db.collection("orders").doc(orderId).update({ status: "paid" });
      } catch (err) {
        console.error("Failed to update order status:", err);
        return { statusCode: 500, body: "Failed to update order" };
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
}
