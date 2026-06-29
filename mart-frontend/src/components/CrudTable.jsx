import { useState } from "react";

/* Generic CRUD table.
   Props:
   - title, items, columns: [{key, label}]
   - isAdmin: show add/edit/delete buttons
   - onAdd(formData), onEdit(id, formData), onDelete(id)
   - renderForm(formData, setFormData): custom form fields
   - emptyForm: default form state
*/
export default function CrudTable({
  title, items, columns, isAdmin,
  onAdd, onEdit, onDelete,
  renderForm, emptyForm,
  loading,
}) {
  const [mode, setMode] = useState(null); // null | "add" | "edit"
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setFormData(emptyForm);
    setEditItem(null);
    setMode("add");
    setError("");
  }

  function openEdit(item) {
    const fd = {};
    Object.keys(emptyForm).forEach((k) => { fd[k] = item[k] ?? ""; });
    setFormData(fd);
    setEditItem(item);
    setMode("edit");
    setError("");
  }

  function closeModal() { setMode(null); setError(""); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (mode === "add") await onAdd(formData);
      else await onEdit(editItem.id, formData);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${Object.values(item)[1]}"?`)) return;
    try { await onDelete(item.id); }
    catch (err) { alert(err.message); }
  }

  return (
    <div className="crud-wrap">
      {/* Header */}
      <div className="crud-header">
        <h2 className="crud-title">{title}</h2>
        {isAdmin && (
          <button className="btn btn-primary" style={{ width: "auto", padding: "0 16px", height: 36 }} onClick={openAdd}>
            + Add
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="crud-empty">Loading…</div>
      ) : items.length === 0 ? (
        <div className="crud-empty">No records yet.</div>
      ) : (
        <div className="crud-table-wrap">
          <table className="crud-table">
            <thead>
              <tr>
                {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => <td key={c.key}>{item[c.key] ?? "—"}</td>)}
                  {isAdmin && (
                    <td>
                      <button className="tbl-btn edit" onClick={() => openEdit(item)}>Edit</button>
                      <button className="tbl-btn del" onClick={() => handleDelete(item)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {mode && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{mode === "add" ? `Add ${title}` : `Edit ${title}`}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            {error && <div className="alert alert-err" style={{ margin: "0 0 1rem" }}>{error}</div>}
            <form onSubmit={handleSave}>
              {renderForm(formData, setFormData)}
              <div style={{ display: "flex", gap: 8, marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
