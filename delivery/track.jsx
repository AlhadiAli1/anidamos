import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./delivery.css";

const STATUS = {
  pending: ["Order received", "Your order is waiting for the driver."],
  accepted: ["Driver is on the way", "Your driver has taken the order."],
  delivered: ["Delivered", "Your order has been delivered. Enjoy your meal!"],
  cancelled: ["Order cancelled", "Please contact the restaurant for help."],
};

function TrackingPage() {
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadDelivery = async () => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setError("This tracking link is invalid.");
      return;
    }
    setRefreshing(true);
    setError("");
    try {
      const response = await fetch(`/.netlify/functions/delivery-track?id=${encodeURIComponent(id)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load delivery.");
      setDelivery(data.delivery);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDelivery();
  }, []);

  if (error) return <main className="dl-track-shell"><section className="dl-track-card"><h1>Delivery tracking</h1><p className="dl-error">{error}</p></section></main>;
  if (!delivery) return <main className="dl-track-shell"><section className="dl-track-card"><p className="dl-muted">Loading your delivery…</p></section></main>;

  const [heading, message] = STATUS[delivery.status] || [delivery.status, ""];
  return <main className="dl-track-shell"><section className="dl-track-card">
    <p className="dl-eyebrow">Andiamo's delivery</p>
    <h1>{heading}</h1>
    <p className="dl-track-welcome" lang="ar" dir="rtl">أهلاً بك في خدمة تتبع الطلبات من andiamios</p>
    <p className="dl-track-message">{message}</p>
    {delivery.status === "accepted" && <p className="dl-track-arabic" lang="ar" dir="rtl">السائق في طريقه إليك</p>}
    <div className={`dl-status dl-status--${delivery.status}`}>{heading}</div>
    <p className="dl-track-order">{delivery.title}</p>
    <p className="dl-track-price">Price: {delivery.price}</p>
    <button className="dl-btn dl-btn-primary dl-track-refresh" onClick={loadDelivery} disabled={refreshing}>{refreshing ? "Refreshing..." : "Refresh"}</button>
    <p className="dl-muted">Refresh to see the latest delivery status.</p>
  </section></main>;
}

createRoot(document.getElementById("root")).render(<StrictMode><TrackingPage /></StrictMode>);