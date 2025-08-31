import React, { useEffect, useState, useMemo } from "react";
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
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  FiBarChart2,
  FiBell,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiSettings,
  FiChevronLeft,
  FiPlus,
} from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartTooltip, ChartLegend);

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
}
*{box-sizing:border-box}
body,html,#root{height:100%;margin:0;background:linear-gradient(180deg,#091018 0%, #08101a 100%);color:#e6eef6}
.app{
  display:flex;
  min-height:100vh;
  gap:24px;
  padding:22px;
  align-items:flex-start;
}
/* Sidebar */
.sidebar{
  width:260px;
  background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-radius:12px;
  padding:18px;
  color: #cfe3f7;
  border:1px solid var(--border);
  box-shadow: 0 6px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
  flex-shrink:0;
}
.brand{display:flex;align-items:center;gap:10px;padding-bottom:8px}
.brand .logo{font-weight:700;font-size:20px;color:var(--lav)}
.profile{display:flex;gap:12px;align-items:center;padding:12px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin:8px 0}
.avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;color:white;font-weight:700}
.profile-info{font-size:13px}
.nav{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.nav-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;background:transparent;border:1px solid transparent;color:#cfe3f7;cursor:pointer;font-size:14px}
.nav-item.active{background:linear-gradient(90deg, rgba(191,162,219,0.08), rgba(64,142,198,0.03));border:1px solid rgba(191,162,219,0.12);color:var(--lav)}
.nav-item .badge{margin-left:auto;background:#ff4d6d;color:white;padding:2px 8px;border-radius:999px;font-size:12px}

/* Main area */
.main{
  flex:1;
  display:flex;
  flex-direction:column;
  gap:18px;
}
.topbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding:16px;
  border-radius:12px;border:1px solid var(--border);
}
.top-left h2{margin:0;font-size:18px}
.updated{font-size:12px;color:var(--muted);margin-top:4px}
.top-right{display:flex;gap:8px;align-items:center}
.icon-btn, .export-btn{background:transparent;border:1px solid var(--border);padding:8px 10px;border-radius:8px;color:#cfe3f7;cursor:pointer}
.export-btn{display:flex;gap:8px;align-items:center;background:linear-gradient(90deg,#0b2936, #07202b);}

/* Grid */
.grid{
  display:grid;
  grid-template-columns: 1fr 360px;
  gap:18px;
  align-items:start;
}

/* Cards row */
.stats-row{display:flex;gap:12px;margin-top:4px}
.stat-card{
  flex:1;
  background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding:14px;border-radius:10px;border:1px solid var(--border);
  display:flex;flex-direction:column;gap:10px;
  min-width:160px;
}
.stat-title{font-size:12px;color:var(--muted)}
.stat-value{font-size:22px;font-weight:700}
.stat-bottom{display:flex;align-items:center;gap:12px;justify-content:space-between}
.mini-bar{height:6px;background:var(--glass);border-radius:6px;flex:1;margin-left:12px;overflow:hidden}
.mini-bar .fill{height:100%;background:linear-gradient(90deg,var(--lav), #7ae7c7);width:40%}

/* Charts area */
.charts{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:12px;margin-top:12px;
}
.chart-card{
  background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding:14px;border-radius:12px;border:1px solid var(--border);min-height:240px;
}
.chart-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.chart-header h3{margin:0;font-size:14px}
.chip{background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:999px;font-size:12px;border:1px solid rgba(255,255,255,0.02)}

/* Recent Transactions & right column */
.recent{margin-top:12px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));padding:12px;border-radius:12px;border:1px solid var(--border)}
.tx-item{display:flex;justify-content:space-between;padding:10px 6px;border-radius:8px;align-items:center}
.tx-left{display:flex;gap:12px;align-items:center}
.tx-avatar{width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#06b6d4,#7c3aed);display:flex;align-items:center;justify-content:center;color:white}
.tx-meta{font-size:13px}
.tx-amt{font-weight:700;color:#a7f3d0}

/* Right column */
.right-col{display:flex;flex-direction:column;gap:12px}
.alerts{padding:12px;border-radius:12px;border:1px solid var(--border);background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))}
.alert-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.02)}

/* Buttons and tables in content pages */
.table{width:100%;border-collapse:collapse}
.table th{font-size:12px;text-align:left;color:var(--muted);padding:10px 8px}
.table td{padding:10px 8px;border-top:1px solid rgba(255,255,255,0.02)}

/* Tiny helpers */
.kpi{display:flex;gap:12px;align-items:center}
.pulse{animation:pulse 1.6s infinite}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.02)}100%{transform:scale(1)}}

