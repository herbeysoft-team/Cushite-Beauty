import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";
import { createUserProfile } from "./firestore";

/**
 * Creates the Firebase Auth user, sets their display name, and
 * writes a matching profile doc to Firestore (role defaults to
 * "customer" — promote to "admin" manually in the console for now).
 */
export async function registerUser({ name, email, password }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  await createUserProfile(user.uid, {
    name,
    email,
    role: "customer",
  });
  return user;
}

export async function loginUser({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function logoutUser() {
  await signOut(auth);
}

/** Subscribes to auth state changes. Returns the unsubscribe function. */
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
