const GUEST_WISHLIST_KEY = "cushite_wishlist_guest";

export function readGuestWishlist() {
  try {
    const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function writeGuestWishlist(items) {
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable — wishlist just won't persist
  }
}

export function clearGuestWishlist() {
  try {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  } catch {
    // ignore
  }
}

/** Combines a signed-in user's saved wishlist with their guest one on login, deduping by productId. */
export function mergeWishlistItems(remoteItems, guestItems) {
  if (guestItems.length === 0) return remoteItems;

  const merged = [...remoteItems];
  for (const guestItem of guestItems) {
    if (!merged.some((i) => i.productId === guestItem.productId)) {
      merged.push(guestItem);
    }
  }
  return merged;
}
