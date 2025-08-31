import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/** ============================================================================
 * Utilities
 * ========================================================================== */

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const cn = (...xs) => xs.filter(Boolean).join(" ");
const uid = (() => {
  let i = 0;
  return (prefix = "id") => `${prefix}-${++i}-${Math.random().toString(36).slice(2, 8)}`;
})();

const useOutsideClick = (refs, onOutside) => {
  useEffect(() => {
    const handler = (e) => {
      const nodes = (Array.isArray(refs) ? refs : [refs]).filter(Boolean);
      const inside = nodes.some((r) => r?.current && r.current.contains(e.target));
      if (!inside) onOutside?.(e);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [refs, onOutside]);
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!m?.matches);
    if (m) {
      update();
      m.addEventListener?.("change", update);
      return () => m.removeEventListener?.("change", update);
    }
  }, []);
  return reduced;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });

const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

const nextBillingDue = (signupISO, cycleDays = 30, from = new Date()) => {
  const s = new Date(signupISO);
  if (Number.isNaN(+s)) return null;
  const base = new Date(s);
  while (base <= from) base.setDate(base.getDate() + cycleDays);
  return base;
};

const saveLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
};
const loadLocal = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

/** ============================================================================
 * Icons (inline SVGs)
 * ========================================================================== */

const Icon = {
  ChevronDown: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Filter: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path d="M3 5h18L14 12v5l-4 2v-7L3 5z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Bot: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <rect x="6" y="5" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1.1" fill="currentColor" />
      <circle cx="14" cy="10" r="1.1" fill="currentColor" />
      <path d="M4 13h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="2" r="1" fill="currentColor" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  PaperPlane: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path d="M3 12l18-8-7 18-2-7-9-3z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Bell: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="20" r="1.8" fill="currentColor" />
    </svg>
  ),
  Settings: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path
        d="M12 8a4 4 0 110 8 4 4 0 010-8zm8 4a8 8 0 01-.3 2.2l2.2 1.7-2 3.5-2.6-1a8.5 8.5 0 01-3.7 2.1l-.4 2.7h-4l-.4-2.7A8.5 8.5 0 015.7 20l-2.6 1-2-3.5L3.3 14A8 8 0 013 12a8 8 0 01.3-2.2L1.1 8.1l2-3.5 2.6 1A8.5 8.5 0 019.4 3.5L9.8.8h4l.4 2.7a8.5 8.5 0 013.7 2.1l2.6-1 2 3.5-2.2 1.7A8 8 0 0120 12z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  ),
  Dots: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <circle cx="5" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="19" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path d="M10 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Flag: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...p}>
      <path d="M5 21V4l10 2-4 2 4 2-10 2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...p}>
      <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Dot: (p) => (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden {...p}>
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  ),
  OnlineDot: (p) => (
    <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden {...p}>
      <circle cx="10" cy="10" r="8" fill="#30d158" />
    </svg>
  ),
  Home: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Chart: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path d="M4 19h16M6 17V7m6 10V5m6 12V9" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Link: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
};

/** ============================================================================
 * Mock data (extended with signup dates & billing cycle)
 * ========================================================================== */

const SEED_ROWS = [
  { business: "Acme Financial Services", date: "2023-07-28", category: "Banking", assignee: "Sarah Johnson", status: "—" },
  { business: "Global Investments LLC", date: "2023-07-27", category: "Investment", assignee: "Robert Chen", status: "—" },
  { business: "TechPay Solutions", date: "2023-07-26", category: "Fintech", assignee: "Maria Garcia", status: "—" },
  { business: "Horizon Capital Group", date: "2023-07-25", category: "Investment", assignee: "James Wilson", status: "Flagged" },
  { business: "Secure Payment Processing", date: "2023-07-24", category: "Payment", assignee: "David Kim", status: "Active" },
  { business: "First National Trust", date: "2023-07-23", category: "Banking", assignee: "Emily Parker", status: "Closed" },
];

const MORE_NAMES = [
  "BlueRock Securities","GreenLeaf Banking","Aurora Investments","Pinnacle Holdings","SummitPay","Quantum Capital",
  "EverTrust Finance","VectorPay Systems","Vista Capital Partners","Silverline Trust","Harborstone Investments","Crestview Banking",
  "NexuPay","Mariner Holdings","Beacon Financial","Keystone Trust","NorthBridge Capital","BrightPay","Orion Ledger","Starlight Banking",
  "Golden Gate Funds","Atlas Trust","Zephyr Capital","Nimbus Pay",
];

