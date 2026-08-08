const GUEST_CART_KEY = "cushite_cart_guest";

export function readGuestCart() {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(items) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (private browsing, etc.) — cart just won't persist
  }
}

export function clearGuestCart() {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    // ignore
  }
}

/**
 * Combines a signed-in user's saved cart with whatever they had as a
 * guest (e.g. added items, then logged in). Same lineId → quantities
 * are summed and capped at that line's stock limit.
 */
export function mergeCartItems(remoteItems, guestItems) {
  if (guestItems.length === 0) return remoteItems;

  const merged = [...remoteItems];

  for (const guestItem of guestItems) {
    const existing = merged.find((i) => i.lineId === guestItem.lineId);
    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + guestItem.quantity,
        existing.maxStock ?? Infinity
      );
    } else {
      merged.push(guestItem);
    }
  }

  return merged;
}
