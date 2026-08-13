import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-container">
        <a href="#hero" className="logo">🍔 Andiamos</a>

        <button
          className={`hamburger${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`nav-links${open ? " open" : ""}`}>
          <li><a href="#menu"    onClick={close}>Menu</a></li>
          <li><a href="#offers"  onClick={close}>Offers</a></li>
          <li><a href="#contact" onClick={close}>Contact</a></li>
          <li><a href="#contact" className="nav-cta" onClick={close}>Order Now</a></li>
        </ul>
      </div>
    </nav>
  );
}
