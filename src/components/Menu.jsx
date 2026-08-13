import { useState } from "react";
import { menuData } from "../data/menuData";

const TABS = ["burgers", "sides", "drinks", "desserts"];

export default function Menu() {
  const [active, setActive] = useState("burgers");

  return (
    <section className="section" id="menu">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Menu</span>
          <h2>What Are You Craving?</h2>
          <p>Something for everyone – from stacked burgers to loaded fries.</p>
        </div>

        <div className="menu-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-btn${active === tab ? " active" : ""}`}
              onClick={() => setActive(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {menuData[active].map((item) => (
            <div className="menu-card" key={item.name}>
              <img src={item.img} alt={item.name} loading="lazy" />
              <div className="menu-card-body">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <div className="menu-card-footer">
                  <span className="price">{item.price}</span>
                  <button className="add-btn" aria-label={`Add ${item.name}`} title="Add to order">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
