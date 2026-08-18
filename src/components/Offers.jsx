import { useCart } from "../context/CartContext";
import { getRestaurantConfig } from "../data/restaurantConfig";

export default function Offers() {
  const { add } = useCart();
  const { offers } = getRestaurantConfig();

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
