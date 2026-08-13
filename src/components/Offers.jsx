const offers = [
  {
    badge: "🔥 Best Seller",
    featured: true,
    title: "Classic Combo",
    desc: "Signature burger + fries + any drink",
    oldPrice: "$12.99",
    newPrice: "$8.99",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop",
  },
  {
    badge: "👨‍👩‍👧 Family",
    title: "Family Feast",
    desc: "4 burgers + 2 large fries + 4 drinks",
    oldPrice: "$44.99",
    newPrice: "$29.99",
    img: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&auto=format&fit=crop",
  },
  {
    badge: "🌙 Late Night",
    title: "Late Night Special",
    desc: "Double stack + loaded fries after 10 pm",
    oldPrice: "$14.99",
    newPrice: "$9.99",
    img: "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&auto=format&fit=crop",
  },
];

export default function Offers() {
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
                <a href="#contact" className="btn btn-primary">Grab Deal</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
