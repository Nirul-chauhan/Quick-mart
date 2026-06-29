import { useState } from "react";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

export default function App() {
  const { user } = useAuth();
  const [screen, setScreen] = useState("login"); // login | register | forgot

  // If logged in, always show profile
  if (user) return <Profile />;

  return (
    <div className="app-shell">
      {screen === "login" && (
        <Login
          onRegister={() => setScreen("register")}
          onForgot={() => setScreen("forgot")}
        />
      )}
      {screen === "register" && (
        <Register onLogin={() => setScreen("login")} />
      )}
      {screen === "forgot" && (
        <ForgotPassword onBack={() => setScreen("login")} />
      )}
    </div>
  );
}
