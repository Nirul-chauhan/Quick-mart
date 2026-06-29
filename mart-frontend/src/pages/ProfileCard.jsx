import { useAuth } from "../AuthContext";
import { IconCheck, IconMail, IconPhone, IconShield, IconUser, IconX } from "../components/Icons";

export default function ProfileCard() {
  const { user } = useAuth();
  if (!user) return null;

  const initials = ((user.first_name || "?")[0] + (user.last_name || "?")[0]).toUpperCase();
  const roleColor = { admin: "badge-admin", service: "badge-service", user: "badge-user" };

  return (
    <div className="profile-card" style={{ maxWidth: 480 }}>
      <div className="profile-header">
        <div className="avatar">{initials}</div>
        <p className="profile-name">{user.first_name} {user.last_name}</p>
        <p className="profile-email">{user.email}</p>
      </div>
      <div className="profile-body">
        {[
          { label: "Email", Icon: IconMail, value: user.email },
          { label: "Mobile", Icon: IconPhone, value: user.mobile },
          { label: "Role", Icon: IconShield, value: <span className={`badge ${roleColor[user.role] || "badge-user"}`}>{user.role}</span> },
          { label: "Email verified", Icon: IconUser, value: user.is_email_verified ? <span className="badge badge-yes"><IconCheck size={11} /> Yes</span> : <span className="badge badge-no"><IconX size={11} /> No</span> },
          { label: "Mobile verified", Icon: IconPhone, value: user.is_mobile_verified ? <span className="badge badge-yes"><IconCheck size={11} /> Yes</span> : <span className="badge badge-no"><IconX size={11} /> No</span> },
        ].map(({ label, Icon, value }) => (
          <div className="profile-row" key={label}>
            <span className="profile-key"><Icon size={15} />{label}</span>
            <span className="profile-val">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
