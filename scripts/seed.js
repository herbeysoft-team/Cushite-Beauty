/**
 * One-off script to bulk-load sample products/categories into Firestore.
 *
 * Setup:
 *   1. npm install firebase-admin --save-dev
 *   2. Firebase Console → Project Settings → Service Accounts →
 *      "Generate new private key" → save the JSON as
 *      scripts/serviceAccountKey.json (already gitignored below)
 *   3. Edit the `categories` and `products` arrays to match what you want.
 *   4. Run: node scripts/seed.js
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const categories = [
  { name: "Skincare", slug: "skincare" },
  { name: "Makeup", slug: "makeup" },
  { name: "Fragrances", slug: "fragrances" },
];

const products = [
  {
    name: "Rose Glow Serum",
    slug: "rose-glow-serum",
    shortDescription: "A lightweight vitamin C serum that brightens and evens skin tone.",
    description:
      "A lightweight vitamin C serum that brightens and evens skin tone. " +
      "Formulated with rosehip oil and niacinamide for daily glow.",
    category: "skincare",
    images: [],
    price: 25.00, // default price, used if no variants match / as a base
    compareAtPrice: 32.00,
    stock: 15,
    isNew: true,
    rating: 4.5,
    reviewCount: 12,
    attributes: [
      {
        name: "Size",
        type: "button",
        options: [
          { label: "30ml", value: "30ml" },
          { label: "50ml", value: "50ml" },
        ],
      },
    ],
    variants: [
      { options: { Size: "30ml" }, price: 25.00, compareAtPrice: 32.00, stock: 15 },
      { options: { Size: "50ml" }, price: 38.00, compareAtPrice: 48.00, stock: 8 },
    ],
    shipping: { edinburgh: 3.50, uk: 6.00, africa: 15.00 },
  },
  {
    name: "Velvet Matte Lipstick",
    slug: "velvet-matte-lipstick",
    shortDescription: "Long-wearing matte lipstick, five shades.",
    description: "Long-wearing matte lipstick that glides on smooth and lasts all day.",
    category: "makeup",
    images: [],
    price: 17.00,
    stock: 20,
    isNew: false,
    rating: 4.8,
    reviewCount: 34,
    attributes: [
      {
        name: "Color",
        type: "color",
        options: [
          { label: "Rosewood", value: "rosewood", swatch: "#9c4d4d" },
          { label: "Terracotta", value: "terracotta", swatch: "#c2683a" },
        ],
      },
    ],
    variants: [
      { options: { Color: "rosewood" }, price: 17.00, stock: 20 },
      { options: { Color: "terracotta" }, price: 17.00, stock: 0 },
    ],
    shipping: { edinburgh: 2.50, uk: 5.00, africa: 12.00 },
  },
];

async function seed() {
  const batch = db.batch();

  for (const category of categories) {
    const ref = db.collection("categories").doc(category.slug);
    batch.set(ref, category);
  }

  for (const product of products) {
    const ref = db.collection("products").doc(product.slug);
    batch.set(ref, product);
  }

  await batch.commit();
  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
