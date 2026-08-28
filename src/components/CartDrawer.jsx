import { useState } from "react";
import { useCart } from "../context/cartCtx";

const WHATSAPP_NUMBER = "96171919234";

function buildMessage(items, orderType) {
  const lines = items.map((item, index) => {
    const sizeLine = item.size ? `   Size: ${item.size}\n` : "";

    return (
      `${index + 1}. *${item.name}*\n` +
      sizeLine +
      `   Quantity: ${item.qty}\n` +
      `   Unit price: ${item.price}`
    );
  });
  const typeLabel = orderType === "delivery" ? "🚗 Delivery" : "🪑 Dine In";
  const deliveryNote =
    orderType === "delivery"
      ? "\n\n📍 *Delivery note*\nPlease send your current location on WhatsApp after placing the order.\nمن فضلك أرسل موقعك الحالي على واتساب بعد تأكيد الطلب."
      : "";

  return (
    `🍔 *NEW ORDER | ANDIAMOS*\n\n` +
    `📋 *Order type:* ${typeLabel}\n` +
    `🧾 *Items:* ${items.length}\n\n` +
    lines.join("\n\n") +
    deliveryNote +
    `\n\n━━━━━━━━━━━━━━\n📱 _Sent from website_`
  );
}

export default function CartDrawer() {
  const { items, adjust, clear, count } = useCart();
  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState("dinein");

  const sendOrder = () => {
    const msg = encodeURIComponent(buildMessage(items, orderType));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <>
      {/* Floating cart button */}
      <button
        className={`cart-fab${count > 0 ? " has-items" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        🛒
        {count > 0 && <span className="cart-badge" key={count}>{count}</span>}
      </button>

      {/* Overlay */}
      {open && (
        <div className="cart-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`cart-drawer${open ? " open" : ""}`}>
        <div className="cart-drawer-header">
          <h3>Your Order</h3>
          <button className="cart-close" onClick={() => setOpen(false)} aria-label="Close cart">✕</button>
        </div>

        {/* Delivery / Dine In toggle */}
        <div className="order-type-toggle">
          <button
            className={`order-type-btn${orderType === "delivery" ? " active" : ""}`}
            onClick={() => setOrderType("delivery")}
          >
            🚗 Delivery
          </button>
          <button
            className={`order-type-btn${orderType === "dinein" ? " active" : ""}`}
            onClick={() => setOrderType("dinein")}
          >
            🪑 Dine In
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <p className="cart-empty">No items yet — browse the menu!</p>
          ) : (
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.cartKey || item.name} className="cart-item">
                  <img src={item.img} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}{item.size ? ` (${item.size})` : ''}</p>
                    <p className="cart-item-price">{item.price}</p>
                  </div>
                  <div className="cart-qty">
                    <button onClick={() => adjust(item.cartKey || item.name, -1)} aria-label="Decrease">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => adjust(item.cartKey || item.name, +1)} aria-label="Increase">+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {orderType === "delivery" && (
              <div className="delivery-notice" role="note" aria-live="polite">
                Please send your current location on WhatsApp after placing the order.
                <br />
                من فضلك أرسل موقعك الحالي على واتساب بعد تأكيد الطلب
              </div>
            )}

            <button className="btn-whatsapp" onClick={sendOrder}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send Order via WhatsApp
            </button>
            <button className="btn-clear" onClick={clear}>Clear order</button>
          </div>
        )}
      </div>
    </>
  );
}
