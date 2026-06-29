import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import Logo from "../components/Logo";
import Alert from "../components/Alert";
import PasswordInput from "../components/PasswordInput";

export default function Login({ onRegister, onForgot }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data    = await api.login(email, password);
      const profile = await api.getProfile(data.access_token);
      login(data.access_token, profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Logo />
        <h1 className="card-title">Welcome back</h1>
        <p className="card-sub">Sign in to your account to continue</p>

        {error && <Alert type="err">{error}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={{ textAlign: "right", marginTop: "-.5rem", marginBottom: "1rem" }}>
            <button type="button" className="btn-link" onClick={onForgot}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in…</> : "Sign in"}
          </button>
        </form>

        <div className="card-footer">
          Don't have an account?{" "}
          <button className="btn-link" onClick={onRegister}>
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}
