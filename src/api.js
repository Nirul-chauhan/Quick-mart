/* ─────────────────────────────────────────────────────────────
   API layer — all calls go through Vite proxy to FastAPI.
   Proxy config: vite.config.js  |  Backend port: .env → VITE_API_URL
   ───────────────────────────────────────────────────────────── */

async function request(path, opts = {}) {
  let res;
  try {
    res = await fetch(path, {
      headers: { "Content-Type": "application/json", ...opts.headers },
      ...opts,
    });
  } catch {
    throw new Error(
      "Cannot reach the server. Make sure the backend is running on port 9000."
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((e) => e.msg).join(" · ")
        : `Server error ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

function bearer(token) {
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  // ── Registration ──────────────────────────────────────────
  register(body) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  verifyOtp(email, otp) {
    return request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  completeRegistration(body) {
    return request("/auth/complete-registration", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // ── Login / Profile ───────────────────────────────────────
  login(email, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile(token) {
    return request("/auth/profile", { headers: bearer(token) });
  },

  // ── Password reset ────────────────────────────────────────
  forgotPassword(email) {
    return request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(email, otp, new_password) {
    return request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, new_password }),
    });
  },
};
