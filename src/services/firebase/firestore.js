import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config";

/* ---------------- Users ---------------- */

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, "users", uid), data);
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateUserRole(uid, role) {
  await updateDoc(doc(db, "users", uid), { role });
}

/* ---------------- Products ---------------- */

export async function getAllProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductBySlug(slug) {
  const q = query(collection(db, "products"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getProductsByCategory(category) {
  const q = query(collection(db, "products"), where("category", "==", category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Creates a product doc keyed by its slug (so slugs stay unique by construction). */
export async function createProduct(slug, data) {
  await setDoc(doc(db, "products", slug), data);
}

export async function updateProduct(slug, data) {
  await updateDoc(doc(db, "products", slug), data);
}

export async function deleteProduct(slug) {
  await deleteDoc(doc(db, "products", slug));
}

/* ---------------- Categories ---------------- */

/**
 * Categories live in their own `categories` collection so the Shop
 * filter dropdown doesn't have to scan every product to find the
 * distinct list. Each doc: { name, slug }.
 */
export async function getAllCategories() {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createCategory(slug, data) {
  await setDoc(doc(db, "categories", slug), data);
}

export async function deleteCategory(slug) {
  await deleteDoc(doc(db, "categories", slug));
}

/* ---------------- Cart ---------------- */

/** Returns the signed-in user's saved cart items, or [] if none exists yet. */
export async function getCart(uid) {
  const snap = await getDoc(doc(db, "carts", uid));
  return snap.exists() ? snap.data().items || [] : [];
}

/** Overwrites the signed-in user's cart doc with the current item list. */
export async function saveCart(uid, items) {
  await setDoc(doc(db, "carts", uid), {
    items,
    updatedAt: new Date().toISOString(),
  });
}

/* ---------------- Orders ---------------- */

/**
 * order: {
 *   userId, items, address, region,
 *   subtotal, shippingCost, total,
 *   paymentMethod: "cod" | "bank_transfer" | "card",
 *   status: "pending" | "awaiting_payment" | "paid" | "cancelled" | "fulfilled",
 * }
 * Returns the new order's generated id.
 */
export async function createOrder(order) {
  const ref = await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getOrder(orderId) {
  const snap = await getDoc(doc(db, "orders", orderId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getOrdersByUser(uid) {
  const q = query(collection(db, "orders"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getAllOrders() {
  const snap = await getDocs(collection(db, "orders"));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, "orders", orderId), { status });
}

/* ---------------- Wishlist ---------------- */

export async function getWishlist(uid) {
  const snap = await getDoc(doc(db, "wishlists", uid));
  return snap.exists() ? snap.data().items || [] : [];
}

export async function saveWishlist(uid, items) {
  await setDoc(doc(db, "wishlists", uid), {
    items,
    updatedAt: new Date().toISOString(),
  });
}

/* ---------------- Reviews ---------------- */

/**
 * review: { productId, productSlug, productName, userId, userName, rating, comment }
 *
 * Also rolls the new rating into the product's running average
 * (product.rating / product.reviewCount) — there's no backend job
 * to do this separately, so it happens right here at write time.
 */
export async function createReview(review) {
  const ref = await addDoc(collection(db, "reviews"), {
    ...review,
    createdAt: new Date().toISOString(),
  });

  const productSnap = await getDoc(doc(db, "products", review.productSlug));
  if (productSnap.exists()) {
    const product = productSnap.data();
    const prevCount = product.reviewCount || 0;
    const prevRating = product.rating || 0;
    const newCount = prevCount + 1;
    const newRating = (prevRating * prevCount + review.rating) / newCount;

    await updateDoc(doc(db, "products", review.productSlug), {
      rating: Math.round(newRating * 10) / 10,
      reviewCount: newCount,
    });
  }

  return ref.id;
}

export async function getReviewsByUser(uid) {
  const q = query(collection(db, "reviews"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getReviewsByProduct(productSlug) {
  const q = query(collection(db, "reviews"), where("productSlug", "==", productSlug));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
