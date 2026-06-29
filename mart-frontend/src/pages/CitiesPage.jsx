import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { cityAPI, stateAPI } from "../api";
import CrudTable from "../components/CrudTable";

export default function CitiesPage({ isAdmin }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([cityAPI.list(), stateAPI.list()]);
      setItems(c); setStates(s);
    } catch {}
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  return (
    <CrudTable
      title="Cities"
      items={items}
      loading={loading}
      isAdmin={isAdmin}
      columns={[
        { key: "id", label: "ID" },
        { key: "city_name", label: "City Name" },
        { key: "state_name", label: "State" },
        { key: "country_name", label: "Country" },
      ]}
      emptyForm={{ city_name: "", state_id: "" }}
      onAdd={async (f) => { await cityAPI.create(token, { ...f, state_id: Number(f.state_id) }); await load(); }}
      onEdit={async (id, f) => { await cityAPI.update(token, id, { ...f, state_id: Number(f.state_id) }); await load(); }}
      onDelete={async (id) => { await cityAPI.delete(token, id); await load(); }}
      renderForm={(fd, setFd) => (
        <>
          <div className="field">
            <label>City Name</label>
            <input value={fd.city_name} onChange={(e) => setFd({ ...fd, city_name: e.target.value })} placeholder="e.g. Noida" required />
          </div>
          <div className="field">
            <label>State</label>
            <select value={fd.state_id} onChange={(e) => setFd({ ...fd, state_id: e.target.value })} required>
              <option value="">— Select state —</option>
              {states.map((s) => <option key={s.id} value={s.id}>{s.state_name} ({s.country_name})</option>)}
            </select>
          </div>
        </>
      )}
    />
  );
}
