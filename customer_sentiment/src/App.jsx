import { useEffect, useMemo, useRef, useState } from "react";

const palette = {
  primary: "#6E1F2D",
  primaryHover: "#5A1824",
  secondary: "#8B4A57",
  darkText: "#2E2A28",
  bodyText: "#4A403B",
  mutedText: "#6A5E58",
  pageBg: "#F3EEE8",
  cardBg: "#FBF8F4",
  sectionTint: "#E6D8CE",
  border: "#C9B7AC",
  softHighlight: "#DCC8BE",
  positive: "#22c55e",
  positiveLight: "#dcfce7",
  negative: "#ef4444",
  negativeLight: "#fee2e2",
  neutral: "#9ca3af",
  neutralLight: "#f3f4f6",
  warning: "#B8833F",
  warningLight: "#F6E8D5",
  insight: "#8B4A57",
  insightLight: "#F1E6E9",
};

const tabs = ["Overview", "Negative Insights", "AI Insights", "Customer Loyalty"];

const sentimentDistribution = [
  { name: "Positive", value: 64.2, color: palette.positive },
  { name: "Negative", value: 21.3, color: palette.negative },
  { name: "Neutral",  value: 14.5, color: palette.neutral  },
];
const satisfactionData = [
  { name: "Satisfied",   value: 71.2, color: palette.positive },
  { name: "Unsatisfied", value: 28.8, color: palette.negative },
];
const recommendData = [
  { name: "Will Recommend", value: 72.1, color: palette.positive },
  { name: "Will Not",       value: 27.9, color: palette.neutral  },
];
const negativeDrivers = [
  { label: "Support Delay",        value: 32.0 },
  { label: "Billing / Payment",    value: 21.3 },
  { label: "Product Bugs",         value: 16.7 },
  { label: "Refund Process",       value: 12.4 },
  { label: "App / Website Issues", value:  9.6 },
];
const negativeTrends = [
  { week: "Apr 14", support: 18, billing: 10, bugs:  7, refund:  4, app: 3 },
  { week: "Apr 21", support: 24, billing: 14, bugs: 10, refund:  6, app: 4 },
  { week: "Apr 28", support: 29, billing: 18, bugs: 11, refund:  7, app: 5 },
  { week: "May 5",  support: 32, billing: 20, bugs: 12, refund:  8, app: 6 },
  { week: "May 12", support: 38, billing: 23, bugs: 14, refund: 10, app: 8 },
];
const comments = [
  { name: "Priya", tone: "Negative", comment: "I waited four days for support and still did not get a proper resolution." },
  { name: "Amit",  tone: "Negative", comment: "The app crashes every time I try to upload a receipt during checkout." },
  { name: "Neha",  tone: "Negative", comment: "Refund steps are confusing and the status updates are unclear." },
  { name: "Rohit", tone: "Positive", comment: "The interface is clean and ordering is simple when everything works." },
  { name: "Sara",  tone: "Positive", comment: "Fast delivery and smooth navigation made the experience pleasant." },
];
const userAvatars = {
  Priya: "https://randomuser.me/api/portraits/women/44.jpg",
  Amit: "https://randomuser.me/api/portraits/men/32.jpg",
  Neha: "https://randomuser.me/api/portraits/women/65.jpg",
  Rohit: "https://randomuser.me/api/portraits/men/75.jpg",
  Sara: "https://randomuser.me/api/portraits/women/68.jpg",
};


function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

// ─── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target, duration, decimals = 0) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    let startTs = null;
    function step(ts) {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      setVal(parseFloat((easeInOut(p) * target).toFixed(decimals)));
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setVal(target);
    }
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration, decimals]);
  return val;
}

function useOneShotActivation(active) {
  const [enabled, setEnabled] = useState(active);
  useEffect(() => {
    if (active) setEnabled(true);
  }, [active]);
  return enabled;
}

function useInViewOnce(options = { threshold: 0.4 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options, visible]);

  return [ref, visible];
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 15V10" /><path d="M12 15V7" /><path d="M16 15v-3" />
    </svg>
  );
}

