/**
 * FluxAudit - Single File (Dark theme, Settings page added)
 *
 * - All components and styles in one file as requested.
 * - Uses the dark color scheme and text palette from your earlier design.
 * - Sidebar: Dashboard, Reports, Analytics, Alerts, Compliance, Chatbot, Settings
 * - Profile editing modal (top-left profile area)
 * - Real-time date & time (HH:MM:SS) displayed in header and small calendar widget
 * - Interactive KPIs (click to open focused analytics)
 * - Export CSV, Refresh, Run Audit (mock), Quick Actions, Alerts
 * - Settings page fully implemented with realistic options (email/push alerts, 2FA, timezone, export format, currency)
 *
 * Requirements: React 18+, react-dom, framer-motion, react-parallax-tilt, react-chartjs-2, chart.js, react-icons, normalize.css
 *
 * Drop into your project and render to a container with id="root".
 */

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import "normalize.css";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  FiBarChart2,
  FiBell,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiSettings,
  FiChevronLeft,
  FiPlus,
  FiClock,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiFileText,
  FiMessageSquare,
  FiShield,
  FiSave,
  FiKey,
  FiToggleLeft,
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTooltip,
  ChartLegend
);

/* =========================
   Dark theme styles (injected)
   ========================= */
const styles = `
:root{
  --bg:#0f1721;
  --panel:#0f1822;
  --muted:#9aa6b2;
  --card:#0c1420;
  --accent:#00d1b2;
  --lav:#BFA2DB;
  --glass: rgba(255,255,255,0.03);
  --border: rgba(255,255,255,0.04);
  font-family: Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;
  color-scheme: dark;
  color: #e6eef6;
}
*{box-sizing:border-box}
html,body,#root{height:100%;margin:0;background:linear-gradient(180deg,#091018 0%, #08101a 100%);color:#e6eef6}
.app{
  display:flex;
  min-height:100vh;
  gap:20px;
  padding:18px;
  align-items:flex-start;
  font-size:14px;
}

/* Sidebar */
.sidebar{
  width:260px;
  background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-radius:12px;
  padding:14px;
  color: #cfe3f7;
  border:1px solid var(--border);
  box-shadow: 0 6px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
  flex-shrink:0;
  display:flex;
  flex-direction:column;
  gap:12px;
}
.brand{display:flex;align-items:center;gap:10px;padding-bottom:6px}
.brand .logo{font-weight:800;font-size:18px;color:var(--lav)}
.profile{display:flex;gap:12px;align-items:center;padding:8px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin:6px 0;cursor:pointer}
.avatar{width:44px;height:44px;border-radius:8px;background:linear-gradient(135deg,#06b6d4,#7c3aed);display:flex;align-items:center;justify-content:center;color:white;font-weight:700}
.profile-info{font-size:13px}
.nav{display:flex;flex-direction:column;gap:8px;margin-top:6px}
.nav-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;background:transparent;border:1px solid transparent;color:#cfe3f7;cursor:pointer;font-size:14px}
.nav-item.active{background:linear-gradient(90deg, rgba(191,162,219,0.08), rgba(64,142,198,0.03));border:1px solid rgba(191,162,219,0.12);color:var(--lav)}
.nav-item .badge{margin-left:auto;background:#ff4d6d;color:white;padding:2px 8px;border-radius:999px;font-size:12px}

/* Main area */
.main{
  flex:1;
  display:flex;
  flex-direction:column;
  gap:18px;
  min-width:0;
}
.topbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding:12px;
  border-radius:12px;border:1px solid var(--border);
}
.top-left h2{margin:0;font-size:18px}
.updated{font-size:12px;color:var(--muted);margin-top:4px}
.top-right{display:flex;gap:12px;align-items:center}
.icon-btn, .export-btn{background:transparent;border:1px solid var(--border);padding:8px 10px;border-radius:8px;color:#cfe3f7;cursor:pointer;display:inline-flex;gap:8px;align-items:center}
.export-btn{background:linear-gradient(90deg,#0b2936, #07202b);}

/* layout */
.container{
  display:grid;
  grid-template-columns: 1fr 360px;
  gap:18px;
  align-items:start;
}

/* KPI & cards */
.summary-row{display:flex;gap:12px;margin-top:6px;flex-wrap:wrap}
.card{
  background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding:12px;border-radius:12px;border:1px solid var(--border);
  display:flex;flex-direction:column;gap:8px;min-width:160px;
  box-shadow: 0 6px 30px rgba(2,6,23,0.6);
}
.kpi-row{display:flex;justify-content:space-between;align-items:center}
.kpi-title{font-size:12px;color:var(--muted)}
.kpi-value{font-size:20px;font-weight:700}

/* charts & table */
.charts{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:12px;margin-top:12px;
}
.chart-card{min-height:220px;padding:12px;border-radius:10px;border:1px solid var(--border);background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))}
.table{width:100%;border-collapse:collapse}
.table th{font-size:12px;text-align:left;color:var(--muted);padding:10px 8px}
.table td{padding:10px 8px;border-top:1px solid rgba(255,255,255,0.02)}
.recent{margin-top:12px}

/* right column */
.right-col{display:flex;flex-direction:column;gap:12px}
.donut-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px;border-radius:12px;border:1px solid var(--border);background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))}

/* settings page */
.settings-page .field{margin-bottom:12px}
.switch{display:inline-flex;align-items:center;gap:8px;padding:6px;border-radius:999px;border:1px solid rgba(255,255,255,0.02);background:rgba(255,255,255,0.01)}

/* small helpers */
.search-input{display:flex;gap:8px;align-items:center;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.02);background:rgba(255,255,255,0.01)}
.small{font-size:12px;color:var(--muted)}
.btn-primary{background:var(--accent);color:#042027;padding:8px 12px;border-radius:8px;border:none;cursor:pointer}
.live-clock{display:flex;gap:8px;align-items:center;padding:6px 8px;border-radius:8px;border:1px solid rgba(255,255,255,0.02);background:rgba(255,255,255,0.01)}

/* modal */
.modal-backdrop{position:fixed;inset:0;background:rgba(2,6,23,0.6);display:flex;align-items:center;justify-content:center;z-index:200}
.modal{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));padding:18px;border-radius:12px;border:1px solid var(--border);width:420px}

/* responsive */
@media (max-width:1100px){
  .container{grid-template-columns: 1fr}
  .sidebar{display:none}
  .mobile-bottom{display:flex}
}
.mobile-bottom{display:none;position:fixed;left:50%;transform:translateX(-50%);bottom:18px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));padding:8px;border-radius:999px;border:1px solid var(--border);gap:8px;z-index:200}
`;

