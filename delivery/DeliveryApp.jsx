import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = "/.netlify/functions";
const TOKEN_KEY = (role) => `andiamo.delivery.${role}`;

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Taken",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const DELIVERY_AREAS = [
  { name: "Baraachit", fee: 200000 },
  { name: "Safad", fee: 200000 },
  { name: "Tebnin", fee: 300000 },
  { name: "Haris", fee: 350000 },
  { name: "Jmayjme", fee: 250000 },
  { name: "Shakra", fee: 200000 },
  { name: "Sultaneye", fee: 250000 },
];

function formatLL(amount) {
  return `${Number(amount || 0).toLocaleString("en-US")} LL`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function buildWhatsAppMessage(delivery, statusLabel, driverName) {
  const lines = [`🚚 *DELIVERY | ANDIAMOS*`, ``];
  lines.push(`🆔 Order: ${delivery.title}`);
  if (delivery.details) lines.push(`📋 Details: ${delivery.details}`);
  lines.push(`💰 Price: ${delivery.price}`);
  if (delivery.address) lines.push(`📍 Address: ${delivery.address}`);
  if (delivery.customer_phone) lines.push(`👤 Customer: +${delivery.customer_phone}`);
  if (driverName) lines.push(`🧑🍳 Driver: ${driverName}`);
  lines.push(`📌 Status: ${statusLabel}`);
  lines.push(``, `Please confirm and deliver. — Andiamo's`);
  return lines.join("\n");
}

async function api(path, options, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function ManagerLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api("/delivery-login", {
        method: "POST",
        body: JSON.stringify({ role: "manager", password }),
      });
      window.sessionStorage.setItem(TOKEN_KEY("manager"), data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="dl-login-shell">
      <form className="dl-login-panel" onSubmit={submit}>
        <p className="dl-eyebrow">Andiamo's · Restricted</p>
        <h1>Delivery Manager</h1>
        <p className="dl-login-copy">Enter your password to manage deliveries and drivers.</p>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" autoFocus required />
        </label>
        {error && <p className="dl-error" role="alert">{error}</p>}
        <button className="dl-btn dl-btn-primary" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

function AgentLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api("/delivery-login", {
        method: "POST",
        body: JSON.stringify({ role: "delivery", username, password }),
      });
      window.sessionStorage.setItem(TOKEN_KEY("delivery"), data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="dl-login-shell">
      <form className="dl-login-panel" onSubmit={submit}>
        <p className="dl-eyebrow">Andiamo's · On the road</p>
        <h1>Delivery Agent</h1>
        <p className="dl-login-copy">Sign in with the username your manager set up for you.</p>
        <label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
        {error && <p className="dl-error" role="alert">{error}</p>}
        <button className="dl-btn dl-btn-primary" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

function DeliveryCard({ delivery, actions, agentActions = false }) {
  return (
    <article className={`dl-card dl-card--${delivery.status}`}>
      <div className="dl-card-main">
        <div className="dl-card-top">
          <h3>{delivery.title}</h3>
        </div>
        {delivery.manager_note && <p className="dl-driver-note">{delivery.manager_note}</p>}
        {delivery.details && <p className="dl-details">{delivery.details}</p>}
        <div className="dl-meta">
          <span><b>Price:</b> {delivery.price}</span>
          {delivery.address && <span><b>Address:</b> {delivery.address}</span>}
          <span><b>Delivery fee:</b> {formatLL(delivery.delivery_fee)}</span>
          {delivery.agent && delivery.agent.name && <span><b>Driver:</b> {delivery.agent.name}</span>}
          {delivery.customer_phone && <span><b>Customer:</b> +{delivery.customer_phone}</span>}
          {delivery.accepted_at && <span><b>Accepted:</b> {formatTime(delivery.accepted_at)}</span>}
          <span><b>Sent:</b> {formatTime(delivery.created_at)}</span>
        </div>
        <div className="dl-card-status">
          <span className={`dl-status dl-status--${delivery.status}`}>{STATUS_LABELS[delivery.status] || delivery.status}</span>
        </div>
      </div>
      {actions && <div className={agentActions ? "dl-actions dl-actions--agent" : "dl-actions"}>{actions}</div>}
    </article>
  );
}

function ManagerView({ token, onLogout }) {
  const [deliveries, setDeliveries] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false);
  const [addingAgent, setAddingAgent] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("new");
  const [createdDelivery, setCreatedDelivery] = useState(null);
  const [agentForm, setAgentForm] = useState({ name: "", username: "", password: "", phone: "" });
  const [form, setForm] = useState({
    price: "",
    customerPhone: "",
    agentId: "",
    address: "",
    customAddress: "",
    customFee: "",
    managerNote: "",
  });
  const refreshTimer = useRef(null);

  const load = useCallback(async () => {
    try {
      const [deliv, ag] = await Promise.all([
        api("/delivery-api", {}, token),
        api("/delivery-agents", {}, token),
      ]);
      setDeliveries(deliv.deliveries || []);
      setAgents(ag.agents || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
    refreshTimer.current = window.setInterval(load, 20000);
    return () => window.clearInterval(refreshTimer.current);
  }, [load]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateAgentForm = (event) => setAgentForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const create = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");
    try {
      const data = await api("/delivery-api", {
        method: "POST",
        body: JSON.stringify({
          price: form.price,
          customer_phone: form.customerPhone,
          agentId: form.agentId,
          address: form.address,
          custom_address: form.customAddress,
          delivery_fee: form.customFee,
          manager_note: form.managerNote,
        }),
      }, token);
      const agent = agents.find((a) => a.id === form.agentId);
      setNotice(`Sent "${data.delivery.title}" to ${agent ? agent.name : "the driver"} via WhatsApp.`);
      setCreatedDelivery(data.delivery);
      setForm({ price: "", customerPhone: "", agentId: "", address: "", customAddress: "", customFee: "", managerNote: "" });
      setCreating(false);
      setActiveTab("orders");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const saveAgent = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingAgent) {
        const payload = { id: editingAgent.id, name: agentForm.name, phone: agentForm.phone };
        if (agentForm.password) payload.password = agentForm.password;
        await api("/delivery-agents", { method: "PATCH", body: JSON.stringify(payload) }, token);
        setNotice("Driver updated.");
      } else {
        await api("/delivery-agents", {
          method: "POST",
          body: JSON.stringify({ name: agentForm.name, username: agentForm.username, password: agentForm.password, phone: agentForm.phone }),
        }, token);
        setNotice("Driver created. They can now sign in with this username.");
      }
      setAgentForm({ name: "", username: "", password: "", phone: "" });
      setAddingAgent(false);
      setEditingAgent(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditAgent = (agent) => {
    setEditingAgent(agent);
    setAgentForm({ name: agent.name, username: agent.username, password: "", phone: agent.phone });
  };

  const toggleAgent = async (agent) => {
    try {
      await api("/delivery-agents", { method: "PATCH", body: JSON.stringify({ id: agent.id, is_active: !agent.is_active }) }, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAgent = async (agent) => {
    if (!window.confirm(`Delete driver "${agent.name}"?`)) return;
    try {
      await api(`/delivery-agents?id=${agent.id}`, { method: "DELETE" }, token);
      setNotice("Driver deleted.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancel = async (delivery) => {
    if (!window.confirm(`Cancel delivery "${delivery.title}"?`)) return;
    try {
      await api("/delivery-api", { method: "PATCH", body: JSON.stringify({ id: delivery.id, action: "cancel" }) }, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const sendTrackingLink = (delivery) => {
    const trackingUrl = `${window.location.origin}/track?id=${encodeURIComponent(delivery.id)}`;
    const message = encodeURIComponent(
      `Andiamo's Delivery\n\nYour order is being prepared for delivery.\n\nFollow your order's live status here:\n${trackingUrl}\n\nThank you for choosing Andiamo's.`
    );
    window.open(`https://wa.me/${delivery.customer_phone}?text=${message}`, "_blank");
  };

  const sendCreatedTrackingLink = () => {
    if (!createdDelivery?.customer_phone) return;
    const trackingUrl = `${window.location.origin}/track?id=${encodeURIComponent(createdDelivery.id)}`;
    const message = encodeURIComponent(`Andiamo's Delivery\n\nYour order is being prepared for delivery.\n\nFollow your order's live status here:\n${trackingUrl}\n\nThank you for choosing Andiamo's.`);
    window.open(`https://wa.me/${createdDelivery.customer_phone}?text=${message}`, "_blank");
  };

  const counts = {
    pending: deliveries.filter((d) => d.status === "pending").length,
    accepted: deliveries.filter((d) => d.status === "accepted").length,
    delivered: deliveries.filter((d) => d.status === "delivered").length,
    cancelled: deliveries.filter((d) => d.status === "cancelled").length,
  };
  const agentEarnings = agents.map((agent) => ({
    ...agent,
    earnings: deliveries
      .filter((delivery) => delivery.status === "delivered" && delivery.agent_id === agent.id)
      .reduce((total, delivery) => total + Number(delivery.delivery_fee || 0), 0),
  }));

  const shown = deliveries.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [d.title, d.details, d.address, d.agent?.name || "", STATUS_LABELS[d.status] || ""]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return (
    <main className="dl-shell">
      <header className="dl-header">
        <div><p className="dl-eyebrow">Andiamo's · Delivery control desk</p><h1>Delivery Manager</h1></div>
        <button className="dl-btn dl-btn-outline" onClick={onLogout}>Sign out</button>
      </header>

      <section className="dl-stats">
        <div className="dl-stat"><span>{counts.pending}</span>Pending</div>
        <div className="dl-stat"><span>{counts.accepted}</span>Accepted</div>
        <div className="dl-stat"><span>{counts.delivered}</span>Delivered</div>
        <div className="dl-stat"><span>{counts.cancelled}</span>Cancelled</div>
      </section>

      <nav className="dl-manager-tabs" aria-label="Delivery manager sections">
        <button className={activeTab === "new" ? "dl-manager-tab dl-manager-tab--active" : "dl-manager-tab"} onClick={() => setActiveTab("new")}>New delivery</button>
        <button className={activeTab === "orders" ? "dl-manager-tab dl-manager-tab--active" : "dl-manager-tab"} onClick={() => setActiveTab("orders")}>Orders <span>{counts.pending}</span></button>
        <button className={activeTab === "drivers" ? "dl-manager-tab dl-manager-tab--active" : "dl-manager-tab"} onClick={() => setActiveTab("drivers")}>Drivers</button>
      </nav>

      {notice && <p className="dl-notice" role="status">{notice}</p>}
      {error && <p className="dl-error" role="alert">{error}</p>}

      {createdDelivery && <div className="dl-modal-backdrop" role="presentation">
        <section className="dl-modal" role="dialog" aria-modal="true" aria-labelledby="tracking-title">
          <h2 id="tracking-title">Delivery created</h2>
          <p>Send the customer a live tracking link?</p>
          <div className="dl-form-actions">
            <button className="dl-btn dl-btn-outline" onClick={() => setCreatedDelivery(null)}>Close</button>
            {createdDelivery.customer_phone && <button className="dl-btn dl-btn-whatsapp" onClick={sendCreatedTrackingLink}>Send on WhatsApp</button>}
          </div>
        </section>
      </div>}

      {activeTab === "new" && <section className="dl-panel">
        <div className="dl-panel-head">
          <div><h2>Send a delivery</h2><p>Assign an order to a driver. The order number is created automatically.</p></div>
          <button className="dl-btn dl-btn-primary" onClick={() => setCreating((v) => !v)}>{creating ? "Close form" : "+ New delivery"}</button>
        </div>

        {creating && (
          <form className="dl-form" onSubmit={create}>
            <div className="dl-form-grid">
              <label>Price<input name="price" value={form.price} onChange={update} placeholder="e.g. $15 or 850,000 LL" required /></label>
              <label>Assign to driver<select name="agentId" value={form.agentId} onChange={update} required>
                <option value="">Select a driver…</option>
                {agents.filter((a) => a.is_active).map((a) => <option key={a.id} value={a.id}>{a.username}</option>)}
              </select></label>
              <label>Customer phone<input name="customerPhone" value={form.customerPhone} onChange={update} placeholder="e.g. 9617xxxxxx" /></label>
              <label>Delivery area<select name="address" value={form.address} onChange={update} required>
                <option value="">Select an area...</option>
                {DELIVERY_AREAS.map((area) => <option key={area.name} value={area.name}>{area.name} - {formatLL(area.fee)}</option>)}
                <option value="custom">Custom address...</option>
              </select></label>
              {form.address === "custom" && <>
                <label>Custom address<input name="customAddress" value={form.customAddress} onChange={update} placeholder="Area name" required /></label>
                <label>Delivery fee (LL)<input name="customFee" type="number" min="1" step="1000" value={form.customFee} onChange={update} placeholder="e.g. 275000" required /></label>
              </>}
            </div>
            <label>Note for the driver <small className="dl-hint">(optional)</small><textarea name="managerNote" value={form.managerNote} onChange={update} rows="3" placeholder="Extra instructions…" /></label>
            <div className="dl-form-actions">
              <button type="button" className="dl-btn dl-btn-outline" onClick={() => setCreating(false)}>Cancel</button>
              <button className="dl-btn dl-btn-primary" type="submit">Send order</button>
            </div>
          </form>
        )}
      </section>}

      {activeTab === "drivers" && <section className="dl-panel">
        <div className="dl-panel-head">
          <div><h2>Drivers</h2><p>Each driver has a username, password, and WhatsApp number.</p></div>
          <button className="dl-btn dl-btn-primary" onClick={() => { setAddingAgent((v) => !v); setEditingAgent(null); setAgentForm({ name: "", username: "", password: "", phone: "" }); }}>
            {addingAgent || editingAgent ? "Close" : "+ Add driver"}
          </button>
        </div>

        {(addingAgent || editingAgent) && (
          <form className="dl-form" onSubmit={saveAgent}>
            <div className="dl-form-grid">
              <label>Full name<input name="name" value={agentForm.name} onChange={updateAgentForm} required /></label>
              <label>Phone (WhatsApp)<input name="phone" value={agentForm.phone} onChange={updateAgentForm} placeholder="e.g. 9617xxxxxx" required /></label>
              <label>Username{editingAgent && <small className="dl-hint">(cannot be changed)</small>}<input name="username" value={agentForm.username} onChange={updateAgentForm} disabled={Boolean(editingAgent)} required /></label>
              <label>{editingAgent ? "New password (leave blank to keep)" : "Password"}<input name="password" type="text" value={agentForm.password} onChange={updateAgentForm} placeholder={editingAgent ? "unchanged" : "min 4 chars"} /></label>
            </div>
            <div className="dl-form-actions">
              <button type="button" className="dl-btn dl-btn-outline" onClick={() => { setAddingAgent(false); setEditingAgent(null); }}>Cancel</button>
              <button className="dl-btn dl-btn-primary" type="submit">{editingAgent ? "Save driver" : "Create driver"}</button>
            </div>
          </form>
        )}

        {agents.length === 0 ? (
          <p className="dl-muted">No drivers yet. Add your first driver above.</p>
        ) : (
          <div className="dl-list">
            {agentEarnings.map((a) => (
              <div key={a.id} className={`dl-agent ${a.is_active ? "" : "dl-agent--inactive"}`}>
                <div className="dl-agent-main">
                  <div className="dl-agent-top"><h3>{a.name}</h3>{a.is_active ? <span className="dl-status">Active</span> : <span className="dl-status">Inactive</span>}</div>
                  <div className="dl-meta"><span><b>Username:</b> {a.username}</span><span><b>Phone:</b> +{a.phone}</span><span><b>Pay today:</b> {formatLL(a.earnings)}</span></div>
                </div>
                <div className="dl-agent-actions">
                  <button className="dl-btn dl-btn-outline" onClick={() => startEditAgent(a)}>Edit</button>
                  <button className="dl-btn dl-btn-outline" onClick={() => toggleAgent(a)}>{a.is_active ? "Deactivate" : "Activate"}</button>
                  <button className="dl-btn dl-btn-danger" onClick={() => deleteAgent(a)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>}

      {activeTab === "orders" && <section className="dl-panel">
        <div className="dl-panel-head">
          <div><h2>Today's deliveries</h2></div>
          <input className="dl-search" placeholder="Search orders or drivers…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {loading ? (
          <p className="dl-muted">Loading deliveries…</p>
        ) : shown.length === 0 ? (
          <p className="dl-muted">No deliveries yet.</p>
        ) : (
          <div className="dl-list dl-order-list">
            {shown.map((d) => (
              <DeliveryCard key={d.id} delivery={d}
                actions={
                  <>
                    {d.customer_phone && d.status !== "delivered" && <button className="dl-btn dl-btn-whatsapp" onClick={() => sendTrackingLink(d)}>Send tracking link</button>}
                    {d.status !== "delivered" && d.status !== "cancelled" && (
                      <button className="dl-btn dl-btn-danger" onClick={() => cancel(d)}>Cancel</button>
                    )}
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>}
    </main>
  );
}

function AgentView({ token, onLogout }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refreshTimer = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await api("/delivery-api", {}, token);
      setDeliveries(data.deliveries || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
    refreshTimer.current = window.setInterval(load, 15000);
    return () => window.clearInterval(refreshTimer.current);
  }, [load]);

  const act = async (delivery, action) => {
    setError("");
    try {
      await api("/delivery-api", { method: "PATCH", body: JSON.stringify({ id: delivery.id, action }) }, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const contactCustomer = (delivery) => {
    const phone = (delivery.customer_phone || "").replace(/\D/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  const callCustomer = (delivery) => {
    const phone = (delivery.customer_phone || "").replace(/\D/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  const pending = deliveries.filter((d) => d.status === "pending");
  const active = deliveries.filter((d) => d.status === "accepted");
  const deliveredToday = deliveries.filter((d) => d.status === "delivered");
  const dailyProfit = deliveredToday.reduce((total, delivery) => total + Number(delivery.delivery_fee || 0), 0);

  return (
    <main className="dl-shell">
      <header className="dl-header">
        <div><p className="dl-eyebrow">Andiamo's · On the road</p><h1>Delivery Agent</h1></div>
        <button className="dl-btn dl-btn-outline" onClick={onLogout}>Sign out</button>
      </header>

      {error && <p className="dl-error" role="alert">{error}</p>}

      <section className="dl-agent-summary" aria-label="Today's delivery earnings">
        <span>Today's profit ({deliveredToday.length} delivered)</span>
        <strong>{formatLL(dailyProfit)}</strong>
      </section>

      {loading ? (
        <p className="dl-muted">Loading deliveries…</p>
      ) : deliveries.length === 0 ? (
        <p className="dl-muted">No deliveries assigned right now.</p>
      ) : (
        <div className="dl-list">
          {deliveries.map((d) => (
            <DeliveryCard key={d.id} delivery={d} agentActions
              actions={
                d.status === "pending" ? (
                  <>
                    {d.customer_phone && <button className="dl-btn dl-btn-whatsapp" onClick={() => contactCustomer(d)}>Contact</button>}
                    <button className="dl-btn dl-btn-primary" onClick={() => act(d, "accept")}><span className="dl-take-icon" aria-hidden="true">🏍️</span> Take</button>
                  </>
                ) : d.status === "accepted" ? (
                  <>
                    {d.customer_phone && <button className="dl-btn dl-btn-whatsapp" onClick={() => callCustomer(d)}>Call customer</button>}
                    <button className="dl-btn dl-btn-deliver" onClick={() => act(d, "delivered")}><span aria-hidden="true">✓</span> Mark delivered</button>
                  </>
                ) : (
                  <span className="dl-done-label">{STATUS_LABELS[d.status]}</span>
                )
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function DeliveryApp({ role }) {
  const [token, setToken] = useState(() => window.sessionStorage.getItem(TOKEN_KEY(role)));

  const logout = () => {
    window.sessionStorage.removeItem(TOKEN_KEY(role));
    setToken(null);
  };

  if (!token) {
    return role === "manager"
      ? <ManagerLogin onLogin={() => setToken(window.sessionStorage.getItem(TOKEN_KEY(role)))} />
      : <AgentLogin onLogin={() => setToken(window.sessionStorage.getItem(TOKEN_KEY(role)))} />;
  }
  return role === "manager" ? <ManagerView token={token} onLogout={logout} /> : <AgentView token={token} onLogout={logout} />;
}