// ─── SectionCard — minimal padding, tight header ───────────────────────────────
function SectionCard({ title, subtitle, children, right, compact = false, className = "", headerCentered = false }) {
  return (
    <section
      style={{ borderColor: palette.border, backgroundColor: palette.cardBg }}
      className={`rounded-[24px] border shadow-[0_10px_30px_rgba(46,42,40,0.08)] transition-transform duration-300 hover:-translate-y-0.5 ${
        compact ? "inline-block w-fit max-w-full min-w-[320px]" : ""
      } ${className}`}
    >
      <div className={`flex gap-2 px-3 pt-3 pb-1.5 ${headerCentered ? "justify-center text-center" : "items-start justify-between"}`}>
        <div className={headerCentered ? "flex flex-col items-center" : ""}>
          <h3 className="text-[13px] font-semibold leading-tight tracking-tight" style={{ color: palette.darkText }}>{title}</h3>
          {subtitle && <p className="text-[11px] leading-4 mt-0.5" style={{ color: palette.mutedText }}>{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="px-3 pb-3">{children}</div>
    </section>
  );
}

// ─── KPI Card// ─── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  title,
  value,
  change,
  accent,
  iconLabel,
  animate = false,
  inlineMetric = false,
  centered = false,
  large = false,
  className = "",
}) {
  const parseMetric = (text) => {
    if (!animate || typeof text !== "string") return null;
    const match = text.match(/^([^\d+-]*)([+-]?\d[\d,]*(?:\.\d+)?)(%?)(.*)$/);
    if (!match) return null;

    const [, prefix, numberText, unit, suffix] = match;
    const target = parseFloat(numberText.replace(/,/g, ""));
    const decimals = numberText.includes(".") ? numberText.split(".")[1].length : 0;
    const hasComma = numberText.includes(",");
    const explicitPlus = numberText.trim().startsWith("+");

    return { prefix, target, decimals, hasComma, explicitPlus, unit, suffix };
  };

  const valueMetric = parseMetric(value);
  const changeMetric = parseMetric(change);

  const countedValue = useCountUp(valueMetric ? valueMetric.target : 0, 2000, valueMetric ? valueMetric.decimals : 0);
  const countedChange = useCountUp(changeMetric ? changeMetric.target : 0, 2000, changeMetric ? changeMetric.decimals : 0);

  const formatMetric = (metric, counted, fallback) => {
    if (!animate || !metric) return fallback;
    const absValue = Math.abs(counted);
    const formatted = metric.hasComma ? Math.round(absValue).toLocaleString() : absValue.toFixed(metric.decimals);
    const sign = metric.explicitPlus ? "+" : counted < 0 ? "-" : "";
    return `${metric.prefix}${sign}${formatted}${metric.unit}${metric.suffix}`;
  };

  const displayValue = formatMetric(valueMetric, countedValue, value);
  const displayChange = formatMetric(changeMetric, countedChange, change);

  return (
    <div
      className={`rounded-[22px] border p-2.5 shadow-[0_10px_28px_rgba(46,42,40,0.08)] transition-transform duration-300 hover:-translate-y-0.5 ${
        centered ? "flex h-[152px] w-full max-w-full items-center justify-center text-center" : inlineMetric ? "w-fit min-w-[230px]" : large ? "flex min-h-[160px] items-center p-4" : ""
      } ${className}`}
      style={{ borderColor: palette.border, backgroundColor: palette.cardBg }}
    >
      <div className={centered ? "flex flex-col items-center justify-center gap-2" : large ? "flex w-full items-center justify-between gap-3" : "flex items-start justify-between gap-2"}>
        <div className={centered ? "flex flex-col items-center" : large ? "min-w-0 text-center" : "min-w-0"}>
          {inlineMetric ? (
            <p className="whitespace-nowrap text-[18px] font-semibold tracking-tight tabular-nums" style={{ color: palette.darkText }}>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">{title}</span>
              <span className="mx-1">-</span>
              <span>{displayValue}</span>
            </p>
          ) : (
            <>
              <p className={`${large ? "text-[10px]" : "text-[9px]"} font-semibold uppercase tracking-[0.14em]`} style={{ color: palette.mutedText }}>{title}</p>
              <p className={`${large ? "mt-1 text-[30px] leading-none" : "mt-0.5 text-xl"} font-semibold tracking-tight tabular-nums`} style={{ color: palette.darkText }}>{displayValue}</p>
            </>
          )}

          <div className={`${large ? "mt-1.5 px-2 py-0.5 text-[10px]" : "mt-1 px-1.5 py-0.5 text-[10px]"} inline-flex items-center rounded-full font-medium tabular-nums`} style={{ backgroundColor: accent.bg, color: accent.text }}>
            {displayChange}
          </div>
        </div>

        <div className={centered ? "flex h-7 w-7 items-center justify-center rounded-lg text-[9px] font-semibold" : large ? "flex h-9 w-9 items-center justify-center rounded-xl text-[10px] font-semibold flex-shrink-0" : "flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-semibold flex-shrink-0"} style={{ backgroundColor: accent.soft, color: accent.text }}>
          {iconLabel}
        </div>
      </div>
    </div>
  );
}

