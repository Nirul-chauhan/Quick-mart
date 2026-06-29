import { useAuth } from "../AuthContext";
import Logo from "../components/Logo";
import {
  IconLogout, IconMail, IconPhone, IconShield, IconUser, IconCheck, IconX,
} from "../components/Icons";

const ROLE_BADGE = {
  admin:   "badge badge-admin",
  service: "badge badge-service",
  user:    "badge badge-user",
};

export default function Profile() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials =
    ((user.first_name || "?")[0] + (user.last_name || "?")[0]).toUpperCase();

  const roleCls = ROLE_BADGE[user.role] || "badge badge-user";

  const rows = [
    {
      key: "Email",
      Icon: IconMail,
      value: user.email,
    },
    {
      key: "Mobile",
      Icon: IconPhone,
      value: user.mobile,
    },
    {
      key: "Role",
      Icon: IconShield,
      value: <span className={roleCls}>{user.role}</span>,
    },
    {
      key: "Email verified",
      Icon: IconUser,
      value: user.is_email_verified
        ? <span className="badge badge-yes"><IconCheck size={11} /> Yes</span>
        : <span className="badge badge-no"><IconX size={11} /> No</span>,
    },
    {
      key: "Mobile verified",
      Icon: IconPhone,
      value: user.is_mobile_verified
        ? <span className="badge badge-yes"><IconCheck size={11} /> Yes</span>
        : <span className="badge badge-no"><IconX size={11} /> No</span>,
    },
  ];

  return (
    <div className="dash-page">
      {/* Navbar */}
      <nav className="navbar">
        <Logo noMargin />
        <div className="navbar-right">
          <span style={{ fontSize: ".875rem", color: "var(--text-muted)" }}>
            {user.first_name} {user.last_name}
          </span>
          <button className="btn btn-ghost" onClick={logout} style={{ height: 34, padding: "0 14px", fontSize: ".85rem" }}>
            <IconLogout size={14} /> Sign out
          </button>
        </div>
      </nav>

      {/* Profile card */}
      <div className="profile-wrap">
        <div className="profile-card">
          {/* Header with gradient */}
          <div className="profile-header">
            <div className="avatar">{initials}</div>
            <p className="profile-name">{user.first_name} {user.last_name}</p>
            <p className="profile-email">{user.email}</p>
          </div>

          {/* Detail rows */}
          <div className="profile-body">
            {rows.map(({ key, Icon, value }) => (
              <div className="profile-row" key={key}>
                <span className="profile-key">
                  <Icon size={15} />
                  {key}
                </span>
                <span className="profile-val">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
