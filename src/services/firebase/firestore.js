import {
  doc,
  getDoc,
  setDoc,
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