// ─── Donut Chart// ─── Donut Chart — 80px, tight proportions ────────────────────────────────────
function DoughnutChart({
  data,
  centerLabel = "",
  size = 96,
  animate = true,
  holeScale = 0.50,
  centerTextClassName = "text-[7px]",
}) {
  const canvasRef    = useRef(null);
  const animRef      = useRef(null);
  const startTimeRef = useRef(null);
  const TOTAL_MS = 4400;
  const RADIUS   = size * 0.39;
  const THICK    = size * 0.18;
  const CX = size / 2, CY = size / 2;

  function drawFrame(progress) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.07)";
    ctx.lineWidth = THICK;
    ctx.lineCap = "butt";
    ctx.stroke();
    const total = data.reduce((s, d) => s + d.value, 0);
    let filled = 0, angle = -Math.PI / 2;
    for (let i = 0; i < data.length; i++) {
      const frac = data[i].value / total;
      if (progress <= filled) break;
      const sp = Math.min((progress - filled) / frac, 1);
      const end = angle + frac * sp * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(CX, CY, RADIUS, angle, end);
      ctx.strokeStyle = data[i].color;
      ctx.lineWidth = THICK;
      ctx.lineCap = "butt";
      ctx.stroke();
      filled += frac;
      angle = end;
    }
  }

  useEffect(() => {
    startTimeRef.current = null;
    if (!animate) {
      drawFrame(0);
      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        startTimeRef.current = null;
      };
    }
    drawFrame(0);
    const delay = setTimeout(() => {
      function frame(ts) {
        if (!startTimeRef.current) startTimeRef.current = ts;
        const t = Math.min((ts - startTimeRef.current) / TOTAL_MS, 1);
        drawFrame(easeInOut(t));
        if (t < 1) animRef.current = requestAnimationFrame(frame);
        else drawFrame(1);
      }
      animRef.current = requestAnimationFrame(frame);
    }, 300);
    return () => {
      clearTimeout(delay);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      startTimeRef.current = null;
    };
  }, [animate, data, size]);

  const hole = Math.round(size * holeScale);
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} width={size} height={size} style={{ display: "block" }} />
      <div className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border"
        style={{ width: hole, height: hole, transform: "translate(-50%,-50%)",
          backgroundColor: palette.cardBg, borderColor: palette.neutralLight, pointerEvents: "none" }}>
        <span className={`text-center px-1 font-semibold uppercase leading-tight tracking-wide ${centerTextClassName}`}
          style={{ color: palette.mutedText }}>{centerLabel}</span>
      </div>
    </div>
  );
}

// ─── PieLegend — ultra compact ────────────────────────────────────────────────
function PieLegend({ data, compact = false, showValue = true }) {
  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      {data.map((item) => (
        <div key={item.name} className={`flex items-center rounded-lg border px-2 py-1 ${compact ? "w-fit" : "justify-between"}`} style={{ borderColor: palette.neutralLight, backgroundColor: palette.cardBg }}>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] font-medium" style={{ color: palette.bodyText }}>{item.name}-{item.value}%</span>
          </div>
          {!compact && showValue && <span className="ml-2 text-[11px] font-semibold" style={{ color: palette.darkText }}>{item.value}%</span>}
        </div>
      ))}
    </div>
  );
}

// ─── ChartWithLegend// ─── ChartWithLegend — chart and legend side by side, gap-2 ───────────────────
function ChartWithLegend({ title, subtitle, data, centerLabel, compact = false, animate = true, className = "", centered = false, showLegendValue = true }) {
  return (
    <SectionCard title={title} subtitle={subtitle} compact={compact} className={className} headerCentered={centered}>
      <div className={`items-center justify-center gap-2 ${compact ? "inline-flex w-fit max-w-full" : centered ? "flex flex-col text-center" : "flex"}`}>
        <DoughnutChart data={data} centerLabel={centerLabel} size={96} animate={animate} />
        <div className={compact ? "w-fit" : centered ? "min-w-0" : "flex-1 min-w-0"}>
          <PieLegend data={data} compact={compact} showValue={showLegendValue} />
        </div>
      </div>
    </SectionCard>
  );
}

function LoyaltyChartCard({ title, subtitle, data, centerLabel }) {
  return (
    <div className="flex h-[168px] w-full max-w-[290px] flex-col items-center justify-center rounded-[22px] border p-2.5 text-center shadow-[0_10px_28px_rgba(46,42,40,0.08)]" style={{ borderColor: palette.border, backgroundColor: palette.cardBg }}>
      <div className="mb-1">
        <h3 className="text-[13px] font-semibold leading-tight tracking-tight" style={{ color: palette.darkText }}>{title}</h3>
        {subtitle && <p className="mt-0.5 text-[9px] leading-3" style={{ color: palette.mutedText }}>{subtitle}</p>}
      </div>
      <div className="flex items-center justify-center gap-2">
        <DoughnutChart data={data} centerLabel={centerLabel} size={98} holeScale={0.6} centerTextClassName="text-[8px]" />
        <PieLegend data={data} compact />
      </div>
    </div>
  );
}

