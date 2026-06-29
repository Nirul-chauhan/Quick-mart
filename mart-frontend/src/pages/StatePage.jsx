import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { stateAPI, countryAPI } from "../api";
import CrudTable from "../components/CrudTable";

export default function StatesPage({ isAdmin }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([stateAPI.list(), countryAPI.list()]);
      setItems(s); setCountries(c);
    } catch {}
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  return (
    <CrudTable
      title="States"
      items={items}
      loading={loading}
      isAdmin={isAdmin}
      columns={[
        { key: "id", label: "ID" },
        { key: "state_name", label: "State Name" },
        { key: "country_name", label: "Country" },
      ]}
      emptyForm={{ state_name: "", country_id: "" }}
      onAdd={async (f) => { await stateAPI.create(token, { ...f, country_id: Number(f.country_id) }); await load(); }}
      onEdit={async (id, f) => { await stateAPI.update(token, id, { ...f, country_id: Number(f.country_id) }); await load(); }}
      onDelete={async (id) => { await stateAPI.delete(token, id); await load(); }}
      renderForm={(fd, setFd) => (
        <>
          <div className="field">
            <label>State Name</label>
            <input value={fd.state_name} onChange={(e) => setFd({ ...fd, state_name: e.target.value })} placeholder="e.g. Uttar Pradesh" required />
          </div>
          <div className="field">
            <label>Country</label>
            <select value={fd.country_id} onChange={(e) => setFd({ ...fd, country_id: e.target.value })} required>
              <option value="">— Select country —</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.country_name}</option>)}
            </select>
          </div>
        </>
      )}
    />
  );
}