// Deterministic-ish signup dates & cycle days
const withSignup = (rows) =>
  rows.map((r, i) => {
    const year = 2023 + ((i % 18) === 0 ? 1 : 0);
    const month = ((i * 7) % 12) + 1;
    const day = ((i * 3) % 28) + 1;
    const signup = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cycle = [14, 30, 30, 30, 90][i % 5];
    return { ...r, signupDate: signup, billingCycleDays: cycle };
  });

const ALL_ROWS = withSignup([
  ...SEED_ROWS,
  ...MORE_NAMES.map((name, i) => ({
    business: name,
    date: `2023-07-${String(22 - (i % 10)).padStart(2, "0")}`,
    category: ["Banking", "Investment", "Fintech", "Payment"][i % 4],
    assignee: ["Liam Carter", "Ava Brooks", "Noah Patel", "Olivia Nguyen"][i % 4],
    status: ["—", "Flagged", "Active", "Closed"][i % 4],
  })),
]);

/** ============================================================================
 * Styles (CSS-in-JS with theme support via [data-theme])
 *  - UPDATED: global scroll enabled so nothing is cut off
 *  - UPDATED: light mode text set to much darker color for visibility
 * ========================================================================== */

const Styles = () => (
  <style>{`
  :root{
    --radius:12px;
    --shadow:0 10px 25px rgba(0,0,0,.25);
    --transition-fast: .18s ease;
    --transition-med: .25s ease;
  }
  :root[data-theme="dark"]{
    --bg:#0b1224;
    --sidebar:#0f172a;
    --panel:#0b1735;
    --panel-2:#0a162f;
    --card:#0b142b;
    --text:#e8f0ff;
    --muted:#a3b2cc;
    --border:#1e2a44;
    --accent:#2b6ef6;
    --accent-2:#00b4ff;
    --green:#30d158;
    --yellow:#f5c451;
    --red:#ff6b6b;
    --chip:#0c1a3a;
    --bg-grad: linear-gradient(180deg, #08112a 0%, #070f21 100%);
    --ring: rgba(80,140,255,.25);
  }
  :root[data-theme="light"]{
    --bg:#f3f6ff;
    --sidebar:#ffffff;
    --panel:#ffffff;
    --panel-2:#f7f9ff;
    --card:#ffffff;
    /* UPDATED: significantly darker text for visibility in light mode */
    --text:#0c101b; /* deep slate */
    --muted:#1f2a44; /* darker muted too */
    --border:#c6d3f1;
    --accent:#214fd6;
    --accent-2:#008ad1;
    --green:#0b8a52;
    --yellow:#996a00;
    --red:#c73e3e;
    --chip:#e6eeff;
    --bg-grad: linear-gradient(180deg, #f7faff 0%, #e8f1ff 100%);
    --ring: rgba(33,79,214,.25);
  }

  *{box-sizing:border-box}
  html, body, #root { height:auto; min-height:100%; }
  body{
    margin:0; background: var(--bg-grad); color:var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    transition: background var(--transition-med), color var(--transition-med);
    overflow-y:auto; /* allow page scroll */
  }

  /* App shell */
  .app{ display:flex; min-height:100vh; overflow:auto } /* UPDATED: allow container scroll */
  .sidebar{
    width:240px;
    background:var(--sidebar);
    border-right:1px solid var(--border);
    display:flex; flex-direction:column;
    padding:18px 14px; gap:10px;
    box-shadow: 2px 0 10px rgba(0,0,0,.06);
    transition: background var(--transition-med), border-color var(--transition-med);
  }
  .logo{ display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px;
    background:linear-gradient(135deg, rgba(43,110,246,.15), rgba(0,180,255,.12));
    border:1px solid var(--border); }
  .logo-badge{ width:36px;height:36px;border-radius:10px;display:grid;place-items:center;
    background: linear-gradient(135deg, #2b6ef6, #00b4ff); color:white; font-weight:800;
    box-shadow: inset 0 0 0 2px rgba(255,255,255,.2), var(--shadow); }
  .nav{ margin-top:6px; display:grid; gap:6px }
  .nav-btn{ display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:10px;
    color:var(--muted); text-decoration:none; cursor:pointer; border:1px solid transparent;
    transition: transform .16s ease, background .22s ease, border-color .22s ease, color .22s ease; }
  .nav-btn:hover{ background:color-mix(in oklab, var(--panel) 75%, white 25%); transform: translateY(-1px); border-color:var(--border)}
  .nav-btn.active{ background:color-mix(in oklab, var(--panel) 85%, white 15%); border-color:#2a3c6811; color:var(--text) }
  .nav-label{ font-weight:650 }

  .main{ flex:1; display:flex; flex-direction:column; min-width:0; min-height:100vh; overflow:auto } /* UPDATED */
  .topbar{ height:56px; border-bottom:1px solid var(--border); background:var(--panel-2);
    display:flex; align-items:center; gap:10px; padding:0 16px; position:sticky; top:0; z-index:5; transition: background var(--transition-med), border-color var(--transition-med);}
  .top-title{ font-weight:800; letter-spacing:.2px }
  .tag{ background:var(--chip); border:1px solid var(--border); padding:3px 8px; color:var(--muted); border-radius:8px; font-size:12px }

  .chips{ display:flex; align-items:center; gap:8px }
  .chip{ display:inline-flex; align-items:center; gap:8px; padding:8px 10px; border-radius:10px;
    background:var(--panel); border:1px solid var(--border); color:var(--muted);
    transition: transform .12s ease, background .18s ease, border-color .18s ease; }
  .chip:hover{ background:color-mix(in oklab, var(--panel) 85%, white 15%); border-color:#2a3c6811; transform: translateY(-1px) }

  .content{
    flex:1; padding:16px; overflow:auto; /* UPDATED: ensure page area scrolls */
    background: radial-gradient(140% 120% at 100% 0%, rgba(43,110,246,.10), transparent 55%);
  }

  /* Filter row */
  .filters{ display:flex; gap:10px; flex-wrap:wrap; margin-bottom:14px }
  .search{ min-width:240px; display:flex; align-items:center; gap:8px; height:38px;
    border:1px solid var(--border); border-radius:10px; padding:0 10px; background:var(--panel); }
  .search input{ flex:1; background:transparent; border:none; outline:none; color:inherit; font-size:14px }

  .dropdown{ position:relative }
  .dd-btn{ height:38px; display:inline-flex; align-items:center; justify-content:space-between; gap:10px; min-width:170px;
    padding:0 12px; border-radius:10px; border:1px solid var(--border); background:var(--panel); color:inherit; cursor:pointer;
    transition: transform .12s ease, background .18s ease, border-color .18s ease; }
  .dd-btn:hover{ background:color-mix(in oklab, var(--panel) 85%, white 15%); border-color:#2a3c6811; transform: translateY(-1px) }
  .dd-menu{ position:absolute; top:44px; left:0; right:0; z-index:20; padding:8px; border-radius:10px;
    background:var(--panel-2); border:1px solid var(--border); box-shadow: var(--shadow); animation: pop .18s ease; }
  .dd-item{ padding:8px 10px; border-radius:8px; color:inherit; cursor:pointer; display:flex; align-items:center; justify-content:space-between; }
  .dd-item:hover{ background:color-mix(in oklab, var(--panel) 85%, white 15%) }

  /* Card + table (used on Chat Flow list) */
  .card{ border:1px solid var(--border); border-radius:12px; background:linear-gradient(180deg,var(--card),var(--panel-2)); box-shadow: var(--shadow) }
  .thead{ display:grid; grid-template-columns: 1.4fr .95fr .9fr .9fr .9fr 120px; gap:8px; padding:10px 12px; color:var(--muted);
    font-weight:800; font-size:13px; }
  .row{ display:grid; grid-template-columns: 1.4fr .95fr .9fr .9fr .9fr 120px; gap:8px; align-items:center; padding:10px 12px; margin:0 8px 8px;
    border-radius:10px; border:1px solid var(--border); background:var(--panel);
    transition: transform .14s ease, background .18s ease, border-color .18s ease; }
  .row:hover{ background:color-mix(in oklab, var(--panel) 85%, white 15%); transform: translateY(-1px); border-color:#2a3c6811 }
  .cell-title{ font-weight:700 }
  .assignee{ color:var(--muted) }
  .status{ display:inline-flex; align-items:center; gap:6px; font-weight:800; font-size:12px; border-radius:999px; padding:6px 10px;
    border:1px solid var(--border); justify-self:end; background:var(--chip); min-width:90px; justify-content:center; }
  .status.flag{ color:var(--yellow) }
  .status.act{ color:var(--green) }
  .status.cls{ color:#89a; opacity:.9 }
  .status.none{ opacity:.6 }

  /* Pagination */
  .pagination{ display:flex; align-items:center; gap:8px; padding:12px 10px; color:var(--muted) }
  .pager{ margin-left:auto; display:flex; align-items:center; gap:6px }
  .page-btn{ width:34px; height:34px; border-radius:9px; border:1px solid var(--border); display:grid; place-items:center; background:var(--panel); cursor:pointer;
    transition: transform .12s ease, background .18s ease, border-color .18s ease, color .18s ease; }
  .page-btn:hover{ background:color-mix(in oklab, var(--panel) 85%, white 15%); border-color:#2a3c6811; transform: translateY(-1px) }
  .page-btn.active{ background:#1a2f63; color:#fff; border-color:#2f4ea2 }
  :root[data-theme="light"] .page-btn.active{ background:#214fd6; }

  /* Assistant drawer widget (replaces floating chat) */
  .chat-drawer{ position:fixed; right:0; top:0; bottom:0; width:380px; border-left:1px solid var(--border);
         background:var(--panel-2); box-shadow: -8px 0 24px rgba(0,0,0,.25); overflow:auto; transform-origin:bottom right; animation: slideIn .25s ease; z-index:70; display:flex; flex-direction:column; } /* UPDATED overflow:auto */
  .chat-header{ display:flex; align-items:center; gap:10px; padding:10px 12px; border-bottom:1px solid var(--border); background:var(--panel) }
  .chat-title{ font-weight:800 }
  .online{ display:inline-flex; align-items:center; gap:6px; margin-left:auto; font-size:12px; color:var(--muted) }
  .chat-body{ flex:1; overflow:auto; padding:12px; display:flex; flex-direction:column; gap:10px;
              background: radial-gradient(120% 90% at 100% 0%, rgba(43,110,246,.12), transparent 60%) }
  .bubble{ max-width:82%; padding:10px 12px; border-radius:12px; border:1px solid var(--border); line-height:1.35; font-size:14px; }
  .bot{ align-self:flex-start; background:var(--panel) }
  .user{ align-self:flex-end; background:color-mix(in oklab, var(--panel) 80%, white 20%) }
  .chat-input{ display:flex; gap:8px; padding:12px; border-top:1px solid var(--border); background:var(--panel) }
  .chat-input input{ flex:1; background:var(--panel-2); border:1px solid var(--border); border-radius:9px; padding:10px 12px; color:inherit; outline:none }
  .send{ width:38px; height:38px; border-radius:9px; border:1px solid var(--border); display:grid; place-items:center; background:var(--panel-2); cursor:pointer;
         transition: transform .12s ease, background .18s ease, border-color .18s ease }
  .send:hover{ background:color-mix(in oklab, var(--panel-2) 80%, white 20%); border-color:#2a3c6811; transform: translateY(-1px) }

  /* Panels and mini components */
  .panel{ border:1px solid var(--border); border-radius:12px; background:var(--panel); box-shadow: var(--shadow); padding:14px }
  .panel-head{ display:flex; align-items:center; gap:10px; padding:6px 6px 10px; }
  .panel-title{ font-weight:800 }

  /* Drawer / Modal (Quick Settings) */
  .scrim{ position:fixed; inset:0; background:rgba(0,0,0,.35); backdrop-filter:saturate(120%) blur(2px); z-index:60; }
  .drawer{ position:fixed; right:0; top:0; bottom:0; width:360px; background:var(--panel-2); border-left:1px solid var(--border);
    box-shadow: -8px 0 24px rgba(0,0,0,.25); z-index:70; animation: slideIn .25s ease; display:flex; flex-direction:column; overflow:auto } /* UPDATED */

  .drawer-head{ display:flex; align-items:center; gap:10px; padding:12px; border-bottom:1px solid var(--border); background:var(--panel); }
  .drawer-body{ padding:12px; overflow:auto; display:grid; gap:10px; }

  /* Animations */
  @keyframes pop{ from{ transform:scale(.97); opacity:0 } to{ transform:scale(1); opacity:1 } }
  @keyframes drop{ from{ transform:scale(.92); opacity:0; filter:blur(1px) } to{ transform:scale(1); opacity:1; filter:blur(0) } }
  @keyframes shimmer{ from{ background-position:-468px 0 } to{ background-position:468px 0 } }
  @keyframes slideIn{ from{ transform:translateX(20px); opacity:.8 } to{ transform:translateX(0); opacity:1 } }
  .shimmer{
    animation-duration:1.25s; animation-fill-mode:forwards; animation-iteration-count:infinite; animation-name:shimmer; animation-timing-function:linear;
    background: linear-gradient(to right, rgba(255,255,255,0.06) 8%, rgba(255,255,255,0.14) 18%, rgba(255,255,255,0.06) 33%); background-size:800px 104px;
  }

  .kbd{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; background:var(--panel); border:1px solid var(--border);
        padding:2px 6px; border-radius:6px; color:var(--muted); font-size:11px }
  .esc-tip{ position:absolute; right:10px; top:8px; color:var(--muted); font-size:12px }

  /* Pills / Badges */
  .pill{ background:var(--chip); border:1px solid var(--border); padding:6px 10px; border-radius:999px; font-size:12px; display:inline-flex; gap:8px; align-items:center; }

  /* Inputs */
  .input, .select, .multiselect{ background:var(--panel-2); border:1px solid var(--border); border-radius:10px; padding:9px 10px; color:inherit; outline:none; }

`}</style>
);

