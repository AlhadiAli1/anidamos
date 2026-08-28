import { useState, useEffect } from "react";
import { useAuth } from "../context/authCtx";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, openAuth, logout } = useAuth();

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
          {isAuthenticated && (
            <li>
              <a href="#account" className="nav-account" onClick={close}>
                <span>Welcome {user?.username || "Account"}</span>
                <small>★ ${Number(user?.points_balance ?? 0).toFixed(2)} credits</small>
              </a>
            </li>
          )}
          <li><a href="#menu" onClick={close}>Menu</a></li>
          <li><a href="#offers" onClick={close}>Offers</a></li>
          <li><a href="#account" onClick={close}>My Account</a></li>
          <li><a href="#contact" onClick={close}>Contact</a></li>
          {isAuthenticated ? (
            <>
              <li><button type="button" className="nav-logout" onClick={logout}>Logout</button></li>
            </>
          ) : (
            <li><button type="button" className="nav-cta" onClick={() => { close(); openAuth(); }}>Login</button></li>
          )}
        </ul>
      </div>
    </nav>
  );
}
