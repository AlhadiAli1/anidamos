import { createContext, useContext, useEffect, useRef, useState } from "react";

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [toast, setToast] = useState({ show: false, itemName: "" });
  const toastTimerRef = useRef(null);

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
        : { ...item, qty: 1 },
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
      const qty = (prev[name]?.qty ?? 0) + delta;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: { ...prev[name], qty } };
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
