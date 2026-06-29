import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { categoryAPI } from "../api";
import CrudTable from "../components/CrudTable";

export default function CategoriesPage({ isAdmin }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setItems(await categoryAPI.list()); } catch {}
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  // top-level categories for parent dropdown
  const topLevel = items.filter((c) => !c.parent_category_id);

  return (
    <CrudTable
      title="Categories"
      items={items}
      loading={loading}
      isAdmin={isAdmin}
      columns={[
        { key: "id", label: "ID" },
        { key: "category_name", label: "Category" },
        { key: "parent_name", label: "Parent" },
      ]}
      emptyForm={{ category_name: "", cat_img: "", parent_category_id: "" }}
      onAdd={async (f) => {
        await categoryAPI.create(token, {
          ...f,
          parent_category_id: f.parent_category_id ? Number(f.parent_category_id) : null,
        });
        await load();
      }}
      onEdit={async (id, f) => {
        await categoryAPI.update(token, id, {
          ...f,
          parent_category_id: f.parent_category_id ? Number(f.parent_category_id) : null,
        });
        await load();
      }}
      onDelete={async (id) => { await categoryAPI.delete(token, id); await load(); }}
      renderForm={(fd, setFd) => (
        <>
          <div className="field">
            <label>Category Name</label>
            <input value={fd.category_name} onChange={(e) => setFd({ ...fd, category_name: e.target.value })} placeholder="e.g. Fruits & Vegetables" required />
          </div>
          <div className="field">
            <label>Image URL (optional)</label>
            <input value={fd.cat_img || ""} onChange={(e) => setFd({ ...fd, cat_img: e.target.value })} placeholder="https://..." />
          </div>
          <div className="field">
            <label>Parent Category (leave blank for top-level)</label>
            <select value={fd.parent_category_id || ""} onChange={(e) => setFd({ ...fd, parent_category_id: e.target.value })}>
              <option value="">— None (top-level) —</option>
              {topLevel.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
            </select>
          </div>
        </>
      )}
    />
  );
}