/* inject styles once */
if (!document.getElementById("flux-dark-styles")) {
  const s = document.createElement("style");
  s.id = "flux-dark-styles";
  s.innerHTML = styles;
  document.head.appendChild(s);
}

/* =========================
   Mock API (dark-themed)
   ========================= */
async function mockFetchDashboardData(delay = 300) {
  await new Promise((r) => setTimeout(r, delay));
  return {
    auditScore: 87,
    riskLevel: "Medium",
    complianceRate: 92.4,
    anomalies: 14,
    fraudSeries: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        { label: "Suspicious Transactions", data: [2, 4, 3, 6, 4, 9, 8], borderColor: "#ff6b6b" },
        { label: "Failed Authentication", data: [1, 3, 5, 2, 3, 4, 7], borderColor: "#f6b73c", borderDash: [6, 5] },
        { label: "Unusual Patterns", data: [0, 1, 2, 3, 5, 6, 10], borderColor: "#6ee7b7" },
      ],
    },
    complianceBars: {
      labels: ["SOX", "GDPR", "PCI DSS", "AML", "KYC", "FATCA"],
      values: [94, 88, 97, 92, 78, 85],
    },
    transactions: [
      { id: 1, txid: "TXN-2402010", payer: "Transfer from Bank", amount: 125430, date: "2025-02-29 09:41:PM", status: "Completed" },
      { id: 2, txid: "TXN-2402011", payer: "YouTube Premium", amount: -120, date: "2025-02-29 09:11:PM", status: "Completed" },
      { id: 3, txid: "TXN-2402012", payer: "Internet", amount: -320, date: "2025-02-29 05:14:PM", status: "Completed" },
      { id: 4, txid: "TXN-2402013", payer: "Transfer from Bank", amount: 1000, date: "2025-02-29 11:36:AM", status: "Completed" },
      { id: 5, txid: "TXN-2402014", payer: "Starbucks Coffee", amount: -72, date: "2025-02-29 09:41:AM", status: "Completed" },
      { id: 6, txid: "TXN-2402015", payer: "Salary (Freelance)", amount: 5000, date: "2025-02-28 10:12:PM", status: "Completed" },
      { id: 7, txid: "TXN-2402016", payer: "Crypto Investment", amount: 10000, date: "2025-02-27 10:12:PM", status: "Completed" },
      { id: 8, txid: "TXN-2402017", payer: "Amazon Purchase", amount: -320, date: "2025-02-27 10:12:PM", status: "Completed" },
      { id: 9, txid: "TXN-2402018", payer: "Spotify Premium", amount: -40, date: "2025-02-27 08:00:AM", status: "Failed" },
    ],
    alerts: [
      { id: 1, title: "Suspicious Transactions", count: 9, color: "#ff6b6b" },
      { id: 2, title: "Failed Auth Attempts", count: 7, color: "#ffb86b" },
      { id: 3, title: "Unusual Patterns", count: 12, color: "#6ee7b7" },
    ],
    subscriptions: [
      { id: 1, name: "YouTube", price: 20 },
      { id: 2, name: "Spotify", price: 69 },
      { id: 3, name: "Dribbble Pro", price: 59 },
    ],
    balances: { income: 92000, expense: 58500, total: 125430 },
  };
}

