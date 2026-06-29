import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { storeAPI, cityAPI } from "../api";
import CrudTable from "../components/CrudTable";

export default function StoresPage({ isAdmin }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([storeAPI.list(token), cityAPI.list()]);
      setItems(s); setCities(c);
    } catch {}
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  return (
    <CrudTable
      title="Stores"
      items={items}
      loading={loading}
      isAdmin={isAdmin}
      columns={[
        { key: "store_no", label: "Store No" },
        { key: "store_addr", label: "Address" },
        { key: "city_name", label: "City" },
        { key: "state_name", label: "State" },
        { key: "country_name", label: "Country" },
      ]}
      emptyForm={{ store_no: "", logo: "", store_addr: "", store_city_id: "" }}
      onAdd={async (f) => { await storeAPI.create(token, { ...f, store_city_id: Number(f.store_city_id) }); await load(); }}
      onEdit={async (id, f) => { await storeAPI.update(token, id, { ...f, store_city_id: Number(f.store_city_id) }); await load(); }}
      onDelete={async (id) => { await storeAPI.delete(token, id); await load(); }}
      renderForm={(fd, setFd) => (
        <>
          <div className="field">
            <label>Store Number</label>
            <input value={fd.store_no} onChange={(e) => setFd({ ...fd, store_no: e.target.value })} placeholder="e.g. STR-001" required />
          </div>
          <div className="field">
            <label>Logo URL (optional)</label>
            <input value={fd.logo} onChange={(e) => setFd({ ...fd, logo: e.target.value })} placeholder="https://..." />
          </div>
          <div className="field">
            <label>Address</label>
            <input value={fd.store_addr} onChange={(e) => setFd({ ...fd, store_addr: e.target.value })} placeholder="Full store address" required />
          </div>
          <div className="field">
            <label>City</label>
            <select value={fd.store_city_id} onChange={(e) => setFd({ ...fd, store_city_id: e.target.value })} required>
              <option value="">— Select city —</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.city_name} ({c.state_name})</option>)}
            </select>
          </div>
        </>
      )}
    />
  );
}
