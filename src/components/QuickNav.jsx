import { useState } from "react";
import { TABS } from "./Menu";

export default function QuickNav() {
  const [open, setOpen] = useState(false);

  const goToCategory = (key) => {
    window.dispatchEvent(new CustomEvent("andiamos:select-category", { detail: key }));
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const goToOffers = () => {
    document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <div className="quicknav">
      {open && (
        <div className="quicknav-panel" role="menu">
          <p className="quicknav-heading">Jump to</p>
          <button className="quicknav-item" onClick={goToOffers} type="button">🔥 Offers</button>
          {TABS.map(({ key, label }) => (
            <button key={key} className="quicknav-item" onClick={() => goToCategory(key)} type="button">
              {label}
            </button>
          ))}
        </div>
      )}
      <button
        className={`quicknav-fab${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Jump to menu category or offers"
        aria-expanded={open}
        type="button"
      >
        {open ? "✕" : "📋"}
      </button>
    </div>
  );
}
