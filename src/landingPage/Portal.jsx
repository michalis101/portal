import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import settings from './landingPage/settings';
import CRUD from './landingPage/CRUD';
import Pages from './landingPage/Pages'
import ChatFlow from './landingPage/ChatFlow'
import SideBar from './landingPage/SidebBar'
import smallPrimitives from './landingPage/smallPrimitives'
import Utilities from './landingPage/Utilities'


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

