import { useState } from "react";
import { IconEye, IconEyeOff } from "./Icons";

export default function PasswordInput({ label, name, value, onChange, placeholder, required }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className="pw-wrap">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "••••••••"}
          required={required}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="pw-toggle"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
    </div>
  );
}
