import { useEffect, useRef, useState } from "react";
import { getRestaurantConfig } from "../data/restaurantConfig";
import { TABS } from "../data/menuTabs";
import { useCart } from "../context/cartCtx";
import { useScrollReveal } from "../hooks/useScrollReveal";

const imageFocusClass = {
  Wings: " image-focus-wings",
  Shrimps: " image-focus-shrimps",
  Crispy: " image-focus-crispy",
  "Sandwich Tawook": " image-focus-tawook",
};

const getIngredients = (description) => description
  .replace(/\.$/, "")
  .replace(/,?\s+and\s+/gi, ", ")
  .split(",")
  .map((ingredient) => ingredient.trim())
  .filter(Boolean);

const ingredientIcons = [
  [/onion rings/, "onion-rings.png"], [/mozzarella sticks/, "mozzarella-sticks.png"],
  [/jalapeno poppers/, "jalapeno-poppers.png"], [/chicken wings|wings/, "chicken-wings.png"],
  [/curly fries/, "curly-fries.png"], [/grilled tomato/, "grilled-tomato.png"],
  [/fried chicken strips/, "fried-chicken-strips.png"], [/fried chicken fillet|fried chicken|crispy/, "fried-chicken-fillet.png"],
  [/marinated chicken/, "marinated-chicken.png"], [/grilled chicken/, "grilled-chicken.png"],
  [/sliced fillet|fillet/, "sliced-fillet-steak.png"], [/double patty/, "double-patty.png"],
  [/squared mozzarella/, "squared-mozzarella-patty.png"],
  [/beef|patty/, "beef-patty.png"], [/grilled shrimp/, "grilled-shrimp.png"],
  [/fried shrimp|shrimp/, "fried-shrimp.png"], [/kafta/, "kafta.png"], [/lahmeh/, "lahmeh-meshwi.png"],
  [/tawook/, "tawook.png"],
  [/grilled mozzarella/, "grilled-mozzarella.png"], [/mozzarella/, "mozzarella-cheese.png"],
  [/cheddar/, "cheddar-cheese.png"], [/emmental/, "emmental-cheese.png"], [/smoked turkey/, "smoked-turkey.png"],
  [/smoked cheese/, "smoke-cheese.png"], [/lettuce/, "lettuce.png"], [/tomato/, "tomato.png"],
  [/grilled onion/, "grilled-onions.png"], [/onion|biwaz/, "onion.png"], [/pickles?/, "pickles.png"],
  [/jalape[nñ]o/, "jalapeno.png"], [/green peppers|peppers/, "grilled-green-peppers.png"],
  [/carrots?/, "grilled-carrots.png"], [/mushroom/, "mushroom.png"], [/corn/, "sweet-corn.png"],
  [/mayonnaise/, "mayonnaise.png"], [/garlic/, "garlic-sauce.png"], [/alfredo/, "alfredo-sauce.png"],
  [/bbq/, "bbq-sauce.png"], [/butter spicy/, "butter-spicy-sauce.png"], [/spicy sauce/, "spicy-sauce.png"],
  [/andiamos? sauce/, "andiamos-sauce.png"], [/pesto/, "andiamos-pesto-sauce.png"], [/cocktail/, "cocktail-sauce.png"],
  [/ketchup/, "ketchup.png"], [/mustard/, "mustard.png"], [/fries/, "fries.png"], [/wedges/, "wedges.png"],
  [/cole slaw/, "cole-slaw.png"], [/hummus/, "hummus.png"], [/grilled egg/, "grilled-egg.png"],
  [/bread/, "bread.png"], [/buns?/, "buns.png"], [/rocca|rocket/, "rocca.png"],
];

const getIngredientIcon = (ingredient) => {
  const value = ingredient.toLowerCase();
  return ingredientIcons.find(([pattern]) => pattern.test(value))?.[1];
};

export default function Menu() {
  const [active, setActive] = useState("burgers");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedItem, setSelectedItem] = useState("");
  const [addedItem, setAddedItem] = useState("");
  const { add } = useCart();
  const menuData = getRestaurantConfig().menu;
  const menuRef = useRef(null);
  const addedTimerRef = useRef(null);
  const gestureStartRef = useRef(null);
  const wheelTimerRef = useRef(null);

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

  const selectAdjacentCategory = (direction) => {
    setActive((current) => {
      const currentIndex = TABS.findIndex(({ key }) => key === current);
      const nextIndex = Math.max(0, Math.min(TABS.length - 1, currentIndex + direction));
      return TABS[nextIndex].key;
    });
  };

  const handlePointerDown = (event) => {
    if (event.pointerType !== "mouse") {
      gestureStartRef.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handlePointerUp = (event) => {
    const gestureStart = gestureStartRef.current;
    gestureStartRef.current = null;

    if (!gestureStart) return;

    const deltaX = event.clientX - gestureStart.x;
    const deltaY = event.clientY - gestureStart.y;

    if (Math.abs(deltaX) >= 56 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      selectAdjacentCategory(deltaX < 0 ? 1 : -1);
    }
  };

  const handleWheel = (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 24 || wheelTimerRef.current) {
      return;
    }

    selectAdjacentCategory(event.deltaX > 0 ? 1 : -1);
    wheelTimerRef.current = window.setTimeout(() => {
      wheelTimerRef.current = null;
    }, 360);
  };

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

        <div
          className="menu-grid"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { gestureStartRef.current = null; }}
          onWheel={handleWheel}
        >
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
                <div className="ingredient-details" aria-label={`Ingredients: ${item.desc}`}>
                  <ul className={`ingredient-list ingredient-cols-${Math.min(3, Math.max(1, getIngredients(item.desc).length))}`}>
                    {getIngredients(item.desc).map((ingredient) => {
                      const icon = getIngredientIcon(ingredient);

                      return (
                      <li className="ingredient-item" key={ingredient}>
                        {icon ? <img className="ingredient-icon" src={`/icons/${icon}`} alt="" aria-hidden="true" /> : null}
                        {ingredient}
                      </li>
                      );
                    })}
                  </ul>
                </div>
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
