export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <span className="hero-badge">Fresh · Fast · Flavourful</span>
          <h1>
            Taste the <span className="highlight">Difference</span>
          </h1>
          <p>Handcrafted burgers, crispy sides &amp; bold flavours – ready in minutes.</p>
          <div className="hero-cta">
            <a href="#menu"   className="btn btn-primary">Explore Menu</a>
            <a href="#offers" className="btn btn-outline">Today's Deals</a>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-img-wrap">
            <img
              src="/images/hero-burger.jpg"
              alt="Andiamos signature burger"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
