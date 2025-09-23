import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/** ============================================================================
 * Filter bar + Table + Pagination  (Chat Flow page only)
 * - Realtime search: updates as the user types
 * - Prefix match: businesses starting with typed letters
 * ========================================================================== */

const FilterBar = ({ filters, setFilters, onOpenAdvanced }) => {
    const [query, setQuery] = useState(filters.query ?? "");
    const acct = ["Account Status", "All", "Open", "Closed", "Flagged", "Active"];
    const risks = ["Risk", "All", "Low", "Medium", "High", "Critical"];
    const signupRanges = ["Signup Date", "All", "This Month", "Last 30 days", "This Quarter", "Custom…"];
  
    const [customOpen, setCustomOpen] = useState(false);
    const customRef = useRef(null);
    useOutsideClick([customRef], () => setCustomOpen(false));
  
    const onSelectSignup = (v) => {
      setFilters((f) => ({ ...f, signupRange: v }));
      setCustomOpen(v === "Custom…");
    };
  
    return (
      <>
        <div className="filters">
          <div className="search" aria-label="Search">
            <Icon.Search />
            <input
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                // REALTIME update of filters on each keystroke
                setFilters((f) => ({ ...f, query: val }));
              }}
              placeholder="Search businesses"
            />
          </div>
          <Dropdown label="Account" value={filters.account} options={acct} onChange={(v) => setFilters((f) => ({ ...f, account: v }))} width={190} />
          <Dropdown label="Risk Level" value={filters.risk} options={risks} onChange={(v) => setFilters((f) => ({ ...f, risk: v }))} width={170} />
          <Dropdown label="Signup" value={filters.signupRange} options={signupRanges} onChange={onSelectSignup} width={170} />
          {filters.signupRange === "Custom…" && (
            <div className="dropdown" ref={customRef} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                className="input"
                type="date"
                value={filters.customStart || ""}
                onChange={(e) => setFilters((f) => ({ ...f, customStart: e.target.value }))}
                aria-label="Custom start date"
              />
              <span>—</span>
              <input
                className="input"
                type="date"
                value={filters.customEnd || ""}
                onChange={(e) => setFilters((f) => ({ ...f, customEnd: e.target.value }))}
                aria-label="Custom end date"
              />
            </div>
          )}
          <div style={{ flex: 1 }} />
          <Badge tone="info" onClick={onOpenAdvanced}>
            <Icon.Filter /> Filters
          </Badge>
        </div>
      </>
    );
  };
  
  const Table = ({ rows, page, setPage, pageSize = 6, total }) => {
    const start = (page - 1) * pageSize;
    const slice = rows.slice(start, start + pageSize);
    const totalPages = Math.ceil(rows.length / pageSize);
  
    return (
      <div className="card">
        <div className="thead">
          <div>Business Name</div>
          <div>Transaction Date</div>
          <div>Category</div>
          <div>Assigned To</div>
          <div>Signup Date</div>
          <div style={{ textAlign: "right" }}>Next Payment</div>
        </div>
        <div role="table" aria-label="Records" aria-rowcount={rows.length}>
          {slice.map((r, idx) => {
            const due = nextBillingDue(r.signupDate, r.billingCycleDays, new Date());
            const daysLeft = due ? daysBetween(new Date(), due) : null;
            return (
              <div key={r.business + idx} className="row" role="row">
                <div className="cell-title" role="cell">
                  {r.business}
                </div>
                <div role="cell">{formatDate(r.date)}</div>
                <div role="cell">{r.category}</div>
                <div className="assignee" role="cell">
                  {r.assignee}
                </div>
                <div role="cell">{formatDate(r.signupDate)}</div>
                <div role="cell" style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                  <PillStatus status={r.status} />
                  <span className="pill" title={due ? `${daysLeft} day(s) left` : ""} style={{ minWidth: 90, justifyContent: "center" }}>
                    {due ? formatDate(due) : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pagination">
          <span>
            Showing {Math.min(start + 1, rows.length)}-{Math.min(start + pageSize, rows.length)} of {total} records
          </span>
          <div className="pager" role="navigation" aria-label="Pagination">
            <button className="page-btn" aria-label="Previous page" onClick={() => setPage((p) => clamp(p - 1, 1, totalPages))}>
              <Icon.ArrowLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={cn("page-btn", page === i + 1 && "active")} onClick={() => setPage(i + 1)} aria-current={page === i + 1 ? "page" : undefined}>
                {i + 1}
              </button>
            ))}
            <button className="page-btn" aria-label="Next page" onClick={() => setPage((p) => clamp(p + 1, 1, totalPages))}>
              <Icon.ArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  /** ============================================================================
   * Advanced Filters Panel
   * ========================================================================== */
  
  const AdvancedFilters = ({ open, onClose, filters, setFilters, data }) => {
    const ref = useRef(null);
    useOutsideClick([ref], () => open && onClose?.());
    if (!open) return null;
  
    const categories = Array.from(new Set(data.map((d) => d.category))).sort();
    const assignees = Array.from(new Set(data.map((d) => d.assignee))).sort();
    const statuses = ["—", "Flagged", "Active", "Closed"];
  
    const local = useMemo(
      () => ({
        categories: new Set(filters.categories || []),
        assignees: new Set(filters.assignees || []),
        statuses: new Set(filters.statuses || []),
      }),
      [filters]
    );
  
    const [sel, setSel] = useState({
      categories: new Set(local.categories),
      assignees: new Set(local.assignees),
      statuses: new Set(local.statuses),
    });
  
    const apply = () => {
      setFilters((f) => ({
        ...f,
        categories: Array.from(sel.categories),
        assignees: Array.from(sel.assignees),
        statuses: Array.from(sel.statuses),
      }));
      onClose?.();
    };
  
    const reset = () => {
      setSel({ categories: new Set(), assignees: new Set(), statuses: new Set() });
    };
  
    const Chip = ({ active, children, onClick }) => (
      <button
        className="pill"
        style={{ borderColor: active ? "var(--accent)" : "var(--border)", color: active ? "var(--accent)" : "inherit" }}
        onClick={onClick}
      >
        {children}
      </button>
    );
  
    return (
      <>
        <div className="scrim" onClick={onClose} />
        <div className="drawer" ref={ref} role="dialog" aria-label="Advanced Filters" style={{ width: 420 }}>
          <div className="drawer-head">
            <strong>Advanced Filters</strong>
            <div style={{ marginLeft: "auto" }} />
            <button className="page-btn" onClick={onClose}>
              <Icon.Close />
            </button>
          </div>
          <div className="drawer-body" style={{ gap: 14 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Category</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {categories.map((c) => (
                  <Chip
                    key={c}
                    active={sel.categories.has(c)}
                    onClick={() =>
                      setSel((s) => {
                        const next = new Set(s.categories);
                        next.has(c) ? next.delete(c) : next.add(c);
                        return { ...s, categories: next };
                      })
                    }
                  >
                    {c}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Assignee</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {assignees.map((a) => (
                  <Chip
                    key={a}
                    active={sel.assignees.has(a)}
                    onClick={() =>
                      setSel((s) => {
                        const next = new Set(s.assignees);
                        next.has(a) ? next.delete(a) : next.add(a);
                        return { ...s, assignees: next };
                      })
                    }
                  >
                    {a}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Status</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {statuses.map((st) => (
                  <Chip
                    key={st}
                    active={sel.statuses.has(st)}
                    onClick={() =>
                      setSel((s) => {
                        const next = new Set(s.statuses);
                        next.has(st) ? next.delete(st) : next.add(st);
                        return { ...s, statuses: next };
                      })
                    }
                  >
                    {st}
                  </Chip>
                ))}
              </div>
            </div>
  
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button className="page-btn" onClick={apply} aria-label="Apply filters">Apply</button>
              <button className="page-btn" onClick={reset} aria-label="Reset filters">Reset</button>
            </div>
          </div>
        </div>
      </>
    );
  };