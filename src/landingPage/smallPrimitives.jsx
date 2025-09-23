import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

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