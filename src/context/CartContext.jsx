import { createContext, useContext, useEffect, useRef, useState } from "react";

const CartCtx = createContext(null);
const CART_STORAGE_KEY = "andiamos-cart";

function readStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readStoredCart);
  const [toast, setToast] = useState({ show: false, itemName: "" });
  const toastTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const add = (item) => {
    const key = item.size ? `${item.name}|${item.size}` : item.name;
    setCart((prev) => ({
      ...prev,
      [key]: prev[key]
        ? { ...prev[key], qty: prev[key].qty + 1 }
        : { ...item, qty: 1, cartKey: key },
    }));

    setToast({
      show: true,
      itemName: item.size ? `${item.name} (${item.size})` : item.name,
    });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 1800);
  };

  const adjust = (name, delta) =>
    setCart((prev) => {
      const item = prev[name];
      if (!item) return prev;

      const qty = item.qty + delta;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: { ...item, qty } };
    });

  const clear = () => setCart({});

  const count = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const items = Object.values(cart);

  return (
    <CartCtx.Provider value={{ items, add, adjust, clear, count, toast }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
