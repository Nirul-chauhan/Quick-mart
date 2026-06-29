import { useState } from "react";
import { useAuth } from "../AuthContext";
import Logo from "../components/Logo";
import { IconLogout, IconUser } from "../components/Icons";
import ProfileCard from "./ProfileCard";
import CountriesPage from "./CountriesPage";
import StatesPage from "./StatesPage";
import CitiesPage from "./CitiesPage";
import StoresPage from "./StoresPage";
import CategoriesPage from "./CategoriesPage";

const NAV = [
  { key: "profile",    label: "👤 Profile" },
  { key: "countries",  label: "🌍 Countries" },
  { key: "states",     label: "🗺️ States" },
  { key: "cities",     label: "🏙️ Cities" },
  { key: "stores",     label: "🏪 Stores" },
  { key: "categories", label: "📦 Categories" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("profile");
  const [sideOpen, setSideOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const PAGE = {
    profile:    <ProfileCard />,
    countries:  <CountriesPage isAdmin={isAdmin} />,
    states:     <StatesPage isAdmin={isAdmin} />,
    cities:     <CitiesPage isAdmin={isAdmin} />,
    stores:     <StoresPage isAdmin={isAdmin} />,
    categories: <CategoriesPage isAdmin={isAdmin} />,
  };

  return (
    <div className="dash-shell">
      {/* ── Navbar ── */}
      <nav className="dash-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="ham-btn" onClick={() => setSideOpen((o) => !o)}>☰</button>
          <Logo noMargin />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="nav-user">{user?.first_name} · <em>{user?.role}</em></span>
          <button className="btn btn-ghost nav-logout" onClick={logout}>
            <IconLogout size={14} /> Logout
          </button>
        </div>
      </nav>

      <div className="dash-body">
        {/* ── Sidebar ── */}
        <aside className={`sidebar ${sideOpen ? "open" : ""}`}>
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`side-item ${active === n.key ? "active" : ""}`}
              onClick={() => { setActive(n.key); setSideOpen(false); }}
            >
              {n.label}
            </button>
          ))}
        </aside>

        {/* ── Main content ── */}
        <main className="dash-main">
          {PAGE[active]}
        </main>
      </div>
    </div>
  );
}