/** ============================================================================
 * Small primitives
 * ========================================================================== */

const Tooltip = ({ label, children, placement = "top" }) => {
  const [open, setOpen] = useState(false);
  const id = useMemo(() => uid("tip"), []);
  return (
    <span
      className="tooltip-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      style={{ position: "relative", display: "inline-flex" }}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          id={id}
          style={{
            position: "absolute",
            whiteSpace: "nowrap",
            padding: "6px 8px",
            borderRadius: 8,
            fontSize: 12,
            color: "inherit",
            background: "var(--panel-2)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
            zIndex: 40,
            transform: "translateY(-8px)",
            [placement === "top" ? "bottom" : "top"]: "100%",
            left: "50%",
            transformOrigin: "bottom center",
            translate: "-50% -6px",
            animation: "pop .18s ease",
            pointerEvents: "none",
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
};

const Badge = ({ children, tone = "neutral", style, onClick }) => {
  const map = {
    neutral: { bg: "var(--chip)", bd: "var(--border)", fg: "inherit" },
    success: { bg: "#0f2a1900", bd: "var(--border)", fg: "var(--green)" },
    warn: { bg: "#20150b00", bd: "var(--border)", fg: "var(--yellow)" },
    info: { bg: "#0f214800", bd: "var(--border)", fg: "var(--accent)" },
  };
  const { bg, bd, fg } = map[tone] ?? map.neutral;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${bd}`,
        color: fg,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      className="pill"
    >
      {children}
    </button>
  );
};

const Switch = ({ checked, onChange }) => {
  const [focus, setFocus] = useState(false);
  return (
    <button
      onClick={() => onChange?.(!checked)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      aria-pressed={!!checked}
      className="switch"
      style={{
        width: 52,
        height: 30,
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: checked ? "linear-gradient(90deg,#2b6ef6,#00b4ff)" : "var(--panel-2)",
        position: "relative",
        transition: "background .25s ease",
        boxShadow: focus ? "0 0 0 3px var(--ring)" : undefined,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 26 : 3,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "var(--panel)",
          border: "1px solid var(--border)",
          transition: "left .25s ease",
        }}
      />
    </button>
  );
};

const PillStatus = ({ status }) => {
  if (status === "Flagged")
    return (
      <span className="status flag">
        <Icon.Flag /> Flagged
      </span>
    );
  if (status === "Active")
    return (
      <span className="status act">
        <Icon.Check /> Active
      </span>
    );
  if (status === "Closed")
    return (
      <span className="status cls">
        <Icon.Dot /> Closed
      </span>
    );
  return <span className="status none">—</span>;
};

const Dropdown = ({ label, options, value, onChange, width = 200 }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  useOutsideClick([btnRef, popRef], () => setOpen(false));
  return (
    <div className="dropdown" style={{ width }}>
      <button ref={btnRef} className="dd-btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span style={{ fontWeight: 650 }}>{label}</span>
        <span style={{ color: "var(--muted)" }}>{value}</span>
        <Icon.ChevronDown />
      </button>
      {open && (
        <div ref={popRef} className="dd-menu" role="listbox" aria-label={label}>
          {options.map((opt) => (
            <div
              key={opt}
              className="dd-item"
              role="option"
              aria-selected={value === opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <span>{opt}</span>
              {value === opt ? <span style={{ opacity: 0.9 }}>•</span> : <span style={{ opacity: 0.35 }}>—</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** ============================================================================
 * Header + Sidebar
 * ========================================================================== */

const Topbar = ({ notifications = 3, onOpenQuickSettings, onGoSettings, onOpenChat }) => (
  <div className="topbar">
    <div className="top-title">FluxAudit Finance Bot</div>
    <span className="tag">Beta</span>
    <div className="chips" style={{ marginLeft: 14 }}>
      <Badge
        tone="info"
        style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        onClick={onOpenChat}
      >
        <Icon.Bot /> Assistant
      </Badge>
    </div>
    <div style={{ flex: 1 }} />
    <Tooltip label="Notifications">
      <div className="chip" role="button" tabIndex={0} aria-label="Notifications">
        <Icon.Bell />
        <span>{notifications}</span>
      </div>
    </Tooltip>
    <Tooltip label="Quick Settings">
      <div className="chip" role="button" tabIndex={0} aria-label="Preferences" onClick={onOpenQuickSettings}>
        <Icon.Settings />
      </div>
    </Tooltip>
    <Tooltip label="Open full Settings">
      <div className="chip" role="button" tabIndex={0} aria-label="Open Settings Page" onClick={onGoSettings}>
        <Icon.Dots />
      </div>
    </Tooltip>
    <div className="esc-tip">
      <span className="kbd">esc</span> to exit
    </div>
  </div>
);

const Sidebar = ({ active, onChange }) => {
  const items = [
    { id: "chat", label: "Chat Flow", icon: <Icon.Home /> },
    { id: "crud", label: "CRUD Operations", icon: <Icon.Chart /> }, // changed made here for the crud operations 
    { id: "settings", label: "Settings", icon: <Icon.Settings /> },
    { id: "integrations", label: "Integrations", icon: <Icon.Link /> },
  ];
  return (
    <div className="sidebar">
      <div className="logo" aria-label="Logo">
        <div className="logo-badge">fA</div>
        <div>
          <div style={{ fontWeight: 800, letterSpacing: ".2px" }}>FluxAudit</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Assistant</div>
        </div>
      </div>

      <div className="nav" role="tablist" aria-label="Sidebar">
        {items.map((item) => (
          <div
            key={item.id}
            role="tab"
            aria-selected={active === item.id}
            tabIndex={0}
            className={cn("nav-btn", active === item.id && "active")}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => e.key === "Enter" && onChange(item.id)}
          >
            <span aria-hidden style={{ display: "grid", placeItems: "center" }}>
              {item.icon}
            </span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", display: "grid", gap: 8 }}>
        <Badge tone="success">
          <Icon.OnlineDot /> Online
        </Badge>
        <Badge>v1.0.0</Badge>
      </div>
    </div>
  );
};

/** ============================================================================
 * Quick Settings Drawer
 * ========================================================================== */

const QuickSettings = ({ open, onClose, prefs, setPrefs }) => {
  const ref = useRef(null);
  useOutsideClick([ref], () => open && onClose?.());
  if (!open) return null;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer" ref={ref} role="dialog" aria-label="Quick Settings">
        <div className="drawer-head">
          <strong>Quick Settings</strong>
          <div style={{ marginLeft: "auto" }} />
          <button className="page-btn" onClick={onClose} aria-label="Close">
            <Icon.Close />
          </button>
        </div>
        <div className="drawer-body">
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Light Mode</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{prefs.darkMode ? "Off" : "On"}</div>
            </div>
            <Switch
              checked={!prefs.darkMode}
              onChange={(v) => setPrefs((p) => ({ ...p, darkMode: !v ? true : false }))}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Realtime Alerts</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{prefs.realtimeAlerts ? "Enabled" : "Disabled"}</div>
            </div>
            <Switch checked={prefs.realtimeAlerts} onChange={(v) => setPrefs((p) => ({ ...p, realtimeAlerts: v }))} />
          </label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Weekly Digest</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{prefs.weeklyDigest ? "Enabled" : "Disabled"}</div>
            </div>
            <Switch checked={prefs.weeklyDigest} onChange={(v) => setPrefs((p) => ({ ...p, weeklyDigest: v }))} />
          </label>
        </div>
      </div>
    </>
  );
};

/** ============================================================================
 * Assistant Drawer (replaces floating ChatWidget; opens from right)
 * ========================================================================== */

const ChatDrawer = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text:
        "Welcome to FluxAudit Financial Assistant! I’m here to help with financial analysis, audit queries, and budget management. How can I assist you today?",
    },
    { role: "user", text: "I need help with financial analysis" },
    { role: "bot", text: "I can help with analysis! Want to explore cash flow, variance, or risk exposure?" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);

  useOutsideClick([ref], (e) => {
    if (open) onClose?.();
  });

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    el && el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, open, reduced]);

  if (!open) return null;

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Got it! I’ll draft a breakdown with KPIs and a quick variance snapshot. Tip: Use the Advanced Filters to focus.",
        },
      ]);
    }, 280);
  };

  return (
    <>
      <div className="scrim" />
      <div className="chat-drawer" ref={ref} role="dialog" aria-label="Assistant Drawer">
        <div className="chat-header">
          <div className="chip" style={{ gap: 6, padding: "6px 8px" }}>
            <Icon.Bot />
            <span className="chat-title">FluxAudit Assistant</span>
          </div>
          <span className="online">
            <Icon.OnlineDot /> Online
          </span>
          <div style={{ flex: 1 }} />
          <button className="send" aria-label="Close assistant" onClick={onClose}>
            <Icon.Close />
          </button>
        </div>
        <div className="chat-body" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={cn("bubble", m.role === "bot" ? "bot" : "user")}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            placeholder="Type your message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            aria-label="Message"
          />
          <button className="send" aria-label="Send" onClick={send}>
            <Icon.PaperPlane />
          </button>
        </div>
      </div>
    </>
  );
};

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

/** ============================================================================
 * CRUD OPERATIONS Page (REWRITTEN)
 * - Solely Create / Read / Update / Delete accounts (no business/clients table)
 * - Highly detailed controls for each operation
 * - Local persistence to localStorage
 * ========================================================================== */

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

/** ============================================================================
 * Settings + Integrations
 * ========================================================================== */

const SettingsPage = ({ prefs, setPrefs }) => {
  const items = [
    { key: "darkMode", label: "Dark Mode", desc: "Use the dark theme for reduced glare" },
    { key: "realtimeAlerts", label: "Realtime Alerts", desc: "Notify on new flags and webhooks" },
    { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary email every Monday" },
    { key: "autoAssign", label: "Auto-Assign", desc: "Distribute reviews automatically" },
    { key: "auditLock", label: "Audit Lock", desc: "Prevent edits on closed audits" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Panel
        title="Preferences"
        actions={
          <Badge tone="info" style={{ cursor: "default" }}>
            <Icon.Settings /> System
          </Badge>
        }
      >
        {items.map(({ key, label, desc }) => (
          <label
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--panel-2)",
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{label}</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{prefs[key] ? "Enabled" : "Disabled"} — {desc}</div>
            </div>
            <Switch checked={!!prefs[key]} onChange={(v) => setPrefs((t) => ({ ...t, [key]: v }))} />
          </label>
        ))}
      </Panel>

      <Panel
        title="Integrations"
        actions={
          <Badge tone="success" style={{ cursor: "default" }}>
            <Icon.Check /> Connected
          </Badge>
        }
      >
        <IntegrationList />
      </Panel>

      <Panel title="Audit Rules">
        <RuleEditor />
      </Panel>
      <Panel title="About">
        <AboutPane />
      </Panel>
    </div>
  );
};

const IntegrationList = () => {
  const list = [
    { name: "QuickBooks", desc: "Sync ledgers and invoices", connected: true },
    { name: "Xero", desc: "Import accounts & journals", connected: false },
    { name: "Stripe", desc: "Payments & payouts", connected: true },
    { name: "Plaid", desc: "Bank data access", connected: true },
  ];
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {list.map((x) => (
        <div key={x.name} className="row" style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--panel)" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{x.name}</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{x.desc}</div>
          </div>
          {x.connected ? (
            <Badge tone="success">
              <Icon.Check /> Connected
            </Badge>
          ) : (
            <Badge tone="warn">Not connected</Badge>
          )}
          <button className="page-btn" style={{ width: 90 }} onClick={() => alert("Demo action")}>
            Manage
          </button>
        </div>
      ))}
    </div>
  );
};

const RuleEditor = () => {
  const [rules, setRules] = useState([
    { id: uid("rule"), name: "High risk over $50k", enabled: true },
    { id: uid("rule"), name: "Unusual vendor frequency", enabled: true },
    { id: uid("rule"), name: "Weekend transactions", enabled: false },
  ]);
  const [newName, setNewName] = useState("");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Create a new rule…"
        />
        <button
          className="page-btn"
          onClick={() => {
            if (!newName.trim()) return;
            setRules((r) => [...r, { id: uid("rule"), name: newName.trim(), enabled: true }]);
            setNewName("");
          }}
        >
          Add
        </button>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {rules.map((r) => (
          <div key={r.id} className="row" style={{ background: "var(--panel)", alignItems: "center" }}>
            <div style={{ fontWeight: 700 }}>{r.name}</div>
            <div style={{ marginLeft: "auto" }} />
            <Switch checked={r.enabled} onChange={(v) => setRules((list) => list.map((x) => (x.id === r.id ? { ...x, enabled: v } : x)))} />
            <button className="page-btn" onClick={() => setRules((list) => list.filter((x) => x.id !== r.id))} aria-label="Delete rule">
              <Icon.Close />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutPane = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "center" }}>
    <div className="shimmer" style={{ height: 120, borderRadius: 12, border: "1px solid var(--border)" }} />
    <div>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>FluxAudit Finance Bot</div>
      <div style={{ color: "var(--muted)" }}>
        Version <span className="pill">Beta</span> — This assistant helps with financial analysis, audit queries, and budget management. Optimized for clarity and speed.
      </div>
      <div style={{ marginTop: 10 }}>
        <Badge tone="info">Changelog</Badge>
      </div>
    </div>
  </div>
);

const IntegrationsPage = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
    <Panel title="Connected Services">
      <IntegrationList />
    </Panel>
    <Panel title="Webhooks">
      <div className="row" style={{ background: "var(--panel)" }}>
        <div>
          <div style={{ fontWeight: 700 }}>POST /webhooks/fluxaudit</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>Receives audit events in real time</div>
        </div>
        <div style={{ marginLeft: "auto" }} />
        <Badge tone="success">Enabled</Badge>
      </div>
      <div className="row" style={{ background: "var(--panel)" }}>
        <div>
          <div style={{ fontWeight: 700 }}>POST /webhooks/payments</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>New payments and refunds</div>
        </div>
        <div style={{ marginLeft: "auto" }} />
        <Badge>Disabled</Badge>
      </div>
    </Panel>
  </div>
);

/** ============================================================================
 * Root component
 * ========================================================================== */

export default function Portal() {
  const [active, setActive] = useState("chat");

  // Global preferences (lifted so they can affect the whole app)
  const [prefs, setPrefs] = useState(() =>
    loadLocal("fa:prefs", { darkMode: true, realtimeAlerts: true, weeklyDigest: false, autoAssign: true, auditLock: false })
  );

  // Persist + reflect theme on root
  useEffect(() => {
    saveLocal("fa:prefs", prefs);
    const theme = prefs.darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, [prefs]);

  // Quick settings drawer
  const [qsOpen, setQsOpen] = useState(false);

  // Assistant drawer
  const [chatOpen, setChatOpen] = useState(false);

  // small easter egg: ESC closes drawers and shakes the tip
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "escape") {
        const el = document.querySelector(".esc-tip");
        if (el) {
          el.animate(
            [{ transform: "translateY(0)" }, { transform: "translateY(-2px)" }, { transform: "translateY(0)" }],
            { duration: 240 }
          );
        }
        setQsOpen(false);
        setChatOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <Styles />
      <Sidebar active={active} onChange={setActive} />
      <div className="main">
        <Topbar
          onOpenQuickSettings={() => setQsOpen(true)}
          onGoSettings={() => setActive("settings")}
          onOpenChat={() => setChatOpen(true)}
        />
        <div className="content">
          {active === "chat" && <ChatFlowPage prefs={prefs} />}
          {active === "settings" && <SettingsPage prefs={prefs} setPrefs={setPrefs} />}
          {active === "crud" && <CrudPage />}
          {active === "integrations" && <IntegrationsPage />}
        </div>
      </div>

      <QuickSettings open={qsOpen} onClose={() => setQsOpen(false)} prefs={prefs} setPrefs={setPrefs} />
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}


