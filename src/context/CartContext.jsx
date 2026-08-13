import { createContext, useContext, useState } from "react";

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});

  const add = (item) =>
    setCart((prev) => ({
      ...prev,
      [item.name]: prev[item.name]
        ? { ...prev[item.name], qty: prev[item.name].qty + 1 }
        : { ...item, qty: 1 },
    }));

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
    <CartCtx.Provider value={{ items, add, adjust, clear, count }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
