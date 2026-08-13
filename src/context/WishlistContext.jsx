import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { getWishlist, saveWishlist } from "../services/firebase/firestore";
import {
  readGuestWishlist,
  writeGuestWishlist,
  clearGuestWishlist,
  mergeWishlistItems,
} from "../lib/wishlistStorage";

const SAVE_DEBOUNCE_MS = 500;

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  const skipNextSaveRef = useRef(false);
  const saveTimeoutRef = useRef(null);

  // Load the right wishlist whenever auth state settles or the user changes.
  useEffect(() => {
    if (authLoading) return;

    let active = true;

    async function loadWishlist() {
      setWishlistLoading(true);

      if (user) {
        const guestItems = readGuestWishlist();
        const remoteItems = await getWishlist(user.uid);
        const merged = mergeWishlistItems(remoteItems, guestItems);

        if (!active) return;

        if (guestItems.length > 0) {
          clearGuestWishlist();
          await saveWishlist(user.uid, merged);
        }

        skipNextSaveRef.current = true;
        setItems(merged);
      } else {
        const guestItems = readGuestWishlist();
        if (!active) return;
        skipNextSaveRef.current = true;
        setItems(guestItems);
      }

      if (active) setWishlistLoading(false);
    }

    loadWishlist();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, authLoading]);

  // Persist on every change, debounced.
  useEffect(() => {
    if (wishlistLoading) return;

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    if (user) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveWishlist(user.uid, items).catch((err) =>
          console.error("Failed to save wishlist:", err)
        );
      }, SAVE_DEBOUNCE_MS);
    } else {
      writeGuestWishlist(items);
    }

    return () => clearTimeout(saveTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const isInWishlist = (productId) => items.some((i) => i.productId === productId);

  const addItem = (product) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === product.id)) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image || product.images?.[0],
          price: product.price,
        },
      ];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const toggleItem = (product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const value = {
    items,
    wishlistLoading,
    isInWishlist,
    addItem,
    removeItem,
    toggleItem,
    totalItems: items.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (ctx === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}

export default WishlistContext;
