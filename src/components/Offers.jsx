import { useCart } from "../context/CartContext";

const offers = [
  {
    badge: "🔥 Best Seller",
    featured: true,
    title: "Zinger + Fries + Pepsi",
    desc: "1 Zinger sandwich + Fries 500g + Pepsi",
    oldPrice: "1,000,000 LBP",
    newPrice: "850,000 LBP",
    img: "/images/pexels-1600711.jpg",
    items: [
      { name: "Zinger", qty: 1 },
      { name: "Fries 500g", qty: 1 },
      { name: "Pepsi", qty: 1 },
    ],
  },
  {
    badge: "⭐ Combo",
    title: "2 Fajita + Pepsi",
    desc: "2 Fajita sandwiches + 1 Pepsi",
    oldPrice: "900,000 LBP",
    newPrice: "780,000 LBP",
    img: "/images/pexels-1640777.jpg",
    items: [
      { name: "Fajita", qty: 2 },
      { name: "Pepsi", qty: 1 },
    ],
  },
  {
    badge: "🥤 Refresh",
    title: "Chicken Sub + Diet 7Up",
    desc: "1 Chicken Sub + 1 Diet 7Up",
    oldPrice: "500,000 LBP",
    newPrice: "450,000 LBP",
    img: "/images/pexels-3219483.jpg",
    items: [
      { name: "Chicken Sub", qty: 1 },
      { name: "Diet 7Up", qty: 1 },
    ],
  },
];

export default function Offers() {
  const { add } = useCart();

  const addOfferToCart = (offer) => {
    add({
      name: `Offer: ${offer.title}`,
      desc: offer.desc,
      price: offer.newPrice,
      img: offer.img,
    });
  };

  return (
    <section className="section section-dark" id="offers">
      <div className="container">
        <div className="section-header light">
          <span className="section-tag">Hot Deals</span>
          <h2>Today's Offers</h2>
          <p>Limited-time combos and bundles you won't want to miss.</p>
        </div>

        <div className="offers-grid">
          {offers.map((o) => (
            <div className={`offer-card${o.featured ? " featured" : ""}`} key={o.title}>
              <div className="offer-badge">{o.badge}</div>
              <div className="offer-img">
                <img src={o.img} alt={o.title} loading="lazy" />
              </div>
              <div className="offer-body">
                <h3>{o.title}</h3>
                <p>{o.desc}</p>
                <div className="offer-price">
                  <span className="old-price">{o.oldPrice}</span>
                  <span className="new-price">{o.newPrice}</span>
                </div>
                <button className="btn btn-primary" onClick={() => addOfferToCart(o)} type="button">
                  Grab Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
