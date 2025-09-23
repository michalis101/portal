import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";


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