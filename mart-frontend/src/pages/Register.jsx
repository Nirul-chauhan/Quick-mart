import { useState } from "react";
import { api } from "../api";
import Logo from "../components/Logo";
import Alert from "../components/Alert";
import PasswordInput from "../components/PasswordInput";
import { IconCheck } from "../components/Icons";

const INITIAL = {
  first_name: "", last_name: "", email: "",
  mobile: "", password: "", role_id: 3,
};

export default function Register({ onLogin }) {
  const [step, setStep]       = useState(1);   // 1 | 2 | 3
  const [form, setForm]       = useState(INITIAL);
  const [otp, setOtp]         = useState("");
  const [devOtp, setDevOtp]   = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  /* ── Step 1: send details, get OTP ── */
  async function handleDetails(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await api.register({ ...form, role_id: Number(form.role_id) });
      setDevOtp(data.dev_otp || "");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ── Step 2: verify OTP then complete ── */
  async function handleVerify(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.verifyOtp(form.email, otp);
      await api.completeRegistration({ ...form, role_id: Number(form.role_id) });
      setStep(3);
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

        {/* Progress bar */}
        <div className="step-bar">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`step-seg ${step > s ? "done" : step === s ? "active" : ""}`}
            />
          ))}
        </div>

        {/* ── STEP 1: Details ── */}
        {step === 1 && (
          <>
            <h1 className="card-title">Create your account</h1>
            <p className="card-sub">Step 1 of 2 — fill in your details</p>
            {error && <Alert type="err">{error}</Alert>}
            <form onSubmit={handleDetails} noValidate>
              <div className="field-row">
                <div className="field">
                  <label>First name</label>
                  <input value={form.first_name} onChange={set("first_name")} placeholder="Nirul" required />
                </div>
                <div className="field">
                  <label>Last name</label>
                  <input value={form.last_name} onChange={set("last_name")} placeholder="Chauhan" required />
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
              </div>
              <div className="field">
                <label>Mobile (10 digits)</label>
                <input
                  value={form.mobile}
                  onChange={set("mobile")}
                  placeholder="9876543210"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>
              <PasswordInput
                label="Password"
                value={form.password}
                onChange={set("password")}
                placeholder="Min 8 chars · 1 uppercase · 1 number"
                required
              />
              <div className="field">
                <label>Role</label>
                <select value={form.role_id} onChange={set("role_id")}>
                  <option value={3}>User — standard access</option>
                  <option value={2}>Service — read-only access</option>
                  <option value={1}>Admin — full access</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Sending OTP…</> : "Continue →"}
              </button>
            </form>
            <div className="card-footer">
              Already have an account?{" "}
              <button className="btn-link" onClick={onLogin}>Sign in</button>
            </div>
          </>
        )}

        {/* ── STEP 2: Verify OTP ── */}
        {step === 2 && (
          <>
            <h1 className="card-title">Verify your email</h1>
            <p className="card-sub">
              Step 2 of 2 — OTP sent to <strong>{form.email}</strong>
            </p>
            {devOtp && (
              <Alert type="dev">
                🔑 Dev OTP (remove in production): <strong>{devOtp}</strong>
              </Alert>
            )}
            {error && <Alert type="err">{error}</Alert>}
            <form onSubmit={handleVerify} noValidate>
              <div className="field">
                <label>One-time password</label>
                <input
                  className="otp-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Creating account…</>
                  : "Verify & create account"}
              </button>
            </form>
            <div className="card-footer">
              <button className="btn-link" onClick={() => { setStep(1); setError(""); }}>
                ← Back
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Success ── */}
        {step === 3 && (
          <div className="success-wrap">
            <div className="success-icon">
              <IconCheck size={28} color="var(--green)" />
            </div>
            <h1 className="card-title">Account created!</h1>
            <p className="card-sub" style={{ marginBottom: "1.5rem" }}>
              Your account is ready. Sign in to continue.
            </p>
            <button className="btn btn-primary" onClick={onLogin}>
              Go to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
