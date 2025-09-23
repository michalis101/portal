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