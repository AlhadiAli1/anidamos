import { useState } from "react";
import { useAuth } from "../context/authCtx";

const initial = {
  username: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function AuthModal() {
  const { authOpen, closeAuth, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!authOpen) return null;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      if (mode === "login") {
        await login({
          username: form.username.trim(),
          phone: form.phone.trim(),
          password: form.password,
        });
      } else {
        if (!form.username.trim() || !form.phone.trim()) {
          throw new Error("Username and phone number are required.");
        }
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        await register({
          username: form.username.trim(),
          phone: form.phone.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
      }
    } catch (submitError) {
      setError(submitError.message || "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  const change = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-overlay" onClick={closeAuth}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="auth-close" onClick={closeAuth} aria-label="Close auth form">✕</button>

        <div className="auth-header">
          <p className="auth-kicker">Andiamos Rewards</p>
          <h3>Sign in to receive credits and rewards</h3>
          <p className="auth-ar">سجل الدخول للحصول على الجوائز والمكافآت</p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="auth-username">{mode === "login" ? "Username or phone number" : "Username"}</label>
            <input
              id="auth-username"
              name="username"
              value={form.username}
              onChange={change}
              required
              autoComplete="username"
              placeholder={mode === "login" ? "Enter username or phone number" : "Enter username"}
            />
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="auth-phone">Phone number</label>
              <input id="auth-phone" name="phone" type="tel" value={form.phone} onChange={change} required autoComplete="tel" placeholder="Enter phone number" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              name="password"
              value={form.password}
              onChange={change}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder={mode === "login" ? "Enter your password" : "Create a password"}
            />
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="auth-confirm-password">Confirm Password</label>
              <input
                id="auth-confirm-password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={change}
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button className="btn btn-primary auth-submit" type="submit" disabled={pending}>
            {pending ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
