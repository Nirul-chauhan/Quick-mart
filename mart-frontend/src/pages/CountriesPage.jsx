import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { countryAPI } from "../api";
import CrudTable from "../components/CrudTable";

export default function CountriesPage({ isAdmin }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setItems(await countryAPI.list()); } catch {}
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  return (
    <CrudTable
      title="Countries"
      items={items}
      loading={loading}
      isAdmin={isAdmin}
      columns={[{ key: "id", label: "ID" }, { key: "country_name", label: "Country Name" }]}
      emptyForm={{ country_name: "" }}
      onAdd={async (f) => { await countryAPI.create(token, f); await load(); }}
      onEdit={async (id, f) => { await countryAPI.update(token, id, f); await load(); }}
      onDelete={async (id) => { await countryAPI.delete(token, id); await load(); }}
      renderForm={(fd, setFd) => (
        <div className="field">
          <label>Country Name</label>
          <input value={fd.country_name} onChange={(e) => setFd({ ...fd, country_name: e.target.value })} placeholder="e.g. India" required />
        </div>
      )}
    />
  );
}
