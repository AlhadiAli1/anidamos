import { useEffect, useRef, useState } from "react";
import { getRestaurantConfig } from "../data/restaurantConfig";
import { useCart } from "../context/CartContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const imageFocusClass = {
  Wings: " image-focus-wings",
  Shrimps: " image-focus-shrimps",
  Crispy: " image-focus-crispy",
  "Sandwich Tawook": " image-focus-tawook",
};

export const TABS = [
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
  const [selectedItem, setSelectedItem] = useState("");
  const [addedItem, setAddedItem] = useState("");
  const { add } = useCart();
  const menuData = getRestaurantConfig().menu;
  const menuRef = useRef(null);
  const addedTimerRef = useRef(null);

  useScrollReveal(menuRef, [active]);

  // Lets the QuickNav floating button jump straight to a category from anywhere on the page.
  useEffect(() => {
    const onSelectCategory = (event) => setActive(event.detail);
    window.addEventListener("andiamos:select-category", onSelectCategory);
    return () => window.removeEventListener("andiamos:select-category", onSelectCategory);
  }, []);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) {
        clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  const getSizeFor = (item) => selectedSizes[item.name] || Object.keys(item.sizes || {})[0];

  const handleAdd = (item) => {
    const key = item.sizes ? `${item.name}|${getSizeFor(item)}` : item.name;

    if (item.sizes) {
      const size = getSizeFor(item);
      add({ ...item, price: item.sizes[size], size });
    } else {
      add(item);
    }

    setSelectedItem(item.name);
    setAddedItem(key);

    if (addedTimerRef.current) {
      clearTimeout(addedTimerRef.current);
    }

    addedTimerRef.current = setTimeout(() => setAddedItem(""), 900);
  };

  return (
    <section className="section menu-section" id="menu" ref={menuRef}>
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">Our Menu</span>
          <h2>What Are You Craving?</h2>
          <p className="section-subtitle-ar">شو جاي <span className="ar-last-word">عبالك؟</span></p>
          <p>Something for everyone – from stacked burgers to wood-fired pizza.</p>
        </div>

        <div className="menu-tabs reveal-on-scroll">
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
          {menuData[active].map((item, index) => {
            const itemKey = item.sizes ? `${item.name}|${getSizeFor(item)}` : item.name;

            return (
            <div
              className={`menu-card reveal-on-scroll${selectedItem === item.name ? " selected" : ""}${addedItem === itemKey ? " just-added" : ""}`}
              key={item.name}
              style={{ "--reveal-delay": `${Math.min(index, 8) * 70}ms` }}
            >
              <button
                className={`menu-image-button${imageFocusClass[item.name] || ""}`}
                onClick={() => setSelectedItem(item.name)}
                type="button"
                aria-label={`View ${item.name}`}
              >
                <img src={item.img} alt={item.name} loading="lazy" />
              </button>
              <div className="menu-card-body">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                {item.sizes && (
                  <div className="size-selector">
                    {Object.keys(item.sizes).map((s) => (
                      <button
                        key={s}
                        className={`size-btn${getSizeFor(item) === s ? " active" : ""}`}
                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.name]: s }))}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="menu-card-footer">
                  <span className="price">
                    {item.sizes ? item.sizes[getSizeFor(item)] : item.price}
                  </span>
                  <button className="add-btn" onClick={() => handleAdd(item)} aria-label={`Add ${item.name}`} title="Add to order">+</button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
