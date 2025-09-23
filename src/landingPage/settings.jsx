import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";


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
  