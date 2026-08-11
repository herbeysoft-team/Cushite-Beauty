import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { getCart, saveCart } from "../services/firebase/firestore";
import { readGuestCart, writeGuestCart, clearGuestCart, mergeCartItems } from "../lib/cartStorage";

/**
 * Two units of the same product with different attribute selections
 * (color, size, etc.) are different line items, so the cart key
 * combines product id + a stable serialization of the variant's
 * options rather than just product id.
 */
function getLineId(product, variant) {
  if (!variant) return product.id;
  const optionKey = Object.entries(variant.options || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  return `${product.id}__${optionKey}`;
}

const SAVE_DEBOUNCE_MS = 800;

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  // Prevents the persistence effect from immediately re-saving the
  // cart we just loaded (from Firestore or guest storage).
  const skipNextSaveRef = useRef(false);
  const saveTimeoutRef = useRef(null);

  // Load the right cart whenever auth state settles or the user changes
  // (covers login, logout, and switching accounts).
  useEffect(() => {
    if (authLoading) return;

    let active = true;

    async function loadCart() {
      setCartLoading(true);

      if (user) {
        const guestItems = readGuestCart();
        const remoteItems = await getCart(user.uid);
        const merged = mergeCartItems(remoteItems, guestItems);

        if (!active) return;

        if (guestItems.length > 0) {
          clearGuestCart();
          await saveCart(user.uid, merged); // persist the merge immediately
        }

        skipNextSaveRef.current = true;
        setItems(merged);
      } else {
        const guestItems = readGuestCart();
        if (!active) return;
        skipNextSaveRef.current = true;
        setItems(guestItems);
      }

      if (active) setCartLoading(false);
    }

    loadCart();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, authLoading]);

  // Persist on every change, debounced so rapid quantity clicks don't
  // fire a Firestore write per click.
  useEffect(() => {
    if (cartLoading) return;

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    if (user) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveCart(user.uid, items).catch((err) =>
          console.error("Failed to save cart:", err)
        );
      }, SAVE_DEBOUNCE_MS);
    } else {
      writeGuestCart(items);
    }

    return () => clearTimeout(saveTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  /**
   * product: the Firestore product doc.
   * variant: the specific { size, color, price, stock } chosen, or
   *   undefined for a flat-price product with no variants.
   */
  const addItem = (product, variant, quantity = 1) => {
    const lineId = getLineId(product, variant);
    const price = variant?.price ?? product.price;
    const maxStock = variant
      ? variant.stock ?? Infinity
      : typeof product.stock === "number"
      ? product.stock
      : product.inStock === false
      ? 0
      : Infinity;

    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);

      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId
            ? { ...i, quantity: Math.min(i.quantity + quantity, maxStock) }
            : i
        );
      }

      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: variant?.image || product.image || product.images?.[0],
          price,
          options: variant?.options,
          maxStock,
          quantity: Math.min(quantity, maxStock),
        },
      ];
    });
  };

  const removeItem = (lineId) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  };

  const updateQuantity = (lineId, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.lineId === lineId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const value = {
    items,
    cartLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

export default CartContext;
