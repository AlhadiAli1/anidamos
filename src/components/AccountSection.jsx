import { useAuth } from "../context/authCtx";

export default function AccountSection() {
  const { user, isAuthenticated, openAuth, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <section className="section section-account" id="account">
        <div className="container">
          <div className="account-locked-card">
            <span className="section-tag">My Account</span>
            <h2>Welcome to Andiamos</h2>
            <p>Log in or create an account to manage your orders, points, and rewards.</p>
            <div className="account-actions">
              <button type="button" className="btn btn-primary" onClick={openAuth}>Login / Sign Up</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section section-account" id="account">
      <div className="container account-shell">
        <div className="account-panel account-major-panel">
          <span className="section-tag">My Account</span>
          <h2>{user?.username || "Customer"}</h2>
          <p className="account-subtitle">Your Andiamo's account</p>
          <div className="account-summary-grid">
            <div className="account-summary-item">
              <span>Username</span>
              <strong>{user?.username}</strong>
            </div>
            <div className="account-summary-item">
              <span>Current credits</span>
              <strong>⭐ {user?.points_balance ?? 0} Credits</strong>
            </div>
          </div>
          <div className="account-actions">
            <button type="button" className="btn btn-outline btn-dark" onClick={logout}>Logout</button>
          </div>
        </div>

      </div>

    </section>
  );
}
