import { getRestaurantConfig } from "../data/restaurantConfig";

export default function Contact() {
  const { contact } = getRestaurantConfig();
  return (
    <section className="section section-contact" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Get In Touch</span>
          <h2>Find Us or Order Now</h2>
        </div>

        <div className="contact-info-centered">
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div><strong>Location</strong><p>{contact.location}</p></div>
          </div>
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div><strong>Phone</strong><p>{contact.phone}</p></div>
          </div>
          <div className="info-item">
            <span className="info-icon">⏰</span>
            <div>
              <strong>Hours</strong>
              <p>{contact.hours}</p>
            </div>
          </div>
          <a href="#menu" className="btn btn-primary contact-cart-btn">🛒 Check Cart &amp; Order</a>
        </div>
      </div>
    </section>
  );
}
