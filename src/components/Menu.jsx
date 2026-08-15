import { useState } from "react";
import { menuData } from "../data/menuData";
import { useCart } from "../context/CartContext";

const TABS = [
  { key: "burgers", label: "Burgers" },
  { key: "sandwiches", label: "Sandwiches" },
  { key: "pizza", label: "Pizza" },
  { key: "mashiweh", label: "Mashiweh" },
  { key: "crispy", label: "Crispy, Wings & Shrimps" },
  { key: "sides", label: "Appetizers" },
  { key: "drinks", label: "Drinks" },
];

export default function Menu() {
  const [active, setActive] = useState("burgers");
  const [selectedSizes, setSelectedSizes] = useState({});
  const { add } = useCart();

  const getSizeFor = (name) => selectedSizes[name] || "M";

  const handleAdd = (item) => {
    if (item.sizes) {
      const size = getSizeFor(item.name);
      add({ ...item, price: item.sizes[size], size });
    } else {
      add(item);
    }
  };

  return (
    <section className="section" id="menu">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Menu</span>
          <h2>What Are You Craving?</h2>
          <p className="section-subtitle-ar">شو جاي <span className="ar-last-word">عبالك؟</span></p>
          <p>Something for everyone – from stacked burgers to wood-fired pizza.</p>
        </div>

        <div className="menu-tabs">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={`tab-btn${active === key ? " active" : ""}`}
              onClick={() => setActive(key)}
            >
              {label}
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
                {item.sizes && (
                  <div className="size-selector">
                    {Object.keys(item.sizes).map((s) => (
                      <button
                        key={s}
                        className={`size-btn${getSizeFor(item.name) === s ? " active" : ""}`}
                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.name]: s }))}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="menu-card-footer">
                  <span className="price">
                    {item.sizes ? item.sizes[getSizeFor(item.name)] : item.price}
                  </span>
                  <button className="add-btn" onClick={() => handleAdd(item)} aria-label={`Add ${item.name}`} title="Add to order">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
