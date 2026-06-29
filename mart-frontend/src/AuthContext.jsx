import { createContext, useContext, useState, useCallback } from "react";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("bl_token") || null);
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("bl_user")); } catch { return null; }
  });

  const login = useCallback((tok, usr) => {
    setToken(tok);
    setUser(usr);
    localStorage.setItem("bl_token", tok);
    localStorage.setItem("bl_user", JSON.stringify(usr));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("bl_token");
    localStorage.removeItem("bl_user");
  }, []);

  return (
    <Ctx.Provider value={{ token, user, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
