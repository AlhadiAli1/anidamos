const features = [
  { icon: "🥩", title: "Fresh Ingredients",  desc: "We source locally . Every bite is made fresh." },
  { icon: "⚡", title: "Lightning Fast",      desc: "Order ready in under few minutes. We respect your time." },
  { icon: "💰", title: "Great Value",         desc: "Premium taste without the premium price tag. Always." },
  { icon: "🌿", title: "Veggie Friendly",     desc: "Dedicated plant-based options for every menu category." },
];

export default function Features() {
  return (
    <section className="section" id="why">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Why Andiamos</span>
          <h2>Fast Food Done Right</h2>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
