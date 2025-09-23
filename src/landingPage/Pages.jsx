import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/** ============================================================================
 * Pages
 * ========================================================================== */

const ChatFlowPage = ({ prefs }) => {
    const [filters, setFilters] = useState({
      account: "Account Status",
      risk: "Risk",
      signupRange: "Signup Date",
      customStart: "",
      customEnd: "",
      query: "",
      categories: [],
      assignees: [],
      statuses: [],
    });
    const [advOpen, setAdvOpen] = useState(false);
    const [page, setPage] = useState(1);
  
    const filtered = useMemo(() => {
      let rows = ALL_ROWS;
  
      // Realtime Search (prefix match)
      if (filters.query) {
        const q = filters.query.toLowerCase();
        rows = rows.filter((r) => r.business.toLowerCase().startsWith(q));
      }
      // Account status (maps to status)
      if (filters.account && filters.account !== "Account Status" && filters.account !== "All") {
        const acc = filters.account;
        rows = rows.filter((r) => {
          if (acc === "Open") return r.status === "Active" || r.status === "Flagged" || r.status === "—";
          if (acc === "Closed") return r.status === "Closed";
          return r.status === acc;
        });
      }
      // Risk (demo mapping to statuses)
      if (filters.risk && filters.risk !== "Risk" && filters.risk !== "All") {
        const map = {
          Low: ["—", "Closed"],
          Medium: ["Active", "—"],
          High: ["Flagged", "Active"],
          Critical: ["Flagged"],
        };
        const allowed = map[filters.risk] || [];
        rows = rows.filter((r) => allowed.includes(r.status));
      }
      // Advanced filters
      if (filters.categories?.length) rows = rows.filter((r) => filters.categories.includes(r.category));
      if (filters.assignees?.length) rows = rows.filter((r) => filters.assignees.includes(r.assignee));
      if (filters.statuses?.length) rows = rows.filter((r) => filters.statuses.includes(r.status));
  
      // Signup date range
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const last30 = new Date(now);
      last30.setDate(last30.getDate() - 30);
  
      if (filters.signupRange === "This Month") rows = rows.filter((r) => new Date(r.signupDate) >= monthStart);
      if (filters.signupRange === "Last 30 days") rows = rows.filter((r) => new Date(r.signupDate) >= last30);
      if (filters.signupRange === "This Quarter") rows = rows.filter((r) => new Date(r.signupDate) >= quarterStart);
      if (filters.signupRange === "Custom…" && filters.customStart && filters.customEnd) {
        const s = new Date(filters.customStart);
        const e = new Date(filters.customEnd);
        rows = rows.filter((r) => {
          const d = new Date(r.signupDate);
          return d >= s && d <= e;
        });
      }
      return rows;
    }, [filters]);
  
    return (
      <>
        <FilterBar filters={filters} setFilters={setFilters} onOpenAdvanced={() => setAdvOpen(true)} />
        <Table rows={filtered} total={ALL_ROWS.length} page={page} setPage={setPage} />
        <div style={{ height: 80 }} />
        <AdvancedFilters open={advOpen} onClose={() => setAdvOpen(false)} filters={filters} setFilters={setFilters} data={ALL_ROWS} />
      </>
    );
  };
  
  const Panel = ({ title, actions, children, style }) => (
    <div className="panel" style={style}>
      <div className="panel-head">
        <div className="panel-title">{title}</div>
        <div style={{ marginLeft: "auto" }}>{actions}</div>
      </div>
      <div>{children}</div>
    </div>
  );