/* responsiveness */
@media (max-width:1100px){
  .grid{grid-template-columns: 1fr}
  .sidebar{display:none}
}
`;

/* inject style once */
if (!document.getElementById("fa-styles")) {
  const s = document.createElement("style");
  s.id = "fa-styles";
  s.innerHTML = styles;
  document.head.appendChild(s);
}
// Example: Replace this with real fetch or axios call to your API
async function mockFetchDashboardData() {
  // Emulate delay
  await new Promise((r) => setTimeout(r, 300));
  // Return mock payload
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
      { id: 1, user: "J. Doe", note: "Payment - Invoice #4321", amount: 1250, time: "2h ago" },
      { id: 2, user: "A. Smith", note: "Failed auth attempt", amount: 0, time: "4h ago" },
      { id: 3, user: "R. Patel", note: "Refund processed", amount: 320, time: "1d ago" },
    ],
    alerts: [
      { id: 1, type: "Suspicious Transactions", count: 9, level: "high", color: "#ff6b6b" },
      { id: 2, type: "Failed Auth Attempts", count: 7, level: "medium", color: "#ffb86b" },
      { id: 3, type: "Unusual Patterns", count: 12, level: "medium", color: "#6ee7b7" },
    ],
  };
}

async function mockFetchReports() {
  await new Promise((r) => setTimeout(r, 200));
  return [
    { id: 101, name: "Q2 Financial Audit", created: "2025-06-25", owner: "Ayanda", status: "Complete" },
    { id: 102, name: "AML Check 2025-07", created: "2025-07-02", owner: "R. Patel", status: "Running" },
  ];
}

function IconButton({ children, title, onClick, style }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="icon-btn"
      title={title}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.button>
  );
}

function DashboardPage({ data, onRunAudit, onExportReport, onGoto }) {
  // prepare chart data as react-chartjs-2 format
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

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#cfe3f7", boxWidth: 10 } }, tooltip: { mode: "index", intersect: false } },
    scales: { x: { grid: { display: false }, ticks: { color: "#9aa6b2" } }, y: { grid: { color: "rgba(255,255,255,0.02)" }, ticks: { color: "#9aa6b2" } } },
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}%` } } },
    scales: { x: { grid: { display: false }, ticks: { color: "#9aa6b2" } }, y: { display: false } },
  };

  return (
    <div>
      {/* Top KPI row */}
      <div className="stats-row" role="list">
        <motion.div className="stat-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <div className="stat-title">Audit Score</div>
            <div className="stat-value">{data?.auditScore ?? "—"}/100</div>
          </div>
          <div className="stat-bottom">
            <div style={{ fontSize: 13, color: "var(--muted)" }}>+3.2%</div>
            <div className="mini-bar" aria-hidden>
              <div className="fill" style={{ width: `${data?.auditScore ?? 40}%` }} />
            </div>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <div className="stat-title">Risk Level</div>
            <div className="stat-value">{data?.riskLevel ?? "—"}</div>
          </div>
          <div className="stat-bottom">
            <div style={{ fontSize: 13, color: "var(--muted)" }}>+5.7%</div>
            <div className="mini-bar" aria-hidden>
              <div className="fill" style={{ width: `${data ? (data.riskLevel === "High" ? 90 : data.riskLevel === "Medium" ? 50 : 20) : 50}%` }} />
            </div>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <div className="stat-title">Compliance Rate</div>
            <div className="stat-value">{data?.complianceRate ?? "—"}%</div>
          </div>
          <div className="stat-bottom">
            <div style={{ fontSize: 13, color: "var(--muted)" }}>+1.8%</div>
            <div className="mini-bar" aria-hidden>
              <div className="fill" style={{ width: `${data?.complianceRate ?? 70}%` }} />
            </div>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <div className="stat-title">Detected Anomalies</div>
            <div className="stat-value">{data?.anomalies ?? 0}</div>
          </div>
          <div className="stat-bottom">
            <div style={{ fontSize: 13, color: "var(--muted)" }}>4 new</div>
            <div className="mini-bar" aria-hidden>
              <div className="fill" style={{ width: `${Math.min(100, (data?.anomalies ?? 10) * 6)}%` }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts + recent + right column */}
      <div className="grid" style={{ marginTop: 12 }}>
        <div>
          <div style={{ display: "flex", gap: 12 }}>
            <Tilt glareEnable={false} tiltMaxAngleX={6} tiltMaxAngleY={6} className="chart-card" style={{ flex: 1 }}>
              <div style={{ height: 260, display: "flex", flexDirection: "column" }}>
                <div className="chart-header">
                  <h3>Fraud Pattern Detection</h3>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button className="icon-btn" onClick={() => onGoto("analytics")}>View Analytics</button>
                    <div className="chip">Weekly</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>
            </Tilt>

            <Tilt glareEnable={false} tiltMaxAngleX={6} tiltMaxAngleY={6} className="chart-card" style={{ width: 320 }}>
              <div style={{ height: 260, display: "flex", flexDirection: "column" }}>
                <div className="chart-header">
                  <h3>Compliance Status</h3>
                  <div className="chip">Filter: All Regulations</div>
                </div>
                <div style={{ flex: 1 }}>
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            </Tilt>
          </div>

          <div className="recent" style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Recent Transactions</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button className="icon-btn" onClick={() => onGoto("reports")}>View All</button>
                <button className="export-btn" onClick={onExportReport}><FiDownload /> Export</button>
              </div>
            </div>

            {data?.transactions?.map((t) => (
              <div key={t.id} className="tx-item" style={{ marginTop: 8 }}>
                <div className="tx-left">
                  <div className="tx-avatar">{t.user.charAt(0)}</div>
                  <div className="tx-meta">
                    <div style={{ fontWeight: 700 }}>{t.user}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.note} • {t.time}</div>
                  </div>
                </div>
                <div className="tx-amt">${t.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* right column */}
        <aside className="right-col" style={{ width: 360 }}>
          <div className="alerts">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Anomaly Alerts</h3>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>4 new</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data?.alerts?.map((a) => (
                <motion.div key={a.id} whileHover={{ scale: 1.02 }} className="alert-item">
                  <div style={{ width: 10, height: 10, background: a.color, borderRadius: 4 }} />
                  <div style={{ fontWeight: 700 }}>{a.type}</div>
                  <div style={{ marginLeft: "auto", color: "var(--muted)" }}>{a.count} cases</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div className="recent" aria-label="Quick Actions">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Quick Actions</h3>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Shortcuts</div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="icon-btn" style={{ flex: 1 }} onClick={onRunAudit}><FiPlus /> Run Audit</button>
              <button className="export-btn" style={{ flex: 1 }} onClick={onExportReport}>Export</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ReportsPage({ reports, onCreateReport, onBack }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
          <h2 style={{ margin: 0 }}>Reports</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="export-btn" onClick={onCreateReport}><FiPlus /> New Report</button>
        </div>
      </div>

      <div className="recent">
        <table className="table" role="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Created</th><th>Owner</th><th>Status</th></tr>
          </thead>
          <tbody>
            {reports.map((r) => (
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

function AnalyticsPage({ fraudSeries, onBack }) {
  // For demo, show the line chart full-screen like a detailed analytics view
  const lineData = useMemo(() => {
    if (!fraudSeries) return { labels: [], datasets: [] };
    return {
      labels: fraudSeries.labels,
      datasets: fraudSeries.datasets.map((ds) => ({
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
  }, [fraudSeries]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#cfe3f7", boxWidth: 10 } }, tooltip: { mode: "index", intersect: false } },
    scales: { x: { grid: { display: false }, ticks: { color: "#9aa6b2" } }, y: { grid: { color: "rgba(255,255,255,0.02)" }, ticks: { color: "#9aa6b2" } } },
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
        <h2 style={{ margin: 0 }}>Analytics</h2>
      </div>

      <div className="chart-card" style={{ height: 420 }}>
        <div style={{ height: "100%" }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}

function AlertsPage({ alerts, onBack }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
        <h2 style={{ margin: 0 }}>Alerts</h2>
      </div>

      <div className="recent">
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button className="icon-btn">Acknowledge All</button>
          <button className="export-btn">Export Alerts</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {alerts.map((a) => (
            <div key={a.id} className="alert-item">
              <div style={{ width: 10, height: 10, background: a.color, borderRadius: 4 }} />
              <div style={{ fontWeight: 700 }}>{a.type}</div>
              <div style={{ marginLeft: "auto", color: "var(--muted)" }}>{a.count} cases</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompliancePage({ complianceBars, onBack }) {
  const barData = useMemo(() => {
    if (!complianceBars) return { labels: [], datasets: [] };
    return {
      labels: complianceBars.labels,
      datasets: [
        {
          label: "Compliance %",
          data: complianceBars.values,
          backgroundColor: complianceBars.values.map((v) => (v < 80 ? "#ffb86b" : "#00d1b2")),
        },
      ],
    };
  }, [complianceBars]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}%` } } },
    scales: { x: { grid: { display: false }, ticks: { color: "#9aa6b2" } }, y: { display: false } },
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <button className="icon-btn" onClick={onBack}><FiChevronLeft /> Back</button>
        <h2 style={{ margin: 0 }}>Compliance</h2>
      </div>

      <div className="chart-card" style={{ height: 340 }}>
        <div style={{ height: "100%" }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard"); // 'dashboard' | 'reports' | 'analytics' | 'alerts' | 'compliance'
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // load initial data (simulate API)
  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      setLoading(true);
      const d = await mockFetchDashboardData();
      const r = await mockFetchReports();
      if (!mounted) return;
      setDashboardData(d);
      setReports(r);
      setAlerts(d.alerts || []);
      setLoading(false);
    }
    loadAll();
    return () => (mounted = false);
  }, []);

  // navigation helpers
  const goto = (p) => setPage(p);

  // actions: run audit, export, create report (placeholders that can call backend)
  async function handleRunAudit() {
    // EXAMPLE: replace with API call
    // await fetch('/api/run-audit', { method: 'POST' })
    setIsExporting(false);
    setLoading(true);
    try {
      // simulate work
      await new Promise((r) => setTimeout(r, 900));
      // After running, refresh dashboard
      const d = await mockFetchDashboardData();
      setDashboardData(d);
      setAlerts(d.alerts || []);
      setLoading(false);
      alert("Audit run complete — dashboard refreshed.");
    } catch (err) {
      console.error(err);
      alert("Audit run failed (mock).");
      setLoading(false);
    }
  }

  async function handleExportReport() {
    // EXAMPLE: Replace with actual export link or server-side generation
    setIsExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      // In real app you'd trigger file download from server; here we simulate
      const csv = "id,name,created,owner,status\n101,Q2 Financial Audit,2025-06-25,Ayanda,Complete\n";
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reports_export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Export failed.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleCreateReport() {
    // EXAMPLE: Open modal to create report; here we append a mock report and navigate to reports
    const newReport = { id: Date.now(), name: "New On-Demand Report", created: new Date().toISOString().slice(0, 10), owner: "You", status: "Draft" };
    setReports((rs) => [newReport, ...rs]);
    alert("New report created (mock).");
    setPage("reports");
  }

  // For accessibility: show loading overlay
  const LoadingOverlay = () => (
    <AnimatePresence>
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 80, background: "#061018", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#cfe3f7", fontSize: 18 }}>Loading data…</div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="app" role="application">
      <LoadingOverlay />

      <aside className="sidebar" role="navigation" aria-label="Main sidebar">
        <div className="brand">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#6ee7b7,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#042027", fontWeight: 800 }}>
            FA
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: 700, color: "var(--lav)" }}>FluxAudit</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Financial Audit</div>
          </div>
        </div>

        <div className="profile">
          <div className="avatar"><AiOutlineUser /></div>
          <div className="profile-info">
            <div style={{ fontWeight: 700 }}>Michalis Govender</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Senior Auditor</div>
          </div>
        </div>

        <nav className="nav" aria-label="Sidebar navigation">
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => goto("dashboard")} className={`nav-item ${page === "dashboard" ? "active" : ""}`}><FiBarChart2 /> <span>Dashboard</span></motion.button>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => goto("reports")} className={`nav-item ${page === "reports" ? "active" : ""}`}><FiBarChart2 /> <span>Reports</span></motion.button>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => goto("analytics")} className={`nav-item ${page === "analytics" ? "active" : ""}`}><FiSearch /> <span>Analytics</span></motion.button>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => goto("alerts")} className={`nav-item ${page === "alerts" ? "active" : ""}`}><FiBell /> <span>Alerts</span><span className="badge">4</span></motion.button>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => goto("compliance")} className={`nav-item ${page === "compliance" ? "active" : ""}`}><FiSettings /> <span>Compliance</span></motion.button>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <h2>{page === "dashboard" ? "Financial Audit Dashboard" : page[0].toUpperCase() + page.slice(1)}</h2>
            <div className="updated">Last updated: 28 June 2025, 09:42 AM</div>
          </div>

          <div className="top-right">
            <IconButton title="Refresh" onClick={async () => { setLoading(true); const d = await mockFetchDashboardData(); setDashboardData(d); setAlerts(d.alerts || []); setLoading(false);} }><FiRefreshCw /></IconButton>
            <IconButton title="Notifications" onClick={() => goto("alerts")}><FiBell /></IconButton>
            <motion.button whileHover={{ scale: 1.05 }} className="export-btn" onClick={handleExportReport}>{isExporting ? "Exporting..." : <><FiDownload /> Export Report</>}</motion.button>
          </div>
        </header>

        <div style={{ paddingBottom: 22 }}>
          {/* Render pages */}
          <AnimatePresence mode="wait">
            {page === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <DashboardPage
                  data={dashboardData}
                  onRunAudit={handleRunAudit}
                  onExportReport={handleExportReport}
                  onGoto={goto}
                />
              </motion.div>
            )}

            {page === "reports" && (
              <motion.div key="reports" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <ReportsPage reports={reports} onCreateReport={handleCreateReport} onBack={() => goto("dashboard")} />
              </motion.div>
            )}

            {page === "analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <AnalyticsPage fraudSeries={dashboardData?.fraudSeries} onBack={() => goto("dashboard")} />
              </motion.div>
            )}

            {page === "alerts" && (
              <motion.div key="alerts" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <AlertsPage alerts={alerts} onBack={() => goto("dashboard")} />
              </motion.div>
            )}

            {page === "compliance" && (
              <motion.div key="compliance" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <CompliancePage complianceBars={dashboardData?.complianceBars} onBack={() => goto("dashboard")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}


if (document.getElementById("root")) {
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
}
