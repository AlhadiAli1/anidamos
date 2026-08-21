export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-atmosphere" aria-hidden="true">
        <img
          className="hero-backdrop-img"
          src="/images/back.png"
          alt=""
          onError={(event) => {
            event.currentTarget.src = "/images/pexels-3219483.jpg";
          }}
        />
        <div className="hero-cinema-beam" />
      </div>
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
          <div className="hero-plate-shadow" aria-hidden="true" />
          <div className="hero-img-wrap hero-logo-wrap">
            <img
              src="/images/image.png"
              alt="Andiamo's Restaurant logo"
              onError={(event) => {
                event.currentTarget.src = "/images/hero-burger.jpg";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
