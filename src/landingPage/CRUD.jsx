import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";



const CrudPage = () => {
  // Persist accounts separately from other demo data
  const [accounts, setAccounts] = useState(() => {
    const fromStore = loadLocal("fa:accounts", null);
    if (fromStore) return fromStore;
    // Seed from names to give a starting point
    const seed = ALL_ROWS.slice(0, 8).map((r, i) => ({
      id: uid("acc"),
      name: r.business,
      email: `${r.business.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
      role: ["Owner", "Manager", "Analyst", "Viewer"][i % 4],
      status: ["Active", "Inactive"][i % 2],
      notes: "",
      createdAt: new Date().toISOString(),
    }));
    return seed;
  });
  useEffect(() => saveLocal("fa:accounts", accounts), [accounts]);

  // Create form
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Viewer",
    status: "Active",
    notes: "",
  });

  // Read controls
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdDesc");
  const [statusFilter, setStatusFilter] = useState("All");

  // Edit controls
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);

  // Delete controls
  const [selectedIds, setSelectedIds] = useState([]);

  const resetCreate = () =>
    setForm({ name: "", email: "", role: "Viewer", status: "Active", notes: "" });

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const createAccount = () => {
    if (!form.name.trim()) return alert("Name is required.");
    if (!form.email.trim() || !validateEmail(form.email)) return alert("Please enter a valid email.");
    const record = { ...form, id: uid("acc"), createdAt: new Date().toISOString() };
    setAccounts((a) => [record, ...a]);
    resetCreate();
  };

  const beginEdit = (acc) => {
    setEditingId(acc.id);
    setEditDraft({ ...acc });
  };
  const saveEdit = () => {
    if (!editDraft.name.trim()) return alert("Name is required.");
    if (!validateEmail(editDraft.email)) return alert("Email is invalid.");
    setAccounts((a) => a.map((x) => (x.id === editingId ? { ...editDraft } : x)));
    setEditingId(null);
    setEditDraft(null);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const toggleSelect = (id) =>
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const selectAllVisible = (ids) => setSelectedIds(ids);
  const clearSelection = () => setSelectedIds([]);

  const deleteOne = (id) => {
    if (!confirm("Delete this account?")) return;
    setAccounts((a) => a.filter((x) => x.id !== id));
    setSelectedIds((ids) => ids.filter((x) => x !== id));
  };
  const deleteSelected = () => {
    if (!selectedIds.length) return alert("Select at least one account.");
    if (!confirm(`Delete ${selectedIds.length} account(s)?`)) return;
    setAccounts((a) => a.filter((x) => !selectedIds.includes(x.id)));
    setSelectedIds([]);
  };

  const visible = useMemo(() => {
    let rows = accounts;
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          x.email.toLowerCase().includes(q) ||
          x.role.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") rows = rows.filter((x) => x.status === statusFilter);
    rows = [...rows];
    rows.sort((a, b) => {
      if (sortBy === "createdDesc") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "createdAsc") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
      if (sortBy === "nameDesc") return b.name.localeCompare(a.name);
      return 0;
    });
    return rows;
  }, [accounts, query, sortBy, statusFilter]);

  const visibleIds = visible.map((x) => x.id);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* CREATE */}
      <Panel
        title="Create Account"
        actions={<Badge tone="info" style={{ cursor: "default" }}>New</Badge>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr .8fr .8fr", gap: 8 }}>
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input className="input" placeholder="Email (name@company.com)" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <select className="select" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            {["Owner","Manager","Analyst","Viewer"].map((r) => <option key={r}>{r}</option>)}
          </select>
          <select className="select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            {["Active","Inactive"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <textarea
          className="input"
          style={{ marginTop: 8, width: "100%", minHeight: 70, resize: "vertical" }}
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="page-btn" onClick={createAccount} style={{ width: 120 }}>Create</button>
          <button className="page-btn" onClick={resetCreate} style={{ width: 120 }}>Reset</button>
        </div>
      </Panel>

      {/* READ / SEARCH / SORT */}
      <Panel
        title="Read Accounts"
        actions={<Badge style={{ cursor: "default" }}>{visible.length} shown</Badge>}
      >
        <div style={{ display:"grid", gridTemplateColumns:"1.3fr .9fr .9fr auto", gap:8, marginBottom:8 }}>
          <div className="search" style={{ minWidth: 0 }}>
            <Icon.Search />
            <input placeholder="Search by name, email, or role…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {["All","Active","Inactive"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdDesc">Newest first</option>
            <option value="createdAsc">Oldest first</option>
            <option value="nameAsc">Name A → Z</option>
            <option value="nameDesc">Name Z → A</option>
          </select>
          <div style={{ display:"flex", gap:8 }}>
            <button className="page-btn" onClick={() => { setQuery(""); setStatusFilter("All"); setSortBy("createdDesc"); }}>Clear</button>
            <button className="page-btn" onClick={() => selectAllVisible(visibleIds)}>Select All</button>
            <button className="page-btn" onClick={clearSelection}>Clear Selection</button>
          </div>
        </div>

        {/* Cards list */}
        <div style={{ display:"grid", gap:8 }}>
          {visible.map((acc) => {
            const selected = selectedIds.includes(acc.id);
            const isEditing = editingId === acc.id;
            return (
              <div key={acc.id} className="row" style={{ gridTemplateColumns:"auto 1fr auto", display:"grid", alignItems:"center", background:"var(--panel)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input type="checkbox" checked={selected} onChange={() => toggleSelect(acc.id)} aria-label={`Select ${acc.name}`} />
                </div>

                {!isEditing ? (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr .7fr .7fr", gap:8 }}>
                    <div>
                      <div className="cell-title">{acc.name}</div>
                      <div style={{ color:"var(--muted)", fontSize:13 }}>{acc.email}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight:700 }}>Role</div>
                      <div>{acc.role}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight:700 }}>Status</div>
                      <div>{acc.status}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight:700 }}>Created</div>
                      <div>{formatDate(acc.createdAt)}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr .7fr .7fr", gap:8 }}>
                    <input className="input" value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} />
                    <input className="input" value={editDraft.email} onChange={(e) => setEditDraft((d) => ({ ...d, email: e.target.value }))} />
                    <select className="select" value={editDraft.role} onChange={(e) => setEditDraft((d) => ({ ...d, role: e.target.value }))}>
                      {["Owner","Manager","Analyst","Viewer"].map((r) => <option key={r}>{r}</option>)}
                    </select>
                    <select className="select" value={editDraft.status} onChange={(e) => setEditDraft((d) => ({ ...d, status: e.target.value }))}>
                      {["Active","Inactive"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                  {!isEditing ? (
                    <>
                      <button className="page-btn" onClick={() => beginEdit(acc)} aria-label={`Edit ${acc.name}`}>✎</button>
                      <button className="page-btn" onClick={() => deleteOne(acc.id)} aria-label={`Delete ${acc.name}`}>🗑</button>
                    </>
                  ) : (
                    <>
                      <button className="page-btn" onClick={saveEdit} aria-label="Save">✔</button>
                      <button className="page-btn" onClick={cancelEdit} aria-label="Cancel">⏎</button>
                    </>
                  )}
                </div>

                {/* Notes row */}
                <div style={{ gridColumn:"1 / -1", marginTop:8 }}>
                  {!isEditing ? (
                    <div className="pill" style={{ display:"inline-flex", maxWidth:"100%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {acc.notes || "No notes"}
                    </div>
                  ) : (
                    <textarea
                      className="input"
                      placeholder="Notes…"
                      value={editDraft.notes}
                      onChange={(e) => setEditDraft((d) => ({ ...d, notes: e.target.value }))}
                      style={{ width:"100%", marginTop:6, minHeight:60, resize:"vertical" }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="panel" style={{ marginTop:8, textAlign:"center" }}>
            <div style={{ fontWeight:700 }}>No accounts match your filters.</div>
            <div style={{ color:"var(--muted)" }}>Try clearing the search or status filter.</div>
          </div>
        )}
      </Panel>

    </div>
  );
};