// ─── Horizontal Bar Chart// ─── Horizontal Bar Chart ─────────────────────────────────────────────────────
function HorizontalBarChart({ data, color, animate = true, durationMs = 500 }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {data.map((item, i) => (
        <div key={item.label} className="rounded-lg border px-2 py-1.5"
          style={{ borderColor: palette.neutralLight, backgroundColor: palette.cardBg }}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold"
                style={{ backgroundColor: palette.neutralLight, color: palette.mutedText }}>{i + 1}</span>
              <span className="text-[11px] font-medium" style={{ color: palette.bodyText }}>{item.label}</span>
            </div>
            <span className="text-[11px] font-semibold" style={{ color: palette.darkText }}>{item.value}%</span>
          </div>
          <div className="h-1 rounded-full" style={{ backgroundColor: palette.neutralLight }}>
            <div className="h-1 rounded-full transition-all"
              style={{ width: animate ? `${(item.value / max) * 100}%` : "0%", backgroundColor: color, transitionDuration: `${durationMs}ms` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Animated Polyline ────────────────────────────────────────────────────────
function AnimatedPolyline({ points, color, delay = 0, animate = true }) {
  const pathRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();

    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.transition = "none";

    if (!animate) {
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      setReady(false);
      return;
    }

    const startTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        path.style.transition = "stroke-dashoffset 4s cubic-bezier(0.22,1,0.36,1)";
        path.style.strokeDashoffset = "0";
        setReady(true);
      });
    }, delay);

    return () => clearTimeout(startTimer);
  }, [animate, points, delay]);

  return (
    <polyline
      ref={pathRef}
      fill="none"
      stroke={color}
      strokeWidth="2"
      points={points}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: animate ? (ready ? 1 : 0.85) : 0.25 }}
    />
  );
}

