import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const update = (e) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: false }));
  };

  const submit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!fields.name.trim())    newErrors.name    = true;
    if (!fields.subject)        newErrors.subject = true;
    if (!fields.message.trim()) newErrors.message = true;
    if (!fields.email.trim() || !EMAIL_RE.test(fields.email)) newErrors.email = true;

    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setFields({ name: "", email: "", subject: "", message: "" });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  const cls = (name) => `form-group${errors[name] ? " has-error" : ""}`;

  return (
    <section className="section section-contact" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Get In Touch</span>
          <h2>Find Us or Order Now</h2>
        </div>

        <div className="contact-layout">
          <div className="contact-info">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div><strong>Location</strong><p>123 Flavour Street, Food City, FC 10001</p></div>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <div><strong>Phone</strong><p>+1 (555) 123-4567</p></div>
            </div>
            <div className="info-item">
              <span className="info-icon">⏰</span>
              <div>
                <strong>Hours</strong>
                <p>Mon – Thu: 11am – 11pm<br />Fri – Sun: 11am – 1am</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📧</span>
              <div><strong>Email</strong><p>hello@andiamos.com</p></div>
            </div>
            <div className="social-links">
              <a href="#" className="social-btn">📸 Instagram</a>
              <a href="#" className="social-btn">👍 Facebook</a>
              <a href="#" className="social-btn">🎵 TikTok</a>
            </div>
          </div>

          <form className="contact-form" onSubmit={submit} noValidate>
            <div className={cls("name")}>
              <label htmlFor="name">Your Name</label>
              <input id="name" name="name" placeholder="John Doe" value={fields.name} onChange={update} />
            </div>
            <div className={cls("email")}>
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" placeholder="john@example.com" value={fields.email} onChange={update} />
            </div>
            <div className={cls("subject")}>
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" value={fields.subject} onChange={update}>
                <option value="">Select a topic…</option>
                <option value="order">Place an Order Enquiry</option>
                <option value="feedback">Leave Feedback</option>
                <option value="catering">Catering Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={cls("message")}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={4} placeholder="Write your message here…" value={fields.message} onChange={update} />
            </div>
            <button type="submit" className="btn btn-primary btn-full">Send Message</button>
            {success && <p className="form-success">✅ Message sent! We'll get back to you soon.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
