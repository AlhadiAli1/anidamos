/* oxlint-disable react/only-export-components -- root entry file that renders immediately; components are not exported for fast refresh. */
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./credit-management.css";

async function readResponse(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || "Request failed.");
  return data;
}

function AdminLogin({ onAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await readResponse(await fetch("/.netlify/functions/admin-login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }));
      onAuthenticated();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <p className="admin-eyebrow">Restricted access</p>
        <h1>Credit Management</h1>
        <p>Sign in with the administrator account to manage customer credits.</p>
        <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
        {error && <div className="admin-error" role="alert">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>
    </main>
  );
}

function Dashboard({ onLogout }) {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("customers");
  const [customerSearch, setCustomerSearch] = useState("");
  const [lastOrderCheck, setLastOrderCheck] = useState(null);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [orderAction, setOrderAction] = useState(null);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await readResponse(await fetch("/.netlify/functions/admin-customers", { credentials: "include" }));
      setCustomers(data.customers || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await readResponse(await fetch("/.netlify/functions/admin-orders", { credentials: "include" }));
      setOrders(data.orders || []);
      setReceivedOrders(data.receivedOrders || []);
      setLastOrderCheck(new Date());
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadOrders();
    const interval = window.setInterval(loadOrders, 10000);
    return () => window.clearInterval(interval);
  }, []);

  const adjustCredits = async (customerId) => {
    const amount = Number(amounts[customerId]);
    if (!Number.isFinite(amount) || amount === 0) return;
    setError("");
    setNotice("");
    try {
      await readResponse(await fetch("/.netlify/functions/admin-adjust-credits", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, amount }),
      }));
      setAmounts((current) => ({ ...current, [customerId]: "" }));
      setNotice("Credits updated successfully.");
      await loadCustomers();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const confirmOrder = async (orderId) => {
    setError("");
    setNotice("");
    setOrderAction({ orderId, type: "confirm" });
    try {
      await readResponse(await fetch("/.netlify/functions/admin-confirm-order", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      }));
      setNotice("WhatsApp order received and credits deducted.");
      await Promise.all([loadCustomers(), loadOrders()]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setOrderAction(null);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order because it was not received on WhatsApp?")) return;
    setError("");
    setNotice("");
    setOrderAction({ orderId, type: "delete" });
    try {
      await readResponse(await fetch("/.netlify/functions/admin-delete-order", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      }));
      setNotice("Unreceived order deleted.");
      await loadOrders();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setOrderAction(null);
    }
  };

  const logout = async () => {
    await fetch("/.netlify/functions/admin-logout", { method: "POST", credentials: "include" });
    onLogout();
  };

  const normalizedSearch = customerSearch.trim().toLowerCase();
  const filteredCustomers = customers.filter((customer) => {
    if (!normalizedSearch) return true;
    return [customer.username, customer.phone_nb, String(customer.id)]
      .some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
  });

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div><p className="admin-eyebrow">Andiamo's</p><h1>Credit Management</h1></div>
        <button className="secondary" onClick={logout}>Logout</button>
      </header>
      {notice && <div className="admin-notice" role="status">{notice}</div>}
      {error && <div className="admin-error" role="alert">{error}</div>}
      <nav className="management-tabs" aria-label="Credit management sections">
        <button className={activeTab === "customers" ? "active" : ""} onClick={() => setActiveTab("customers")}>Customers <span>{customers.length}</span></button>
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders <span>{orders.length}</span></button>
      </nav>

      {activeTab === "customers" ? (
        <section className="customer-panel">
          <div className="panel-title"><div><p className="admin-eyebrow">Customer accounts</p><h2>Manage credits</h2></div><button className="secondary" onClick={loadCustomers}>Refresh</button></div>
          <input className="customer-search" value={customerSearch} onChange={(event) => setCustomerSearch(event.target.value)} placeholder="Search by name, username, or ID" aria-label="Search customers" />
          {loading ? <p>Loading customers...</p> : filteredCustomers.length === 0 ? <p>No matching customers found.</p> : <div className="customer-list">
            {filteredCustomers.map((customer) => (
              <article className="customer-row" key={customer.id}>
                <div><strong>@{customer.username}</strong><span>{customer.phone_nb || "No phone number"}</span></div>
                <b>${Number(customer.points_balance || 0).toFixed(2)} credits</b>
                <div className="credit-adjust"><input type="number" step="0.01" placeholder="+ / - amount" value={amounts[customer.id] || ""} onChange={(event) => setAmounts((current) => ({ ...current, [customer.id]: event.target.value }))} aria-label={`Credit adjustment for ${customer.username}`} /><button onClick={() => adjustCredits(customer.id)}>Apply</button></div>
              </article>
            ))}
          </div>}
        </section>
      ) : (
        <div className="orders-layout">
        <section className="customer-panel orders-panel">
          <div className="panel-title"><div><p className="admin-eyebrow">WhatsApp verification</p><h2>Pending orders</h2><small className="refresh-status">Auto-refreshing every 10 seconds{lastOrderCheck ? ` · Last checked ${lastOrderCheck.toLocaleTimeString()}` : ""}</small></div><button className="secondary" onClick={loadOrders}>Refresh now</button></div>
          {orders.length === 0 ? <p>No pending orders.</p> : <div className="customer-list">
            {orders.map((order) => (
              <article className="pending-order" key={order.id}>
                <div className="pending-order-header"><strong>Order #{order.id}</strong><span>{order.customers?.username || "Customer"}<small>{order.customers?.phone_nb || "No phone number"}</small></span><b>{order.payment_method === "credits" ? `$${Number(order.credits_amount || 0).toFixed(2)} credits payment` : `+${Number(order.points_earned || 0)} credits to add`}</b></div>
                <div className="pending-order-total"><span>Order total</span><strong>LBP {Number(order.total_amount || 0).toLocaleString("en-US")}</strong></div>
                <div className="pending-order-items">{(order.items || []).map((item, index) => <span key={`${order.id}-${index}`}>{item.name} | QTY: {item.qty} | {item.price}</span>)}</div>
                <div className="pending-order-actions">
                  <button disabled={orderAction?.orderId === order.id} onClick={() => confirmOrder(order.id)}>{orderAction?.orderId === order.id && orderAction.type === "confirm" ? "Verifying..." : "Confirm WhatsApp received"}</button>
                  <button className="delete-order-button" disabled={orderAction?.orderId === order.id} onClick={() => deleteOrder(order.id)}>{orderAction?.orderId === order.id && orderAction.type === "delete" ? "Deleting..." : "Delete not received"}</button>
                </div>
              </article>
            ))}
          </div>}
        </section>
        <aside className="received-orders-panel" aria-label="Recently received orders">
          <div className="panel-title"><div><p className="admin-eyebrow">Credit history</p><h2>Recently received</h2></div><span className="received-count">{receivedOrders.length}</span></div>
          {receivedOrders.length === 0 ? <p>No received orders yet.</p> : <div className="received-order-list">
            {receivedOrders.map((order) => {
              const creditChange = order.payment_method === "credits" ? -Number(order.credits_amount || 0) : Number(order.points_earned || 0);
              return <article className="received-order" key={order.id}>
                <div><strong>Order #{order.id}</strong><span>{order.customers?.phone_nb || "No phone number"}</span></div>
                <b className={creditChange < 0 ? "credit-deducted" : "credit-added"}>{creditChange < 0 ? "-" : "+"}${Math.abs(creditChange).toFixed(2)} credits</b>
              </article>;
            })}
          </div>}
        </aside>
        </div>
      )}
    </main>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    fetch("/.netlify/functions/admin-me", { credentials: "include" })
      .then((response) => setAuthenticated(response.ok))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) return <main className="admin-loading">Checking access...</main>;
  return authenticated ? <Dashboard onLogout={() => setAuthenticated(false)} /> : <AdminLogin onAuthenticated={() => setAuthenticated(true)} />;
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
