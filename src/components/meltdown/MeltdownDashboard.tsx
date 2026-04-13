"use client"

import { useState, useMemo } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from "recharts"
import { X, ArrowUpDown, TrendingDown, DollarSign, Percent, AlertTriangle, Flame, Users, Clock, Zap, ChevronDown } from "lucide-react"
import { companies } from "@/lib/data"
import {
  computeMetrics,
  formatBillions,
  formatMillions,
  formatPct,
  formatK,
  colorForPct,
  colorForSBCPct,
  bgForSBCPct,
  CompanyWithMetrics,
} from "@/lib/utils"

type SortKey = keyof CompanyWithMetrics
type SortDir = "asc" | "desc"
type ViewTab = "table" | "scatter" | "bar"

export default function MeltdownDashboard() {
  const data = useMemo(() => companies.map(computeMetrics), [])

  const [sortKey, setSortKey] = useState<SortKey>("pctYTD")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [filter, setFilter] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithMetrics | null>(null)
  const [activeTab, setActiveTab] = useState<ViewTab>("table")

  const filtered = useMemo(() => {
    let result = [...data]
    if (filter) {
      const q = filter.toLowerCase()
      result = result.filter(
        (c) => c.ticker.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
      )
    }
    result.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return result
  }, [data, filter, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "company" || key === "ticker" ? "asc" : "desc")
    }
  }

  // KPI aggregates
  const totalValueDestroyed = data.reduce((s, c) => s + c.valueDestroyedB, 0)
  const totalSBC = data.reduce((s, c) => s + c.sbcAnnualM, 0)
  const avgSBCPct = data.reduce((s, c) => s + c.sbcPctRevenue, 0) / data.length
  const worstOffender = data.reduce((worst, c) =>
    c.sbcPctRevenue > worst.sbcPctRevenue ? c : worst
  )

  // Fun fact computations
  const totalEmployees = data.reduce((s, c) => s + c.employees, 0)
  const sbcPerDay = (totalSBC * 1_000_000) / 365
  const companiesOver20Pct = data.filter((c) => c.sbcPctRevenue > 20).length
  const highestSBCPerEmp = data.reduce((best, c) =>
    c.sbcPerEmployeeK > best.sbcPerEmployeeK ? c : best
  )
  const totalSBCValueLost = data.reduce((s, c) => s + c.sbcValueLostM, 0)
  const medianYTD = [...data].sort((a, b) => a.pctYTD - b.pctYTD)[Math.floor(data.length / 2)]

  const [showMethodology, setShowMethodology] = useState(false)

  return (
    <div className="min-h-screen bg-base">
      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden border-b border-border">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-8 sm:pb-12">
          {/* Top tag */}
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 mb-6">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-medium text-red-400 tracking-wide uppercase">
              Value Destruction Tracker
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] max-w-3xl">
            Software{" "}
            <span className="relative">
              <span className="text-red-400">Meltdown</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 4 Q75 8 150 4 Q225 0 300 4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-muted mt-4 max-w-2xl leading-relaxed">
            <span className="text-text-primary font-semibold">{formatBillions(totalValueDestroyed)}</span>{" "}
            in shareholder value vaporized across 35 public software companies — while they paid out{" "}
            <span className="text-accent font-semibold">{formatMillions(totalSBC)}</span> in annual stock-based compensation.
          </p>

          <p className="text-sm text-text-muted mt-3 max-w-xl">
            Tracking the gap between what software companies pay employees in stock and what shareholders actually receive. SBC dilutes ownership. When stocks crater, so does the value of that compensation — but the dilution remains.
          </p>

          {/* Scroll indicator */}
          <div className="mt-8 flex items-center gap-2 text-text-muted text-xs">
            <ChevronDown className="w-4 h-4 animate-bounce" />
            <span>Scroll to explore the data</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* ═══ FUN FACTS ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <FunFact
            icon={<Clock className="w-4 h-4" />}
            stat={`$${(sbcPerDay / 1_000_000).toFixed(1)}M`}
            label="in SBC issued per day"
            sublabel="across these 35 companies"
            color="text-accent"
          />
          <FunFact
            icon={<Flame className="w-4 h-4" />}
            stat={`${companiesOver20Pct}`}
            label="companies spend >20% of revenue on SBC"
            sublabel={`out of 35 tracked (${((companiesOver20Pct / 35) * 100).toFixed(0)}%)`}
            color="text-orange-400"
          />
          <FunFact
            icon={<Users className="w-4 h-4" />}
            stat={formatK(highestSBCPerEmp.sbcPerEmployeeK)}
            label={`per employee at ${highestSBCPerEmp.company}`}
            sublabel="highest SBC per headcount"
            color="text-yellow-400"
          />
          <FunFact
            icon={<TrendingDown className="w-4 h-4" />}
            stat={formatPct(medianYTD.pctYTD)}
            label="median YTD stock decline"
            sublabel={`median company: ${medianYTD.company}`}
            color="text-red-400"
          />
          <FunFact
            icon={<Zap className="w-4 h-4" />}
            stat={formatMillions(totalSBCValueLost)}
            label="in SBC value evaporated"
            sublabel="6-month comp wiped by stock drops"
            color="text-red-400"
          />
          <FunFact
            icon={<Users className="w-4 h-4" />}
            stat={`${(totalEmployees / 1000).toFixed(0)}K`}
            label="employees across all 35 companies"
            sublabel={`avg SBC: ${formatK(totalSBC * 1000 / totalEmployees)} per person`}
            color="text-accent"
          />
        </div>

        {/* ═══ METHODOLOGY ═══ */}
        <div className="bg-surface border border-border rounded-lg">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-accent" />
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary">
                  What is SBC & why does it matter?
                </span>
                <span className="text-xs text-text-muted block mt-0.5">
                  Methodology, definitions, and why shareholders should care
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showMethodology ? "rotate-180" : ""}`} />
          </button>
          {showMethodology && (
            <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <ExplainerCard
                  title="Stock-Based Compensation (SBC)"
                  body="Companies pay employees with stock options and RSUs instead of cash. This dilutes existing shareholders — creating new shares and shrinking everyone else's ownership. SBC is a real cost that reduces earnings but is often excluded from 'adjusted' metrics."
                />
                <ExplainerCard
                  title="Value Destroyed"
                  body="Estimated by comparing the current market cap to the peak market cap implied by the 52-week high. This represents the maximum shareholder wealth that has evaporated during the downturn — real money that investors lost."
                />
                <ExplainerCard
                  title="SBC Value Lost"
                  body="When a company's stock drops, the SBC issued in the prior 6 months loses value too. Employees received shares that are now worth significantly less, but the dilution to shareholders still happened. The company 'spent' full price, shareholders got discounted returns."
                />
                <ExplainerCard
                  title="Why SBC % Revenue Matters"
                  body="A company paying 40% of its revenue in SBC is giving away almost half its top line to employees as stock. At single-digit percentages it's normal comp. Above 20%, shareholders are funding a transfer of wealth that may never be recouped."
                />
              </div>
            </div>
          )}
        </div>

        {/* ═══ STAT BAR ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Value Destroyed"
            value={formatBillions(totalValueDestroyed)}
            icon={<TrendingDown className="w-4 h-4" />}
            color="text-red-400"
          />
          <StatCard
            label="Total Annual SBC"
            value={formatMillions(totalSBC)}
            icon={<DollarSign className="w-4 h-4" />}
            color="text-accent"
          />
          <StatCard
            label="Avg SBC % Revenue"
            value={`${avgSBCPct.toFixed(1)}%`}
            icon={<Percent className="w-4 h-4" />}
            color="text-orange-400"
          />
          <StatCard
            label="Worst Offender"
            value={`${worstOffender.ticker} (${worstOffender.sbcPctRevenue}%)`}
            icon={<AlertTriangle className="w-4 h-4" />}
            color="text-red-400"
          />
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 border-b border-border pb-0">
          {(["table", "scatter", "bar"] as ViewTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-[1px] ${
                activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              {tab === "scatter" ? "Scatter Plot" : tab === "bar" ? "Bar Chart" : "Table"}
            </button>
          ))}

          {activeTab === "table" && (
            <div className="ml-auto">
              <input
                type="text"
                placeholder="Filter by ticker or name..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-surface border border-border rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent w-56"
              />
            </div>
          )}
        </div>

        {/* Views */}
        {activeTab === "table" && (
          <SBCTable
            data={filtered}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={toggleSort}
            onSelect={setSelectedCompany}
          />
        )}
        {activeTab === "scatter" && <SBCScatterPlot data={data} onSelect={setSelectedCompany} />}
        {activeTab === "bar" && <SBCBarChart data={data} onSelect={setSelectedCompany} />}
      </main>

      {/* Drawer */}
      {selectedCompany && (
        <CompanyDrawer company={selectedCompany} onClose={() => setSelectedCompany(null)} />
      )}

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-8 py-6 mt-8">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs">
            Data as of April 9, 2026 · SBC from latest annual filings
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <a
              href="https://x.com/Trace_Cohen"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Twitter
            </a>
            <a
              href="mailto:t@nyvp.com"
              className="hover:text-accent transition-colors"
            >
              t@nyvp.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ─── Stat Card ─── */
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className={`flex items-center gap-2 text-xs font-medium ${color} mb-2`}>
        {icon}
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-text-primary font-mono">{value}</div>
    </div>
  )
}

/* ─── Table ─── */
function SBCTable({
  data,
  sortKey,
  sortDir,
  onSort,
  onSelect,
}: {
  data: CompanyWithMetrics[]
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  onSelect: (c: CompanyWithMetrics) => void
}) {
  const cols: { key: SortKey; label: string; align?: string }[] = [
    { key: "ticker", label: "Ticker" },
    { key: "company", label: "Company" },
    { key: "marketCapB", label: "Mkt Cap", align: "right" },
    { key: "pctYTD", label: "YTD %", align: "right" },
    { key: "delta52w", label: "52w Δ", align: "right" },
    { key: "valueDestroyedB", label: "Value Lost", align: "right" },
    { key: "sbcAnnualM", label: "SBC/Yr", align: "right" },
    { key: "sbcPctRevenue", label: "SBC % Rev", align: "right" },
    { key: "sbcSixMonthM", label: "SBC 6mo", align: "right" },
    { key: "sbcValueLostM", label: "SBC Val Lost", align: "right" },
    { key: "employees", label: "Employees", align: "right" },
  ]

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface">
            {cols.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 font-medium text-text-muted whitespace-nowrap cursor-pointer hover:text-text-primary transition-colors select-none ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
                onClick={() => onSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && (
                    <ArrowUpDown className="w-3 h-3 text-accent" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr
              key={c.ticker}
              onClick={() => onSelect(c)}
              className="border-t border-border hover:bg-surface/60 cursor-pointer transition-colors"
            >
              <td className="px-3 py-2.5 font-mono font-semibold text-accent">{c.ticker}</td>
              <td className="px-3 py-2.5 text-text-primary whitespace-nowrap">{c.company}</td>
              <td className="px-3 py-2.5 text-right text-text-primary font-mono">
                {formatBillions(c.marketCapB)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono" style={{ color: colorForPct(c.pctYTD) }}>
                {formatPct(c.pctYTD)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono" style={{ color: colorForPct(c.delta52w) }}>
                {formatPct(c.delta52w)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-red-400">
                {formatBillions(c.valueDestroyedB)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-text-primary">
                {formatMillions(c.sbcAnnualM)}
              </td>
              <td className="px-3 py-2.5 text-right">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium font-mono ${bgForSBCPct(c.sbcPctRevenue)}`}>
                  {c.sbcPctRevenue.toFixed(1)}%
                </span>
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-text-muted">
                {formatMillions(c.sbcSixMonthM)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-red-400">
                {formatMillions(c.sbcValueLostM)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-text-muted">
                {c.employees.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Scatter Plot ─── */
function SBCScatterPlot({
  data,
  onSelect,
}: {
  data: CompanyWithMetrics[]
  onSelect: (c: CompanyWithMetrics) => void
}) {
  const scatterData = data.map((c) => ({
    x: c.sbcPctRevenue,
    y: c.valueDestroyedB,
    z: c.marketCapB,
    fill: colorForPct(c.pctYTD),
    ticker: c.ticker,
    _company: c,
  }))

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      <h3 className="text-sm font-medium text-text-muted mb-4">
        SBC % Revenue vs Value Destroyed — dot size = market cap, color = YTD %
      </h3>
      <ResponsiveContainer width="100%" height={480}>
        <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="x"
            type="number"
            name="SBC % Rev"
            unit="%"
            tick={{ fill: "#64748b", fontSize: 12 }}
            label={{ value: "SBC % Revenue", position: "bottom", fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            dataKey="y"
            type="number"
            name="Value Destroyed"
            tick={{ fill: "#64748b", fontSize: 12 }}
            label={{
              value: "Value Destroyed ($B)",
              angle: -90,
              position: "insideLeft",
              fill: "#64748b",
              fontSize: 12,
            }}
          />
          <RechartsTooltip
            cursor={{ strokeDasharray: "3 3", stroke: "#38bdf8" }}
            content={({ payload }) => {
              if (!payload?.[0]) return null
              const d = payload[0].payload
              return (
                <div className="bg-surface border border-border rounded px-3 py-2 text-xs">
                  <div className="font-mono font-bold text-accent">{d.ticker}</div>
                  <div className="text-text-muted">SBC % Rev: {d.x.toFixed(1)}%</div>
                  <div className="text-text-muted">Value Lost: {formatBillions(d.y)}</div>
                  <div className="text-text-muted">Mkt Cap: {formatBillions(d.z)}</div>
                </div>
              )
            }}
          />
          <Scatter
            data={scatterData}
            onClick={(entry: any) => {
              if (entry?._company) onSelect(entry._company)
            }}
            cursor="pointer"
          >
            {scatterData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.fill}
                fillOpacity={0.8}
                r={Math.max(6, Math.min(24, Math.sqrt(entry.z) * 2))}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Bar Chart ─── */
function SBCBarChart({
  data,
  onSelect,
}: {
  data: CompanyWithMetrics[]
  onSelect: (c: CompanyWithMetrics) => void
}) {
  const top15 = [...data]
    .sort((a, b) => b.sbcAnnualM - a.sbcAnnualM)
    .slice(0, 15)
    .map((c) => ({
      ticker: c.ticker,
      sbcAnnualM: c.sbcAnnualM,
      fill: colorForSBCPct(c.sbcPctRevenue),
      _company: c,
    }))

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      <h3 className="text-sm font-medium text-text-muted mb-4">
        Top 15 by Annual SBC ($M) — colored by SBC % Revenue
      </h3>
      <ResponsiveContainer width="100%" height={520}>
        <BarChart data={top15} layout="vertical" margin={{ top: 5, right: 60, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}B` : `${v}M`}`}
          />
          <YAxis
            dataKey="ticker"
            type="category"
            tick={{ fill: "#f1f5f9", fontSize: 12, fontFamily: "var(--font-mono)" }}
            width={55}
          />
          <RechartsTooltip
            cursor={{ fill: "rgba(56, 189, 248, 0.05)" }}
            content={({ payload }) => {
              if (!payload?.[0]) return null
              const d = payload[0].payload
              return (
                <div className="bg-surface border border-border rounded px-3 py-2 text-xs">
                  <div className="font-mono font-bold text-accent">{d.ticker}</div>
                  <div className="text-text-muted">Annual SBC: {formatMillions(d.sbcAnnualM)}</div>
                </div>
              )
            }}
          />
          <Bar
            dataKey="sbcAnnualM"
            radius={[0, 4, 4, 0]}
            cursor="pointer"
            onClick={(entry: any) => {
              if (entry?._company) onSelect(entry._company)
            }}
          >
            {top15.map((entry, i) => (
              <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="sbcAnnualM"
              position="right"
              formatter={(v) => formatMillions(Number(v))}
              style={{ fill: "#94a3b8", fontSize: 11, fontFamily: "var(--font-mono)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Company Drawer ─── */
function CompanyDrawer({
  company: c,
  onClose,
}: {
  company: CompanyWithMetrics
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-base border-l border-border z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-mono text-accent">{c.ticker}</div>
              <h2 className="text-xl font-bold text-text-primary">{c.company}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price & Performance */}
          <Section title="Price & Performance">
            <MetricRow label="Price" value={`$${c.price.toFixed(2)}`} />
            <MetricRow label="YTD Change" value={formatPct(c.pctYTD)} color={colorForPct(c.pctYTD)} />
            <MetricRow label="52-Week Change" value={formatPct(c.delta52w)} color={colorForPct(c.delta52w)} />
            <MetricRow label="Market Cap" value={formatBillions(c.marketCapB)} />
            <MetricRow label="Peak Market Cap (est.)" value={formatBillions(c.peakMcapB)} />
            <MetricRow label="Value Destroyed" value={formatBillions(c.valueDestroyedB)} color="#ef4444" />
          </Section>

          {/* SBC */}
          <Section title="Stock-Based Compensation">
            <MetricRow label="Annual SBC" value={formatMillions(c.sbcAnnualM)} />
            <MetricRow label="SBC % Revenue" value={`${c.sbcPctRevenue.toFixed(1)}%`} color={colorForSBCPct(c.sbcPctRevenue)} />
            <MetricRow label="SBC (6-Month)" value={formatMillions(c.sbcSixMonthM)} />
            <MetricRow label="SBC Value Lost" value={formatMillions(c.sbcValueLostM)} color="#ef4444" />
          </Section>

          {/* Revenue */}
          <Section title="Revenue & Headcount">
            <MetricRow label="Annual Revenue" value={formatMillions(c.revenueM)} />
            <MetricRow label="Employees" value={c.employees.toLocaleString()} />
          </Section>

          {/* Per Employee */}
          <Section title="Per-Employee Metrics">
            <MetricRow label="SBC per Employee" value={formatK(c.sbcPerEmployeeK)} />
            <MetricRow label="SBC Value Lost per Employee" value={formatK(c.sbcValueLostPerEmployeeK)} color="#ef4444" />
          </Section>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">{title}</h3>
      <div className="bg-surface border border-border rounded-lg divide-y divide-border">
        {children}
      </div>
    </div>
  )
}

function MetricRow({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm font-mono font-medium" style={color ? { color } : { color: "#f1f5f9" }}>
        {value}
      </span>
    </div>
  )
}

/* ─── Fun Fact Card ─── */
function FunFact({
  icon,
  stat,
  label,
  sublabel,
  color,
}: {
  icon: React.ReactNode
  stat: string
  label: string
  sublabel: string
  color: string
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:border-border/80 transition-colors">
      <div className={`flex items-center gap-2 ${color} mb-2`}>
        {icon}
      </div>
      <div className={`text-2xl sm:text-3xl font-bold font-mono ${color}`}>{stat}</div>
      <div className="text-sm text-text-primary mt-1 leading-snug">{label}</div>
      <div className="text-xs text-text-muted mt-0.5">{sublabel}</div>
    </div>
  )
}

/* ─── Explainer Card ─── */
function ExplainerCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-base border border-border rounded-lg p-4">
      <h4 className="text-sm font-semibold text-text-primary mb-2">{title}</h4>
      <p className="text-xs text-text-muted leading-relaxed">{body}</p>
    </div>
  )
}
