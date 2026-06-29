import { useState } from "react";
import { api } from "../api";
import Logo from "../components/Logo";
import Alert from "../components/Alert";
import PasswordInput from "../components/PasswordInput";
import { IconCheck } from "../components/Icons";

export default function ForgotPassword({ onBack }) {
  const [step, setStep]         = useState(1);   // 1 | 2 | 3
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState("");
  const [newPw, setNewPw]       = useState("");
  const [devOtp, setDevOtp]     = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSendOtp(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await api.forgotPassword(email);
      setDevOtp(data.dev_otp || "");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.resetPassword(email, otp, newPw);
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

        <div className="step-bar">
          {[1, 2].map((s) => (
            <div key={s} className={`step-seg ${step > s ? "done" : step === s ? "active" : ""}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 className="card-title">Forgot password?</h1>
            <p className="card-sub">Enter your email and we'll send you a reset code.</p>
            {error && <Alert type="err">{error}</Alert>}
            <form onSubmit={handleSendOtp} noValidate>
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
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Sending…</> : "Send reset code"}
              </button>
            </form>
            <div className="card-footer">
              <button className="btn-link" onClick={onBack}>← Back to sign in</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="card-title">Set a new password</h1>
            <p className="card-sub">Enter the code sent to <strong>{email}</strong></p>
            {devOtp && (
              <Alert type="dev">
                🔑 Dev OTP (remove in production): <strong>{devOtp}</strong>
              </Alert>
            )}
            {error && <Alert type="err">{error}</Alert>}
            <form onSubmit={handleReset} noValidate>
              <div className="field">
                <label>Reset code</label>
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
              <PasswordInput
                label="New password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min 8 chars · 1 uppercase · 1 number"
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Updating…</> : "Update password"}
              </button>
            </form>
            <div className="card-footer">
              <button className="btn-link" onClick={() => { setStep(1); setError(""); }}>
                ← Back
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="success-wrap">
            <div className="success-icon">
              <IconCheck size={28} color="var(--green)" />
            </div>
            <h1 className="card-title">Password updated!</h1>
            <p className="card-sub" style={{ marginBottom: "1.5rem" }}>
              Your password has been changed. Sign in with your new password.
            </p>
            <button className="btn btn-primary" onClick={onBack}>
              Go to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