async function mockFetchReports(delay = 200) {
  await new Promise((r) => setTimeout(r, delay));
  return [
    { id: 101, name: "Q2 Financial Audit", created: "2025-06-25", owner: "Ayanda", status: "Complete" },
    { id: 102, name: "AML Check 2025-07", created: "2025-07-02", owner: "R. Patel", status: "Running" },
  ];
}

/* =========================
   Utilities
   ========================= */
function currencyZAR(amount) {
  const n = Number(amount || 0);
  return n < 0 ? `-R${Math.abs(n).toLocaleString()}` : `R${n.toLocaleString()}`;
}

function downloadCSV(filename, rows) {
  const csv = rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* =========================
   Small components
   ========================= */
function IconButton({ children, title, onClick }) {
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="icon-btn" title={title} onClick={onClick}>
      {children}
    </motion.button>
  );
}

function ClockLive() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="live-clock" aria-live="polite">
      <FiClock />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <div style={{ fontWeight: 700 }}>{now.toLocaleTimeString()}</div>
        <div className="small">{now.toLocaleDateString()}</div>
      </div>
    </div>
  );
}

/* =========================
   Pages & Modals
   ========================= */

function ProfileModal({ profile, onClose, onSave }) {
  const [local, setLocal] = useState(profile || { name: "", role: "" });
  useEffect(() => setLocal(profile), [profile]);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800 }}>Edit Profile</div>
          <button className="icon-btn" onClick={onClose}><FiChevronLeft /></button>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="small">Full Name</label>
          <input value={local.name} onChange={(e) => setLocal(l => ({ ...l, name: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid var(--border)", marginTop: 6, background: "transparent", color: "inherit" }} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="small">Role</label>
          <input value={local.role} onChange={(e) => setLocal(l => ({ ...l, role: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid var(--border)", marginTop: 6, background: "transparent", color: "inherit" }} />
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="icon-btn" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(local)}><FiSave /> Save</button>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({
  data,
  onRefresh,
  onExport,
  onRunAudit,
  onGoto,
  onOpenProfile,
  txSearch,
  setTxSearch,
  onKpiClick,
}) {
  const lineData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };
    return {
      labels: data.fraudSeries.labels,
      datasets: data.fraudSeries.datasets.map((ds) => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.borderColor,
        backgroundColor: "transparent",
        tension: 0.35,
        pointRadius: 3,
        borderWidth: 2,
        borderDash: ds.borderDash || [],
      })),
    };
  }, [data]);

  const barData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };
    return {
      labels: data.complianceBars.labels,
      datasets: [
        {
          label: "% compliance",
          data: data.complianceBars.values,
          backgroundColor: data.complianceBars.values.map((v) => (v < 80 ? "#ffb86b" : "#00d1b2")),
        },
      ],
    };
  }, [data]);

  const donutData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };
    return {
      labels: ["Income", "Expense"],
      datasets: [{ data: [data.balances.income, data.balances.expense], backgroundColor: ["#06b6d4", "#ef4444"] }],
    };
  }, [data]);

  const transactions = useMemo(() => {
    if (!data?.transactions) return [];
    const q = (txSearch || "").toLowerCase();
    return data.transactions.filter((t) => `${t.payer} ${t.txid}`.toLowerCase().includes(q));
  }, [data, txSearch]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, flex: 1 }}>
              <div className="card" style={{ flex: 1, cursor: "pointer" }} onClick={() => onKpiClick("auditScore")}>
                <div className="kpi-row">
                  <div>
                    <div className="kpi-title">Audit Score</div>
                    <div className="kpi-value">{data?.auditScore ?? "—"}/100</div>
                  </div>
                  <div style={{ alignSelf: "center" }}><FiShield size={20} color="#06b6d4" /></div>
                </div>
                <div className="small">Click to view historical audit scores</div>
              </div>

              <div className="card" style={{ width: 200, cursor: "pointer" }} onClick={() => onKpiClick("riskLevel")}>
                <div className="kpi-title">Risk Level</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="kpi-value">{data?.riskLevel ?? "—"}</div>
                  <div className="small" style={{ color: data?.riskLevel === "High" ? "#ff6b6b" : data?.riskLevel === "Medium" ? "#ffb86b" : "#6ee7b7" }}>{data?.riskLevel}</div>
                </div>
              </div>

              <div className="card" style={{ width: 200, cursor: "pointer" }} onClick={() => onKpiClick("complianceRate")}>
                <div className="kpi-title">Compliance Rate</div>
                <div className="kpi-value">{data?.complianceRate ?? "—"}%</div>
                <div className="small">Click to deep-dive into compliance by regulation</div>
              </div>

              <div className="card" style={{ width: 200, cursor: "pointer" }} onClick={() => onKpiClick("anomalies")}>
                <div className="kpi-title">Detected Anomalies</div>
                <div className="kpi-value">{data?.anomalies ?? 0}</div>
                <div className="small">Click to view alerts</div>
              </div>
            </div>

            <div style={{ width: 320 }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div className="small">Total Balance</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{currencyZAR(data?.balances?.total ?? 0)}</div>
                    <div className="small" style={{ color: "var(--muted)" }}>+12.5% compared to last month</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="small">Date / Time</div>
                    <div><ClockLive /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="charts" style={{ marginTop: 12 }}>
            <Tilt glareEnable={false} tiltMaxAngleX={6} tiltMaxAngleY={6} className="chart-card" style={{ minHeight: 260 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>Fraud Pattern Detection</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="icon-btn" onClick={() => onGoto("analytics")}>View Analytics</button>
                  <div className="small">Weekly</div>
                </div>
              </div>
              <div style={{ height: 180 }}>
                <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#cfe3f7" } } } }} />
              </div>
            </Tilt>

            <div className="chart-card" style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>Compliance Status</div>
                <div className="small">Filter: All Regulations</div>
              </div>
              <div style={{ height: 180 }}>
                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </div>

          <div className="recent" style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontWeight: 700 }}>Transactions</div>
                <div className="small">Showing latest</div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div className="search-input">
                  <FiSearch />
                  <input placeholder="Search transactions" value={txSearch} onChange={(e) => setTxSearch(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", color: "inherit" }} />
                </div>
                <IconButton title="Refresh" onClick={onRefresh}><FiRefreshCw /></IconButton>
                <button className="export-btn" onClick={onExport}><FiDownload /> Export</button>
                <button className="btn-primary" onClick={onRunAudit}><FiPlus /> Run Audit</button>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="table" role="table" aria-label="Transactions table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Transaction ID</th>
                    <th>Payment Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td><input type="checkbox" aria-label={`Select ${t.txid}`} /></td>
                      <td style={{ fontWeight: 700 }}>{t.txid}</td>
                      <td>{t.payer}</td>
                      <td style={{ color: t.amount < 0 ? "#ff6b6b" : "#6ee7b7", fontWeight: 700 }}>{currencyZAR(t.amount)}</td>
                      <td className="small">{t.date}</td>
                      <td className="small" style={{ color: t.status === "Failed" ? "#ff6b6b" : "#6ee7b7" }}>{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <div className="small">Showing {transactions.length} of {data?.transactions?.length ?? 0}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="icon-btn">«</button>
                <button className="icon-btn">1</button>
                <button className="icon-btn">2</button>
                <button className="icon-btn">»</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: 360 }}>
          <div className="donut-wrap">
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <div style={{ fontWeight: 800 }}>Category Breakdown</div>
              <div className="small">Income vs Expense</div>
            </div>
            <div style={{ width: 160, height: 160 }}>
              <Doughnut data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} />
            </div>
            <div style={{ fontWeight: 800 }}>{currencyZAR(data?.balances?.total ?? 0)} Total Balance</div>
            <div className="small">Your dining expense increased by 20% compared to last month</div>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700 }}>Anomaly Alerts</div>
              <div className="small">Real-time</div>
            </div>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {data?.alerts?.map(a => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.02)" }}>
                  <div style={{ width: 10, height: 10, background: a.color, borderRadius: 6 }} />
                  <div style={{ fontWeight: 700 }}>{a.title}</div>
                  <div style={{ marginLeft: "auto" }} className="small">{a.count} cases</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700 }}>Subscriptions List</div>
                <div className="small">Manage</div>
              </div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                {data?.subscriptions?.map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#071827", display: "flex", alignItems: "center", justifyContent: "center", color: "#cfe3f7" }}>{s.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{s.name}</div>
                        <div className="small">Auto renew</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>{currencyZAR(s.price)}</div>
                      <div className="small">Monthly</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700 }}>Quick Actions</div>
                  <div className="small">Shortcuts</div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="icon-btn" style={{ flex: 1 }} onClick={() => alert("Open Chatbot (mock)")}>Chatbot</button>
                  <button className="export-btn" style={{ flex: 1 }} onClick={() => onExport()}><FiDownload /> Export</button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>AI Insight</div>
                  <div className="small">You have saved R1,200 this month…</div>
                </div>
                <div><button className="btn-primary">Auto Save</button></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* Reports page */
