import { useCart } from "../context/cartCtx";

export default function CartToast() {
  const { toast } = useCart();

  return (
    <div
      className={`cart-toast${toast.show ? " show" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      Added to order: <span className="cart-toast-item">{toast.itemName}</span>
    </div>
  );
}