// ─── Mini Line Chart// ─── Mini Line Chart — compact responsive height ───────────────────────────────
function MiniLineChart({ data, lines, animate = true, height = 100, allowHorizontalScroll = true }) {
  const W = 640, H = height, PX = 20, PT = 8, PB = 18;
  const maxY = Math.max(...data.flatMap((r) => lines.map((l) => r[l.key])), 1);
  const getX = (i) => PX + (i * (W - PX * 2)) / Math.max(data.length - 1, 1);
  const getY = (v) => H - PB - (v / maxY) * (H - PT - PB);
  return (
    <div className={allowHorizontalScroll ? "overflow-x-auto" : "overflow-hidden"}>
      <svg viewBox={`0 0 ${W} ${H}`} className={allowHorizontalScroll ? "w-full min-w-[360px]" : "h-auto w-full min-w-0"} style={{ height }}>
        {[0, 1, 2].map((i) => {
          const y = PT + ((H - PT - PB) / 2) * i;
          return <line key={i} x1={PX} y1={y} x2={W - PX} y2={y}
            stroke={palette.neutralLight} strokeDasharray="3 3" />;
        })}
        {data.map((r, i) => (
          <text key={r.week} x={getX(i)} y={H - 4} textAnchor="middle"
            fontSize="8" fill={palette.mutedText}>{r.week}</text>
        ))}
        {lines.map((line, li) => {
          const pts = data.map((r, i) => `${getX(i)},${getY(r[line.key])}`).join(" ");
          return (
            <g key={line.key}>
              <AnimatedPolyline points={pts} color={line.color} delay={li * 500} animate={animate} />
              {data.map((r, i) => (
                <circle key={i} cx={getX(i)} cy={getY(r[line.key])} r="2.5"
                  fill={line.color} opacity={animate ? "0.9" : "0.25"} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {lines.map((line) => (
          <div key={line.key}
            className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
            style={{ color: palette.bodyText, borderColor: palette.neutralLight, backgroundColor: palette.cardBg }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: line.color }} />
            {line.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function OverviewScene({ active, children }) {
  return (
    <div
      className={`w-full transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-[0.985] opacity-55"
      }`}
    >
      {children}
    </div>
  );
}

function OverviewPage({ activeSection, setActiveSection, onAdvanceTab, onRetreatTab }) {
  const wheelLockedRef = useRef(false);
  const touchStartYRef = useRef(0);
  const totalSections = 3;
  const overviewSentimentVisible = useOneShotActivation(activeSection === 1);
  const overviewLoyaltyVisible = useOneShotActivation(activeSection === 2);

  const moveSection = (direction) => {
    if (wheelLockedRef.current) return;
    wheelLockedRef.current = true;
    setActiveSection((current) => {
      if (direction > 0 && current === totalSections - 1) {
        onAdvanceTab?.();
        return current;
      }
      if (direction < 0 && current === 0) {
        onRetreatTab?.();
        return current;
      }
      return Math.max(0, Math.min(totalSections - 1, current + direction));
    });
    window.setTimeout(() => {
      wheelLockedRef.current = false;
    }, 850);
  };

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) < 18) return;
    event.preventDefault();
    moveSection(event.deltaY > 0 ? 1 : -1);
  };

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = (event) => {
    const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const deltaY = touchStartYRef.current - endY;
    if (Math.abs(deltaY) < 44) return;
    moveSection(deltaY > 0 ? 1 : -1);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        moveSection(1);
      }
      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        moveSection(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      className="relative h-full overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full w-full flex-col will-change-transform transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateY(-${activeSection * 100}%)` }}
      >
        <section className="overview-panel flex h-full min-h-full w-full flex-shrink-0 items-center justify-center px-2 py-6">
          <OverviewScene active={activeSection === 0}>
            <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
              <KpiCard animate large title="Total Feedback" value="12,458" change="+8.4% vs last 7 days" iconLabel="TF"
                accent={{ bg: palette.sectionTint, soft: palette.sectionTint, text: palette.primary }} />
              <KpiCard animate large title="Positive Share" value="64.2%" change="+6.7% vs last 7 days" iconLabel="PS"
                accent={{ bg: palette.positiveLight, soft: palette.positiveLight, text: palette.positive }} />
              <KpiCard animate large title="Negative Share" value="21.3%" change="+2.1% vs last 7 days" iconLabel="NS"
                accent={{ bg: palette.negativeLight, soft: palette.negativeLight, text: palette.negative }} />
              <KpiCard animate large title="Recommendation" value="72.1%" change="+5.3% vs last 7 days" iconLabel="RR"
                accent={{ bg: palette.sectionTint, soft: palette.sectionTint, text: palette.primary }} />
            </div>
          </OverviewScene>
        </section>

        <section className="overview-panel flex h-full min-h-full w-full flex-shrink-0 items-center justify-center px-2 py-6">
          <OverviewScene active={activeSection === 1}>
            <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 lg:grid-cols-2">
              <ChartWithLegend title="Feedback Sentiment Distribution"
                subtitle="Positive, negative, and neutral feedback share."
                data={sentimentDistribution} centerLabel="Sentiment" animate={overviewSentimentVisible} className="min-h-[255px]" centered />
              <SectionCard title="Sentiment Trend" className="h-full" headerCentered>
                <div className="flex h-full items-center justify-center text-center">
                <MiniLineChart data={negativeTrends} lines={[
                  { key: "support", label: "Support Delay",     color: "#6E1F2D" },
                  { key: "billing", label: "Billing / Payment", color: "#B8833F" },
                  { key: "bugs",    label: "Product Bugs",      color: "#8B4A57" },
                ]} animate={overviewSentimentVisible} height={140} />
                </div>
              </SectionCard>
            </div>
          </OverviewScene>
        </section>

        <section className="overview-panel flex h-full min-h-full w-full flex-shrink-0 items-center justify-center px-2 py-6">
          <OverviewScene active={activeSection === 2}>
            <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 lg:grid-cols-2">
              <ChartWithLegend title="Customer Satisfaction Overview"
                subtitle="How many users are satisfied versus unsatisfied."
                data={satisfactionData} centerLabel="Satisfaction" animate={overviewLoyaltyVisible} className="min-h-[255px]" centered showLegendValue={false} />
              <ChartWithLegend title="Recommendation Intent Analysis"
                subtitle="How many people would recommend the service to others."
                data={recommendData} centerLabel="Recommend" animate={overviewLoyaltyVisible} className="min-h-[255px]" centered showLegendValue={false} />
            </div>
          </OverviewScene>
        </section>
      </div>
    </div>
  );
}

function NegativeInsightsPage({ onAdvanceTab, onRetreatTab }) {
  const [query, setQuery] = useState("");
  const [pageRef, pageVisible] = useInViewOnce();
  const [chartSectionRef, chartsVisible] = useInViewOnce();
  const [alertVisible, setAlertVisible] = useState(false);
  const touchStartYRef = useRef(0);
  const filtered = useMemo(() => {
    if (!query.trim()) return negativeDrivers;
    return negativeDrivers.filter((d) => d.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  useEffect(() => {
    if (!pageVisible) return;
    const showTimer = setTimeout(() => setAlertVisible(true), 180);
    const hideTimer = setTimeout(() => setAlertVisible(false), 4180);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [pageVisible]);

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) <= 18) return;
    event.preventDefault();
    if (event.deltaY > 0) onAdvanceTab?.();
    else onRetreatTab?.();
  };

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = (event) => {
    const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const deltaY = touchStartYRef.current - endY;
    if (Math.abs(deltaY) <= 44) return;
    if (deltaY > 0) onAdvanceTab?.();
    else onRetreatTab?.();
  };

  return (
    <div ref={pageRef} className="relative space-y-3 overflow-x-hidden" onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className={`flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between transition-all duration-700 ${pageVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
        <h2 className="text-xl font-semibold tracking-tight" style={{ color: palette.darkText }}>Negative Feedback Analysis</h2>
        <div className="relative w-full lg:w-[320px] lg:flex-shrink-0">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: palette.mutedText }}>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for refund, support, payment, bug..."
            className="w-full rounded-lg border py-1.5 pl-7 pr-2.5 text-xs outline-none transition-shadow duration-300"
            style={{ borderColor: palette.border, color: palette.darkText, backgroundColor: palette.cardBg }}
          />
        </div>
      </div>

      <div
        className={`pointer-events-none absolute right-0 top-0 z-20 w-fit max-w-[min(260px,calc(100%-1rem))] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          alertVisible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
        }`}
      >
        <div
          className="alert-glow rounded-xl border px-3 py-2.5"
          style={{ borderColor: palette.negative, backgroundColor: palette.cardBg }}
        >
          <div className="flex items-start gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[9px] font-semibold flex-shrink-0"
              style={{ backgroundColor: palette.negativeLight, color: palette.negative }}
            >
              AL
            </div>

            <div className="min-w-0">
              <h3 className="text-[12px] font-semibold leading-tight" style={{ color: palette.darkText }}>
                Early Warning Alert
              </h3>
              <p className="mt-0.5 text-[10px] leading-3.5" style={{ color: palette.bodyText }}>
                Support delay worsening. Mentions up 32% vs last 7 days.
              </p>

              <div
                className="mt-2 inline-flex items-center rounded-lg border px-2 py-1"
                style={{ borderColor: palette.negativeLight, backgroundColor: palette.negativeLight }}
              >
                <span className="text-sm font-semibold" style={{ color: palette.negative }}>32%</span>
                <span className="ml-1.5 text-[9px] font-medium uppercase tracking-wide" style={{ color: palette.negative }}>
                  Rise
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={chartSectionRef} className={`mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 lg:grid-cols-2 transition-all duration-700 ${pageVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        <SectionCard title="Top 5 Negative Feedback Drivers" subtitle="Most frequent negative feedback themes." className="min-h-[250px]">
          <HorizontalBarChart data={filtered} color={palette.primary} animate={chartsVisible} durationMs={1000} />
          </SectionCard>

        <SectionCard title="Top 5 Negative Feedback Trends" className="min-h-[280px]" headerCentered>
          <div className="flex h-full items-center justify-center text-center">
          <MiniLineChart data={negativeTrends} lines={[
            { key: "support", label: "Support Delay",     color: palette.primary   },
            { key: "billing", label: "Billing / Payment", color: palette.warning   },
            { key: "bugs",    label: "Product Bugs",      color: palette.secondary },
            { key: "refund",  label: "Refund",            color: palette.insight   },
            { key: "app",     label: "App Issues",        color: palette.neutral   },
          ]} animate={chartsVisible} allowHorizontalScroll={false} height={140} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function AIInsightsPage({ onAdvanceTab, onRetreatTab }) {
  const touchStartYRef = useRef(0);

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) <= 18) return;
    event.preventDefault();
    if (event.deltaY > 0) onAdvanceTab?.();
    else onRetreatTab?.();
  };

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = (event) => {
    const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const deltaY = touchStartYRef.current - endY;
    if (Math.abs(deltaY) <= 44) return;
    if (deltaY > 0) onAdvanceTab?.();
    else onRetreatTab?.();
  };

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden" onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="shrink-0">
        <h2 className="text-[17px] font-semibold tracking-tight" style={{ color: palette.darkText }}>AI Insights from User Comments</h2>
      </div>

      <div className="mx-auto grid min-h-0 w-full max-w-5xl flex-1 grid-cols-1 gap-1.5 lg:grid-cols-[1.08fr_0.92fr]">
        <SectionCard title="Top User Comments" subtitle="Four representative comments surfaced for the user." className="h-full">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {comments.slice(0, 4).map((item, i) => (
              <div key={i}
                className="flex items-start justify-between gap-2 rounded-lg border px-2 py-1.5"
                style={{ borderColor: palette.neutralLight, backgroundColor: palette.cardBg }}>
                <div className="flex items-start gap-2">
                  <img
                    src={userAvatars[item.name]}
                    alt={`${item.name} avatar`}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                    style={{ border: `2px solid ${item.tone === "Negative" ? palette.negativeLight : palette.positiveLight}` }}
                  />
                  <div>
                    <p className="text-[11px] font-semibold leading-tight" style={{ color: palette.darkText }}>{item.name}</p>
                    <p className="text-[10px] leading-3.5 mt-0.5" style={{ color: palette.bodyText }}>{item.comment}</p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                  style={{ backgroundColor: item.tone === "Negative" ? palette.negativeLight : palette.positiveLight, color: item.tone === "Negative" ? palette.negative : palette.positive }}>
                  {item.tone}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="AI Summary of User Problems" subtitle="A concise summary of what users are facing and how to improve it." className="h-full self-start">
          <div className="grid h-full content-start gap-1.5">
            <div className="rounded-xl border p-2" style={{ backgroundColor: palette.insightLight, borderColor: palette.border }}>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg text-[9px] font-semibold flex-shrink-0"
                  style={{ backgroundColor: palette.softHighlight, color: palette.insight }}>AI</div>
                <div>
                  <p className="text-[11px] font-semibold leading-tight" style={{ color: palette.darkText }}>Concise AI Insight</p>
                  <p className="text-[9px] leading-3" style={{ color: palette.bodyText }}>What the users' problem looks like at a glance.</p>
                </div>
              </div>
              <p className="text-[10px] leading-3.5" style={{ color: palette.bodyText }}>
                Users are mainly frustrated by slow support response time, payment-related issues, refund confusion, and app instability. Negative sentiment is concentrated around post-purchase support and checkout reliability.
              </p>
            </div>
            <div className="rounded-xl border p-2" style={{ backgroundColor: palette.sectionTint, borderColor: palette.border }}>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: palette.mutedText }}>Primary Issue Impact</p>
              <p className="mt-1 text-[22px] font-semibold" style={{ color: palette.primary }}>High</p>
              <p className="mt-1 text-[10px] leading-3.5" style={{ color: palette.bodyText }}>
                Based on rising negative volume and consistency across support and billing themes.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="How to Improve" subtitle="Suggested actions for quick decision-making." className="mt-1 shrink-0">
        <div className="grid gap-1 md:grid-cols-2">
          {[
            "Reduce support response time during peak hours.",
            "Improve payment success handling and clearer failure messages.",
            "Simplify refund steps and show better refund status updates.",
            "Prioritize bug fixes for app crashes during checkout and uploads.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-1.5 rounded-lg border px-2 py-1"
              style={{ borderColor: palette.neutralLight, backgroundColor: palette.cardBg }}>
              <div className="mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-semibold flex-shrink-0"
                style={{ backgroundColor: palette.softHighlight, color: palette.primary }}>✓</div>
              <p className="text-[9px] leading-3" style={{ color: palette.bodyText }}>{item}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function LoyaltyPage({ onRetreatTab }) {
  const touchStartYRef = useRef(0);

  const handleWheel = (event) => {
    if (event.deltaY >= -18) return;
    event.preventDefault();
    onRetreatTab?.();
  };

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = (event) => {
    const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const deltaY = touchStartYRef.current - endY;
    if (deltaY >= -44) return;
    onRetreatTab?.();
  };

  return (
    <div className="space-y-3" onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div>
        <h2 className="text-xl font-semibold tracking-tight" style={{ color: palette.darkText }}>Customer Satisfaction & Loyalty</h2>
        <p className="text-[11px] leading-4 mt-0.5" style={{ color: palette.mutedText }}>Satisfaction rate, recommendation intent, and a simple loyalty insight.</p>
      </div>

      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 place-items-center gap-2.5 md:grid-cols-2">
          <LoyaltyChartCard title="Satisfied vs Unsatisfied Users" subtitle="How many users are satisfied or not." data={satisfactionData} centerLabel="Satisfied" />
          <LoyaltyChartCard title="Users Willing to Recommend" subtitle="How many people will recommend the service." data={recommendData} centerLabel="Recommend" />
          <KpiCard animate inlineMetric centered className="max-w-[290px]" title="Satisfaction Rate" value="71.2%" change="+6.5% vs last 7 days" iconLabel="SR" accent={{ bg: palette.sectionTint, soft: palette.sectionTint, text: palette.primary }} />
          <KpiCard animate inlineMetric centered className="max-w-[290px]" title="Net Promoter Score" value="+34" change="+7 points vs last 7 days" iconLabel="NP" accent={{ bg: palette.softHighlight, soft: palette.softHighlight, text: palette.primary }} />
      </div>
    </div>
  );
}

// ─── Root// ─── Root ─────────────────────────────────────────────────────────────────────
export default function SentimentDashboardVertical() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [overviewSection, setOverviewSection] = useState(0);
  const tabOrder = ["Overview", "Negative Insights", "AI Insights", "Customer Loyalty"];
  const tabNavigationLockedRef = useRef(false);

  const withTabNavigationLock = (fn) => {
    if (tabNavigationLockedRef.current) return false;
    tabNavigationLockedRef.current = true;
    fn();
    window.setTimeout(() => {
      tabNavigationLockedRef.current = false;
    }, 950);
    return true;
  };

  const advanceToNextTab = (tab) => {
    const index = tabOrder.indexOf(tab);
    if (index === -1 || index === tabOrder.length - 1) return false;
    return withTabNavigationLock(() => {
      setActiveTab(tabOrder[index + 1]);
    });
  };

  const retreatToPreviousTab = (tab) => {
    const index = tabOrder.indexOf(tab);
    if (index === -1 || index === 0) return false;
    return withTabNavigationLock(() => {
      const previousTab = tabOrder[index - 1];
      if (previousTab === "Overview") {
        setOverviewSection(2);
      }
      setActiveTab(previousTab);
    });
  };

  const dashboardAnimations = `
    @keyframes alertPulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.42), 0 0 12px rgba(239, 68, 68, 0.28); }
      55% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0), 0 0 22px rgba(239, 68, 68, 0.34); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0), 0 0 12px rgba(239, 68, 68, 0.28); }
    }
    @keyframes alertWave {
      0% { transform: scale(0.94); opacity: 0.4; }
      70% { transform: scale(1.12); opacity: 0; }
      100% { transform: scale(1.12); opacity: 0; }
    }
    .alert-glow { position: relative; overflow: visible; animation: alertPulse 1.9s ease-out infinite; z-index: 0; }
    .alert-glow::before { content: ""; position: absolute; inset: -8px; border-radius: 18px; border: 1px solid rgba(239, 68, 68, 0.45); background: rgba(239, 68, 68, 0.08); z-index: -1; animation: alertWave 1.9s ease-out infinite; }
    .overview-panel {
      contain: layout paint;
    }
  `;


  return (
    <>
      <style>{dashboardAnimations}</style>
    <div className="h-screen w-full overflow-hidden px-4 py-4 md:px-6" style={{ backgroundColor: palette.pageBg }}>
      <div className="relative mx-auto flex h-full max-w-5xl flex-col gap-3">
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(110,31,45,0.08)" }} />
        <div className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(139,74,87,0.08)" }} />

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border p-3 shadow-[0_8px_24px_rgba(46,42,40,0.08)]"
          style={{ borderColor: palette.border, backgroundColor: palette.cardBg }}>
          <div className="absolute inset-x-0 top-0 h-0.5"
            style={{ background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})` }} />

          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: palette.primary }}>
                <DashboardIcon />
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: palette.primary }}>Customer Analytics</p>
                <h1 className="text-[20px] font-semibold tracking-tight leading-tight" style={{ color: palette.darkText }}>Sentiment Analysis Dashboard</h1>
              </div>
            </div>
            <div className="rounded-xl border px-2.5 py-1.5 flex-shrink-0"
              style={{ borderColor: palette.border, backgroundColor: palette.sectionTint }}>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: palette.mutedText }}>Reporting Period</p>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: palette.darkText }}>May 12 – May 18, 2026</p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5 border-t pt-2" style={{ borderColor: palette.border }}>
            {tabs.map((tab) => {
              const active = tab === activeTab;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: active ? palette.primary : "transparent",
                    color: active ? "#FFFFFF" : palette.bodyText,
                    border: active ? `1px solid ${palette.primary}` : `1px solid ${palette.border}`,
                  }}>
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className={`relative min-h-0 flex-1 ${activeTab === "Overview" ? "" : "overflow-y-auto pr-1"}`}>
          {activeTab === "Overview"          && <OverviewPage activeSection={overviewSection} setActiveSection={setOverviewSection} onAdvanceTab={() => advanceToNextTab("Overview")} onRetreatTab={() => retreatToPreviousTab("Overview")} />}
          {activeTab === "Negative Insights" && <NegativeInsightsPage onAdvanceTab={() => advanceToNextTab("Negative Insights")} onRetreatTab={() => retreatToPreviousTab("Negative Insights")} />}
          {activeTab === "AI Insights"       && <AIInsightsPage onAdvanceTab={() => advanceToNextTab("AI Insights")} onRetreatTab={() => retreatToPreviousTab("AI Insights")} />}
          {activeTab === "Customer Loyalty"  && <LoyaltyPage onRetreatTab={() => retreatToPreviousTab("Customer Loyalty")} />}
        </div>
      </div>
      </div>
    </>
  );
}
