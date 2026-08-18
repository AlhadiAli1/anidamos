import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  defaultRestaurantConfig,
  getRestaurantConfig,
  saveRestaurantConfig,
} from "../src/data/restaurantConfig";
import "./admin.css";

const ADMIN_SESSION_KEY = "andiamo.admin-session";
const ADMIN_USERNAME = "andiamos";
const ADMIN_PASSWORD = "andiamos123";

const categoryLabels = {
  burgers: "Burgers",
  sandwiches: "Sandwiches",
  pizza: "Pizza",
  mashiweh: "Mashiweh",
  crispy: "Crispy, Wings & Shrimps",
  sides: "Appetizers",
  drinks: "Drinks",
};

const emptyItem = (category) => ({
  name: "",
  desc: "",
  price: "",
  img: "",
  category,
  hasSizes: false,
  mediumPrice: "",
  largePrice: "",
});

const emptyOffer = () => ({ badge: "", title: "", desc: "", oldPrice: "", newPrice: "", img: "", featured: false });

function toFormItem(item, category) {
  return {
    name: item.name,
    desc: item.desc,
    price: item.price || "",
    img: item.img || "",
    category,
    hasSizes: Boolean(item.sizes),
    mediumPrice: item.sizes?.M || "",
    largePrice: item.sizes?.L || "",
  };
}

function toMenuItem(form) {
  const item = { name: form.name.trim(), desc: form.desc.trim(), img: form.img.trim() };
  if (form.hasSizes) {
    item.sizes = { M: form.mediumPrice.trim(), L: form.largePrice.trim() };
  } else {
    item.price = form.price.trim();
  }
  return item;
}

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
      onLogin();
      return;
    }
    setError("Incorrect username or password.");
  };

  return (
    <main className="login-shell">
      <form className="login-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">Restricted area</p>
        <h1>Andiamo's Admin</h1>
        <p className="login-copy">Sign in to manage the restaurant information and menu.</p>
        <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="primary-button" type="submit">Sign in</button>
      </form>
    </main>
  );
}