function ReportsPage({ reports, onBack, onCreate, onExportCSV }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
          <h2 style={{ margin: 0 }}>Reports</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="export-btn" onClick={onCreate}><FiPlus /> New Report</button>
          <button className="export-btn" onClick={onExportCSV}><FiDownload /> Export All</button>
        </div>
      </div>

      <div className="recent" style={{ marginTop: 12 }}>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Created</th><th>Owner</th><th>Status</th></tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 700 }}>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.created}</td>
                <td>{r.owner}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Analytics page (focused metric) */
function AnalyticsPage({ metric, data, onBack }) {
  const chart = useMemo(() => {
    if (!data) return null;
    if (metric === "auditScore") {
      return { type: "line", data: { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul"], datasets: [{ label: "Audit Score", data: [70,72,75,78,80,85,data.auditScore || 87], borderColor: "#6ee7b7", fill: false }] } };
    }
    if (metric === "complianceRate") {
      return { type: "bar", data: { labels: data.complianceBars.labels, datasets: [{ label: "Compliance %", data: data.complianceBars.values, backgroundColor: data.complianceBars.values.map(v => v < 80 ? "#ffb86b" : "#00d1b2") }] } };
    }
    if (metric === "riskLevel") {
      return { type: "pie", data: { labels: ["Low","Medium","High"], datasets: [{ data: [35,45,20], backgroundColor: ["#6ee7b7","#ffb86b","#ff6b6b"] }] } };
    }
    if (metric === "anomalies") {
      return { type: "line", data: { labels: data.fraudSeries.labels, datasets: [{ label: "Anomalies", data: data.fraudSeries.datasets[0].data, borderColor: "#ff6b6b", fill: false }] } };
    }
    return null;
  }, [metric, data]);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
        <h2 style={{ margin: 0 }}>{metric === "auditScore" ? "Audit Score History" : metric === "complianceRate" ? "Compliance by Regulation" : metric === "riskLevel" ? "Risk Overview" : "Anomalies Over Time"}</h2>
      </div>

      <div className="chart-card" style={{ height: 420 }}>
        <div style={{ height: "100%" }}>
          {chart?.type === "bar" ? <Bar data={chart.data} options={{ maintainAspectRatio: false }} /> : <Line data={chart.data} options={{ maintainAspectRatio: false }} />}
        </div>
      </div>
    </div>
  );
}

/* Alerts page */
function AlertsPage({ alerts, onBack, onAcknowledgeAll }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
        <h2 style={{ margin: 0 }}>Alerts</h2>
      </div>

      <div className="recent">
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button className="icon-btn" onClick={onAcknowledgeAll}>Acknowledge All</button>
          <button className="export-btn">Export Alerts</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {alerts.map(a => (
            <div key={a.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 10, height: 10, background: a.color, borderRadius: 4 }} />
              <div style={{ fontWeight: 700 }}>{a.title}</div>
              <div style={{ marginLeft: "auto" }} className="small">{a.count} cases</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Compliance page */
function CompliancePage({ complianceBars, onBack }) {
  const barData = useMemo(() => {
    if (!complianceBars) return { labels: [], datasets: [] };
    return {
      labels: complianceBars.labels,
      datasets: [{ label: "Compliance %", data: complianceBars.values, backgroundColor: complianceBars.values.map(v => (v < 80 ? "#ffb86b" : "#00d1b2")) }],
    };
  }, [complianceBars]);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
        <h2 style={{ margin: 0 }}>Compliance</h2>
      </div>

      <div className="chart-card" style={{ height: 320 }}>
        <Bar data={barData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}

/* Chatbot placeholder */
function ChatbotPage({ onBack }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
        <h2 style={{ margin: 0 }}>Chatbot</h2>
      </div>
      <div className="card">
        <div style={{ fontWeight: 700 }}>Ask the Audit Assistant</div>
        <div className="small" style={{ marginTop: 8 }}>This is a mock chatbot — integrate a real chat backend to enable responses.</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <input placeholder="Ask something..." style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "inherit" }} />
          <button className="btn-primary"><FiMessageSquare /> Send</button>
        </div>
      </div>
    </div>
  );
}

/* Settings page (full) */
function SettingsPage({ settings, setSettings, onBack }) {
  return (
    <div className="settings-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
          <h2 style={{ margin: 0 }}>Settings</h2>
        </div>
        <div className="small">Manage account & preferences</div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700 }}>Preferences</div>
        <div style={{ marginTop: 12 }}>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="small">Currency</label>
            <select value={settings.currency} onChange={(e) => setSettings(s => ({ ...s, currency: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid var(--border)", marginTop: 6, background: "transparent", color: "inherit" }}>
              <option value="ZAR">South African Rand (R)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="field">
            <label className="small">Date / Time Format</label>
            <select value={settings.dateFormat} onChange={(e) => setSettings(s => ({ ...s, dateFormat: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid var(--border)", marginTop: 6, background: "transparent", color: "inherit" }}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="ISO">ISO (YYYY-MM-DD)</option>
            </select>
          </div>

          <div className="field" style={{ marginTop: 12 }}>
            <label className="small">Timezone</label>
            <select value={settings.timezone} onChange={(e) => setSettings(s => ({ ...s, timezone: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid var(--border)", marginTop: 6, background: "transparent", color: "inherit" }}>
              <option>Africa/Johannesburg</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={settings.emailAlerts} onChange={(e) => setSettings(s => ({ ...s, emailAlerts: e.target.checked }))} />
              <span className="small">Email Alerts</span>
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={settings.pushAlerts} onChange={(e) => setSettings(s => ({ ...s, pushAlerts: e.target.checked }))} />
              <span className="small">Push Alerts</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={settings.smsAlerts} onChange={(e) => setSettings(s => ({ ...s, smsAlerts: e.target.checked }))} />
              <span className="small">SMS Alerts</span>
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={settings.twoFA} onChange={(e) => setSettings(s => ({ ...s, twoFA: e.target.checked }))} />
              <span className="small">Two-factor Authentication</span>
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label className="small">Export Format</label>
            <select value={settings.exportFormat} onChange={(e) => setSettings(s => ({ ...s, exportFormat: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid var(--border)", marginTop: 6, background: "transparent", color: "inherit" }}>
              <option value="csv">CSV</option>
              <option value="xlsx">XLSX</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
            <button className="icon-btn" onClick={() => alert("Settings saved (mock)")}>Cancel</button>
            <button className="btn-primary" onClick={() => alert("Settings saved (mock)")}><FiSave /> Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   App - root
   ========================= */
export default function App() {
  const [page, setPage] = useState("dashboard"); // dashboard|reports|analytics|alerts|compliance|chatbot|settings
  const [dashboardData, setDashboardData] = useState(null);
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txSearch, setTxSearch] = useState("");
  const [profile, setProfile] = useState({ name: "Michalis Govender", role: "Senior Auditor" });
  const [showProfile, setShowProfile] = useState(false);
  const [settings, setSettings] = useState({
    currency: "ZAR",
    dateFormat: "DD/MM/YYYY",
    timezone: "Africa/Johannesburg",
    emailAlerts: true,
    pushAlerts: true,
    smsAlerts: false,
    twoFA: true,
    exportFormat: "csv",
  });
  const [metricFocus, setMetricFocus] = useState(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      const [d, r] = await Promise.all([mockFetchDashboardData(300), mockFetchReports(200)]);
      if (!mounted) return;
      setDashboardData(d);
      setReports(r);
      setAlerts(d.alerts || []);
      setLoading(false);
    }
    init();
    mountedRef.current = true;
    return () => { mounted = false; };
  }, []);

  // simulated small realtime updates
  useEffect(() => {
    const id = setInterval(() => {
      setDashboardData((prev) => {
        if (!prev) return prev;
        const delta = Math.round((Math.random() - 0.5) * 2);
        return { ...prev, auditScore: Math.max(60, Math.min(100, prev.auditScore + delta)) };
      });
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const d = await mockFetchDashboardData(250);
    setDashboardData(d);
    setAlerts(d.alerts || []);
    setLoading(false);
  }, []);

  const runAudit = useCallback(async () => {
    setLoading(true);
    setDashboardData(d => d ? { ...d, auditScore: Math.min(100, d.auditScore + 2), anomalies: Math.max(0, d.anomalies - 1) } : d);
    await new Promise(r => setTimeout(r, 900));
    const d = await mockFetchDashboardData(300);
    setDashboardData(d);
    setAlerts(d.alerts || []);
    setLoading(false);
    alert("Audit run complete (mock).");
  }, []);

  const exportReportsCSV = useCallback(() => {
    const rows = ["id,name,created,owner,status"];
    (reports || []).forEach(r => rows.push([r.id, `"${r.name}"`, r.created, r.owner, r.status].join(",")));
    downloadCSV(`reports_export_${new Date().toISOString().slice(0,10)}.csv`, rows);
  }, [reports]);

  const createReport = () => {
    const nr = { id: Date.now(), name: "New On-Demand Report", created: new Date().toISOString().slice(0,10), owner: profile.name, status: "Draft" };
    setReports(rs => [nr, ...rs]);
    setPage("reports");
  };

  const acknowledgeAll = () => {
    if (!confirm("Acknowledge all alerts? (mock)")) return;
    setAlerts([]);
    alert("All alerts acknowledged (mock).");
  };

  const saveProfile = (p) => {
    setProfile(p);
    setShowProfile(false);
    alert("Profile saved (mock).");
  };

  const handleKpiClick = (metric) => {
    setMetricFocus(metric);
    setPage("analytics");
  };

  return (
    <div className="app" role="application" aria-label="FluxAudit dashboard">
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.88 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 80, background: "#061018", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "#cfe3f7", fontSize: 18 }}>Loading data…</div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="sidebar" role="navigation" aria-label="Main sidebar">
        <div className="brand">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#6ee7b7,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#042027", fontWeight: 800 }}>
            FA
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "var(--lav)" }}>FluxAudit</div>
            <div className="small">Financial Audit</div>
          </div>
        </div>

        <div className="profile" role="button" onClick={() => setShowProfile(true)}>
          <div className="avatar"><FiUser color="#fff" /></div>
          <div className="profile-info">
            <div style={{ fontWeight: 700 }}>{profile.name}</div>
            <div className="small">{profile.role}</div>
          </div>
        </div>

        <nav className="nav" aria-label="Sidebar navigation">
          <div className={`nav-item ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}><FiBarChart2 /> <span>Dashboard</span></div>
          <div className={`nav-item ${page === "reports" ? "active" : ""}`} onClick={() => setPage("reports")}><FiFileText /> <span>Reports</span></div>
          <div className={`nav-item ${page === "analytics" ? "active" : ""}`} onClick={() => setPage("analytics")}><FiSearch /> <span>Analytics</span></div>
          <div className={`nav-item ${page === "alerts" ? "active" : ""}`} onClick={() => setPage("alerts")}><FiBell /> <span>Alerts</span><span className="badge">4</span></div>
          <div className={`nav-item ${page === "compliance" ? "active" : ""}`} onClick={() => setPage("compliance")}><FiShield /> <span>Compliance</span></div>
          <div className={`nav-item ${page === "chatbot" ? "active" : ""}`} onClick={() => setPage("chatbot")}><FiMessageSquare /> <span>Chatbot</span></div>
          <div className={`nav-item ${page === "settings" ? "active" : ""}`} onClick={() => setPage("settings")}><FiSettings /> <span>Settings</span></div>
        </nav>

        <div style={{ marginTop: "auto" }}>
          <div className="small" style={{ color: "var(--muted)" }}>Help & Support</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="icon-btn" onClick={() => alert("Help center (mock)")}>Help</button>
            <button className="icon-btn" onClick={() => alert("Settings (open)")}><FiSettings /></button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <h2>{page === "dashboard" ? "Financial Audit Dashboard" : page[0].toUpperCase() + page.slice(1)}</h2>
            <div className="updated">Last updated: {new Date().toLocaleString()}</div>
          </div>

          <div className="top-right">
            <IconButton title="Refresh" onClick={refresh}><FiRefreshCw /></IconButton>
            <IconButton title="Notifications" onClick={() => setPage("alerts")}><FiBell /></IconButton>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div className="search-input" style={{ width: 260 }}>
                <FiSearch />
                <input placeholder="Search anything..." style={{ border: "none", outline: "none", width: "100%", background: "transparent", color: "inherit" }} />
              </div>
              <div><ClockLive /></div>
            </div>
          </div>
        </header>

        <div className="container" style={{ marginTop: 12 }}>
          <div style={{ minWidth: 0 }}>
            {page === "dashboard" && (
              <DashboardPage
                data={dashboardData}
                onRefresh={refresh}
                onExport={exportReportsCSV}
                onRunAudit={runAudit}
                onGoto={setPage}
                onOpenProfile={() => setShowProfile(true)}
                txSearch={txSearch}
                setTxSearch={setTxSearch}
                onKpiClick={handleKpiClick}
              />
            )}

            {page === "reports" && <ReportsPage reports={reports} onBack={() => setPage("dashboard")} onCreate={createReport} onExportCSV={exportReportsCSV} />}

            {page === "analytics" && <AnalyticsPage metric={metricFocus || "auditScore"} data={dashboardData} onBack={() => setPage("dashboard")} />}

            {page === "alerts" && <AlertsPage alerts={alerts} onBack={() => setPage("dashboard")} onAcknowledgeAll={acknowledgeAll} />}

            {page === "compliance" && <CompliancePage complianceBars={dashboardData?.complianceBars} onBack={() => setPage("dashboard")} />}

            {page === "chatbot" && <ChatbotPage onBack={() => setPage("dashboard")} />}

            {page === "settings" && <SettingsPage settings={settings} setSettings={setSettings} onBack={() => setPage("dashboard")} />}
          </div>

          <aside className="right-col" style={{ width: 360 }}>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 800 }}>Total Transactions This Month</div>
                <div className="small">Summary</div>
              </div>
              <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{currencyZAR(dashboardData?.balances?.total ?? 0)}</div>
                <div className="small" style={{ color: "#6ee7b7" }}>+12.5%</div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700 }}>Category Breakdown</div>
                <div className="small">This month</div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <Doughnut data={{ labels: ["Income", "Expense"], datasets: [{ data: [dashboardData?.balances?.income ?? 0, dashboardData?.balances?.expense ?? 0], backgroundColor: ["#06b6d4", "#ff6b6b"] }] }} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700 }}>Calendar</div>
                  <div className="small">Live</div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <ClockLive />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700 }}>Anomalies</div>
                  <div className="small">Real-time</div>
                </div>
                <div style={{ marginTop: 8 }}>
                  {dashboardData?.alerts?.map(a => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.02)", marginBottom: 8 }}>
                      <div style={{ width: 10, height: 10, background: a.color, borderRadius: 6 }} />
                      <div style={{ fontWeight: 700 }}>{a.title}</div>
                      <div style={{ marginLeft: "auto" }} className="small">{a.count} cases</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700 }}>Quick Actions</div>
                  <div className="small">Shortcuts</div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="icon-btn" style={{ flex: 1 }} onClick={() => runAudit()}><FiPlus /> Run Audit</button>
                  <button className="export-btn" style={{ flex: 1 }} onClick={() => exportReportsCSV()}><FiDownload /> Export</button>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {showProfile && <ProfileModal profile={profile} onClose={() => setShowProfile(false)} onSave={saveProfile} />}

    </div>
  );
}

/* Render to #root if present */
if (document.getElementById("root")) {
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
}