function AdminDashboard() {
  const [config, setConfig] = useState(getRestaurantConfig);
  const [activeCategory, setActiveCategory] = useState("burgers");
  const [draft, setDraft] = useState(null);
  const [offerDraft, setOfferDraft] = useState(null);
  const [notice, setNotice] = useState("");

  const updateContact = (event) => {
    const { name, value } = event.target;
    setConfig((current) => ({
      ...current,
      contact: { ...current.contact, [name]: value },
    }));
  };

  const persist = (nextConfig = config) => {
    saveRestaurantConfig(nextConfig);
    setNotice("Changes saved.");
  };

  const saveItem = (event) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.desc.trim() || (!draft.hasSizes && !draft.price.trim())) return;

    const item = toMenuItem(draft);
    const nextMenu = Object.fromEntries(Object.entries(config.menu).map(([category, items]) => [
      category,
      category === draft.category
        ? draft.index === undefined
          ? [...items, item]
          : items.map((currentItem, index) => index === draft.index ? item : currentItem)
        : items,
    ]));
    const nextConfig = { ...config, menu: nextMenu };
    setConfig(nextConfig);
    persist(nextConfig);
    setDraft(null);
  };

  const deleteItem = (index) => {
    const nextConfig = {
      ...config,
      menu: {
        ...config.menu,
        [activeCategory]: config.menu[activeCategory].filter((_, itemIndex) => itemIndex !== index),
      },
    };
    setConfig(nextConfig);
    persist(nextConfig);
  };

  const updateOfferDraft = (event) => {
    const { name, value, type, checked } = event.target;
    setOfferDraft((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const saveOffer = (event) => {
    event.preventDefault();
    if (!offerDraft.title.trim() || !offerDraft.desc.trim() || !offerDraft.newPrice.trim()) return;
    const { index, ...offer } = offerDraft;
    const nextConfig = {
      ...config,
      offers: index === undefined
        ? [...config.offers, offer]
        : config.offers.map((currentOffer, offerIndex) => offerIndex === index ? offer : currentOffer),
    };
    setConfig(nextConfig);
    persist(nextConfig);
    setOfferDraft(null);
  };

  const deleteOffer = (index) => {
    const nextConfig = { ...config, offers: config.offers.filter((_, offerIndex) => offerIndex !== index) };
    setConfig(nextConfig);
    persist(nextConfig);
  };

  const resetConfig = () => {
    if (!window.confirm("Restore the original menu and contact details?")) return;
    setConfig(defaultRestaurantConfig);
    saveRestaurantConfig(defaultRestaurantConfig);
    setDraft(null);
    setNotice("Original information restored.");
  };

  const updateDraft = (event) => {
    const { name, value, type, checked } = event.target;
    setDraft((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const items = config.menu[activeCategory] || [];

  const logout = () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.location.reload();
  };

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><p className="eyebrow">Restaurant management</p><h1>Andiamo's Admin</h1></div>
        <div className="header-actions"><button className="secondary-button" onClick={resetConfig}>Restore defaults</button><button className="secondary-button" onClick={logout}>Sign out</button></div>
      </header>
      {notice && <p className="notice" role="status">{notice}</p>}

      <section className="panel contact-panel">
        <div className="panel-heading"><div><p className="eyebrow">Business information</p><h2>Contact details</h2></div><button className="primary-button" onClick={() => persist()}>Save details</button></div>
        <div className="form-grid">
          <label>Phone number<input name="phone" value={config.contact.phone} onChange={updateContact} /></label>
          <label>Location<input name="location" value={config.contact.location} onChange={updateContact} /></label>
          <label>Opening hours<input name="hours" value={config.contact.hours} onChange={updateContact} /></label>
        </div>
      </section>

      <section className="panel offers-panel">
        <div className="panel-heading"><div><p className="eyebrow">Specials</p><h2>Offers</h2></div><button className="primary-button" onClick={() => setOfferDraft(emptyOffer())}>Add offer</button></div>
        {offerDraft && <form className="item-form" onSubmit={saveOffer}>
          <div className="form-grid"><label>Offer title<input name="title" value={offerDraft.title} onChange={updateOfferDraft} required /></label><label>Badge<input name="badge" value={offerDraft.badge} onChange={updateOfferDraft} placeholder="Best Seller" /></label><label>Image URL<input name="img" value={offerDraft.img} onChange={updateOfferDraft} placeholder="/images/offer.jpg" /></label></div>
          <label>Description<textarea name="desc" value={offerDraft.desc} onChange={updateOfferDraft} rows="3" required /></label>
          <div className="form-grid"><label>Original price<input name="oldPrice" value={offerDraft.oldPrice} onChange={updateOfferDraft} /></label><label>Offer price<input name="newPrice" value={offerDraft.newPrice} onChange={updateOfferDraft} required /></label><label className="checkbox-label"><input type="checkbox" name="featured" checked={offerDraft.featured} onChange={updateOfferDraft} /> Featured offer</label></div>
          <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setOfferDraft(null)}>Cancel</button><button className="primary-button" type="submit">Save offer</button></div>
        </form>}
        <div className="item-list">{config.offers.map((offer, index) => <article className="item-row" key={`${offer.title}-${index}`}><img src={offer.img} alt="" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} /><div><h3>{offer.title}</h3><p>{offer.desc}</p><strong>{offer.newPrice}{offer.featured ? " | Featured" : ""}</strong></div><div className="row-actions"><button className="icon-button" aria-label={`Edit ${offer.title}`} title="Edit offer" onClick={() => setOfferDraft({ ...offer, index })}>Edit</button><button className="icon-button danger" aria-label={`Delete ${offer.title}`} title="Delete offer" onClick={() => deleteOffer(index)}>Delete</button></div></article>)}</div>
      </section>

      <section className="management-layout">
        <aside className="panel categories"><p className="eyebrow">Menu</p><h2>Categories</h2>{Object.entries(categoryLabels).map(([key, label]) => <button key={key} className={activeCategory === key ? "category active" : "category"} onClick={() => { setActiveCategory(key); setDraft(null); }}>{label}<span>{config.menu[key]?.length || 0}</span></button>)}</aside>
        <section className="panel items-panel">
          <div className="panel-heading"><div><p className="eyebrow">{categoryLabels[activeCategory]}</p><h2>Menu items</h2></div><button className="primary-button" onClick={() => setDraft(emptyItem(activeCategory))}>Add item</button></div>
          {draft && <form className="item-form" onSubmit={saveItem}>
            <div className="form-grid"><label>Name<input name="name" value={draft.name} onChange={updateDraft} required /></label><label>Image URL<input name="img" value={draft.img} onChange={updateDraft} placeholder="/images/item.jpg" /></label></div>
            <label>Description<textarea name="desc" value={draft.desc} onChange={updateDraft} required rows="3" /></label>
            <label className="checkbox-label"><input type="checkbox" name="hasSizes" checked={draft.hasSizes} onChange={updateDraft} /> Pizza item with medium and large prices</label>
            {draft.hasSizes ? <div className="form-grid"><label>Medium price<input name="mediumPrice" value={draft.mediumPrice} onChange={updateDraft} required /></label><label>Large price<input name="largePrice" value={draft.largePrice} onChange={updateDraft} required /></label></div> : <label>Price<input name="price" value={draft.price} onChange={updateDraft} required /></label>}
            <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setDraft(null)}>Cancel</button><button className="primary-button" type="submit">Save item</button></div>
          </form>}
          <div className="item-list">{items.map((item, index) => <article className="item-row" key={`${item.name}-${index}`}><img src={item.img} alt="" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} /><div><h3>{item.name}</h3><p>{item.desc}</p><strong>{item.sizes ? `M: ${item.sizes.M} | L: ${item.sizes.L}` : item.price}</strong></div><div className="row-actions"><button className="icon-button" aria-label={`Edit ${item.name}`} title="Edit item" onClick={() => setDraft({ ...toFormItem(item, activeCategory), index })}>Edit</button><button className="icon-button danger" aria-label={`Delete ${item.name}`} title="Delete item" onClick={() => deleteItem(index)}>Delete</button></div></article>)}</div>
        </section>
      </section>
    </main>
  );
}

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(() => window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "authenticated");

  return authenticated ? <AdminDashboard /> : <Login onLogin={() => setAuthenticated(true)} />;
}

createRoot(document.getElementById("root")).render(<StrictMode><AdminApp /></StrictMode>);