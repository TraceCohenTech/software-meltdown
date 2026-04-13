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
  ReferenceLine,
} from "recharts"
import {
  X,
  ArrowUpDown,
  TrendingDown,
  DollarSign,
  Percent,
  AlertTriangle,
  Flame,
  Users,
  Clock,
  Zap,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  Timer,
  Coins,
} from "lucide-react"
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

const GRID_STROKE = "#e2e8f0"
const AXIS_FILL = "#64748b"
const TEXT_DARK = "#0f172a"

export default function MeltdownDashboard() {
  const data = useMemo(() => companies.map(computeMetrics), [])

  const [sortKey, setSortKey] = useState<SortKey>("pctYTD")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [filter, setFilter] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithMetrics | null>(null)
  const [activeTab, setActiveTab] = useState<ViewTab>("table")
  const [showMethodology, setShowMethodology] = useState(false)

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
  const sbcPerSecond = sbcPerDay / 86400
  const companiesOver20Pct = data.filter((c) => c.sbcPctRevenue > 20).length
  const highestSBCPerEmp = data.reduce((best, c) =>
    c.sbcPerEmployeeK > best.sbcPerEmployeeK ? c : best
  )
  const totalSBCValueLost = data.reduce((s, c) => s + c.sbcValueLostM, 0)
  const sortedByYTD = [...data].sort((a, b) => a.pctYTD - b.pctYTD)
  const medianYTD = sortedByYTD[Math.floor(data.length / 2)]
  const worstStock = sortedByYTD[0]
  const downCount = data.filter((c) => c.pctYTD < 0).length

  return (
    <div className="min-h-screen bg-base text-text-primary">
      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden bg-surface border-b border-border">
        <div className="absolute inset-0 hero-grid pointer-events-none" />
        <div className="absolute -top-32 left-1/3 w-[620px] h-[620px] bg-red-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 right-1/4 w-[520px] h-[520px] bg-accent/[0.10] rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 pt-10 sm:pt-20 pb-10 sm:pb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1.5 mb-5 sm:mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-red-700 tracking-[0.12em] sm:tracking-[0.14em] uppercase">
              Live Value Destruction Tracker
            </span>
          </div>

          <h1 className="text-[36px] sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] sm:leading-[1.02] max-w-4xl text-slate-900">
            The Great{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-br from-red-500 via-red-600 to-orange-600 bg-clip-text text-transparent">
                Software Meltdown
              </span>
              <svg className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full" viewBox="0 0 500 10" fill="none" preserveAspectRatio="none">
                <path d="M0 5 Q125 10 250 5 T500 5" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-700 mt-5 sm:mt-7 max-w-3xl leading-[1.45] font-medium">
            <span className="text-slate-900 font-bold">{formatBillions(totalValueDestroyed)}</span>{" "}
            vaporized across {data.length} public software companies —
            while they kept paying out{" "}
            <span className="text-accent font-bold">{formatMillions(totalSBC)}</span>{" "}
            a year in stock-based compensation.
          </p>

          <p className="text-sm sm:text-base text-slate-500 mt-4 sm:mt-5 max-w-2xl leading-relaxed">
            SBC dilutes ownership forever. When the stock craters, employees' comp evaporates too —
            but shareholders still foot the bill. This is the gap between the promise and the payout.
          </p>

          {/* ─── Hero stat strip ─── */}
          <div className="mt-7 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border bg-border shadow-sm">
            <HeroStat
              label="Companies tracked"
              value={`${data.length}`}
              sub={`${downCount} down YTD`}
            />
            <HeroStat
              label="Value destroyed"
              value={formatBillions(totalValueDestroyed)}
              sub="vs 52-week highs"
              accent="red"
            />
            <HeroStat
              label="Annual SBC"
              value={formatMillions(totalSBC)}
              sub={`${avgSBCPct.toFixed(0)}% of revenue avg`}
              accent="blue"
            />
            <HeroStat
              label="Median YTD"
              value={formatPct(medianYTD.pctYTD)}
              sub={`worst: ${worstStock.ticker} ${formatPct(worstStock.pctYTD)}`}
              accent="red"
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* ═══ FUN FACTS ═══ */}
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
              The Numbers That Hurt
            </h2>
            <span className="text-xs text-slate-500 hidden sm:block font-medium">
              {data.length} companies · updated Apr 9, 2026
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <FunFact
              icon={<Timer className="w-4 h-4" />}
              stat={`$${sbcPerSecond.toFixed(0)}`}
              label="printed in SBC every second"
              sublabel={`that's $${(sbcPerDay / 1_000_000).toFixed(1)}M per day, non-stop`}
              tone="blue"
            />
            <FunFact
              icon={<Flame className="w-4 h-4" />}
              stat={`${companiesOver20Pct}`}
              label="companies burn >20% of revenue on SBC"
              sublabel={`${((companiesOver20Pct / data.length) * 100).toFixed(0)}% of the entire tracked group`}
              tone="orange"
            />
            <FunFact
              icon={<Coins className="w-4 h-4" />}
              stat={formatK(highestSBCPerEmp.sbcPerEmployeeK)}
              label={`per employee at ${highestSBCPerEmp.company}`}
              sublabel="highest stock comp per headcount"
              tone="amber"
            />
            <FunFact
              icon={<TrendingDown className="w-4 h-4" />}
              stat={formatPct(medianYTD.pctYTD)}
              label="the median stock is down this much YTD"
              sublabel={`median company: ${medianYTD.company}`}
              tone="red"
            />
            <FunFact
              icon={<Zap className="w-4 h-4" />}
              stat={formatMillions(totalSBCValueLost)}
              label="in SBC value evaporated in 6 months"
              sublabel="comp paid, then instantly worth less"
              tone="red"
            />
            <FunFact
              icon={<Users className="w-4 h-4" />}
              stat={`${(totalEmployees / 1000).toFixed(0)}K`}
              label={`employees across the ${data.length} companies`}
              sublabel={`avg ${formatK((totalSBC * 1000) / totalEmployees)} in SBC per person`}
              tone="blue"
            />
          </div>
        </section>

        {/* ═══ METHODOLOGY ═══ */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <span className="text-sm sm:text-base font-semibold text-slate-900 block">
                  What is SBC, and why should it matter?
                </span>
                <span className="hidden sm:block text-xs sm:text-sm text-slate-500 mt-0.5">
                  Methodology, definitions, and why shareholders should care
                </span>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${showMethodology ? "rotate-180" : ""}`} />
          </button>
          {showMethodology && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 border-t border-border pt-4 sm:pt-5">
              <div className="grid sm:grid-cols-2 gap-3">
                <ExplainerCard
                  title="Stock-Based Compensation (SBC)"
                  body="Companies pay employees with stock options and RSUs instead of cash. This dilutes existing shareholders — creating new shares and shrinking everyone else's ownership. SBC is a real cost that reduces earnings but is often excluded from 'adjusted' metrics."
                />
                <ExplainerCard
                  title="Value Destroyed"
                  body="Estimated by comparing current market cap to the peak market cap implied by the 52-week high. This represents the maximum shareholder wealth that has evaporated during the downturn — real money that investors lost."
                />
                <ExplainerCard
                  title="SBC Value Lost"
                  body="When a company's stock drops, the SBC issued in the prior 6 months loses value too. Employees received shares now worth much less, but the dilution to shareholders already happened and it is permanent."
                />
                <ExplainerCard
                  title="Why SBC % Revenue Matters"
                  body="A company paying 40% of its revenue in SBC is handing almost half its top line to employees as stock. Single-digit % is normal comp. Above 20%, shareholders are funding a transfer of wealth that may never be recouped."
                />
              </div>
            </div>
          )}
        </div>

        {/* ═══ KPI STAT BAR ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total Value Destroyed"
            value={formatBillions(totalValueDestroyed)}
            icon={<TrendingDown className="w-4 h-4" />}
            accent="red"
          />
          <StatCard
            label="Total Annual SBC"
            value={formatMillions(totalSBC)}
            icon={<DollarSign className="w-4 h-4" />}
            accent="blue"
          />
          <StatCard
            label="Avg SBC % Revenue"
            value={`${avgSBCPct.toFixed(1)}%`}
            icon={<Percent className="w-4 h-4" />}
            accent="orange"
          />
          <StatCard
            label="Worst Offender"
            value={`${worstOffender.ticker} (${worstOffender.sbcPctRevenue}%)`}
            icon={<AlertTriangle className="w-4 h-4" />}
            accent="red"
          />
        </div>

        {/* ═══ FEATURED CHARTS ═══ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <ChartCard
            title="Top 10 Value Destroyers"
            subtitle="Shareholder wealth evaporated vs 52-week highs"
          >
            <TopValueDestroyedChart data={data} onSelect={setSelectedCompany} />
          </ChartCard>
          <ChartCard
            title="YTD Decline Distribution"
            subtitle={`How deep the cuts go across ${data.length} companies`}
          >
            <YTDHistogram data={data} />
          </ChartCard>
        </section>

        {/* ═══ TAB BAR ═══ */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex flex-wrap items-center gap-1 px-2 sm:px-4 pt-2 sm:pt-3 pb-0 border-b border-border">
            {(["table", "scatter", "bar"] as ViewTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2.5 text-sm font-semibold capitalize transition-all border-b-2 -mb-[1px] rounded-t-md ${
                  activeTab === tab
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab === "scatter" ? "Scatter" : tab === "bar" ? "Bar" : "Table"}
              </button>
            ))}
          </div>

          {activeTab === "table" && (
            <div className="px-3 sm:px-4 pt-3">
              <input
                type="text"
                placeholder="Filter by ticker or name..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-base border border-border rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 w-full sm:w-64 transition-all"
              />
            </div>
          )}

          {/* ═══ VIEWS ═══ */}
          <div className="p-1">
            {activeTab === "table" && (
              <>
                <div className="hidden sm:block">
                  <SBCTable
                    data={filtered}
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={toggleSort}
                    onSelect={setSelectedCompany}
                  />
                </div>
                <div className="sm:hidden">
                  <MobileSortBar sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <MobileCardList data={filtered} onSelect={setSelectedCompany} />
                </div>
              </>
            )}
            {activeTab === "scatter" && <SBCScatterPlot data={data} onSelect={setSelectedCompany} />}
            {activeTab === "bar" && <SBCBarChart data={data} onSelect={setSelectedCompany} />}
          </div>
        </div>
      </main>

      {/* Drawer */}
      {selectedCompany && (
        <CompanyDrawer company={selectedCompany} onClose={() => setSelectedCompany(null)} />
      )}

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-8 py-8 mt-4 bg-surface">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            Data as of April 9, 2026 · SBC from latest annual filings · Built by Value Add VC
          </p>
          <div className="flex items-center gap-5 text-xs">
            <a
              href="https://x.com/Trace_Cohen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-accent transition-colors font-medium"
            >
              Twitter
            </a>
            <a
              href="mailto:t@nyvp.com"
              className="text-slate-500 hover:text-accent transition-colors font-medium"
            >
              t@nyvp.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ─── Hero Stat ─── */
function HeroStat({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent?: "red" | "blue"
}) {
  const color =
    accent === "red" ? "text-red-600" : accent === "blue" ? "text-accent" : "text-slate-900"
  return (
    <div className="bg-surface px-4 py-4 sm:px-6 sm:py-6">
      <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-slate-500">
        {label}
      </div>
      <div className={`text-xl sm:text-3xl font-bold font-mono mt-1 sm:mt-1.5 ${color} break-words`}>{value}</div>
      <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 truncate">{sub}</div>
    </div>
  )
}

/* ─── Stat Card ─── */
function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: string
  icon: React.ReactNode
  accent: "red" | "blue" | "orange"
}) {
  const palette = {
    red: {
      text: "text-red-600",
      iconBg: "bg-red-50",
      hover: "hover:border-red-300 hover:shadow-red-500/10",
    },
    blue: {
      text: "text-accent",
      iconBg: "bg-accent/10",
      hover: "hover:border-accent/40 hover:shadow-accent/10",
    },
    orange: {
      text: "text-orange-600",
      iconBg: "bg-orange-50",
      hover: "hover:border-orange-300 hover:shadow-orange-500/10",
    },
  }[accent]

  return (
    <div
      className={`bg-surface border border-border rounded-2xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg ${palette.hover} group shadow-sm`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-[0.1em] sm:tracking-[0.12em] leading-tight">
          {label}
        </div>
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${palette.iconBg} ${palette.text} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>
      <div className={`text-[22px] sm:text-[32px] font-bold font-mono ${palette.text} leading-none break-words`}>
        {value}
      </div>
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
    { key: "delta52w", label: "52w \u0394", align: "right" },
    { key: "valueDestroyedB", label: "Value Lost", align: "right" },
    { key: "sbcAnnualM", label: "SBC/Yr", align: "right" },
    { key: "sbcPctRevenue", label: "SBC % Rev", align: "right" },
    { key: "sbcSixMonthM", label: "SBC 6mo", align: "right" },
    { key: "sbcValueLostM", label: "SBC Val Lost", align: "right" },
    { key: "employees", label: "Employees", align: "right" },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            {cols.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 font-semibold text-slate-500 whitespace-nowrap cursor-pointer hover:text-slate-900 transition-colors select-none text-[11px] uppercase tracking-[0.08em] ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
                onClick={() => onSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key ? (
                    sortDir === "asc" ? (
                      <ArrowUp className="w-3 h-3 text-accent" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-accent" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr
              key={c.ticker}
              onClick={() => onSelect(c)}
              className={`border-t border-border/80 cursor-pointer transition-all duration-150 hover:bg-accent/[0.05] hover:shadow-[inset_2px_0_0_0_#0284c7] ${
                i % 2 === 0 ? "bg-transparent" : "bg-slate-50/60"
              }`}
            >
              <td className="px-3 py-3 font-mono font-bold text-accent">{c.ticker}</td>
              <td className="px-3 py-3 text-slate-900 whitespace-nowrap font-medium">{c.company}</td>
              <td className="px-3 py-3 text-right text-slate-600 font-mono">
                {formatBillions(c.marketCapB)}
              </td>
              <td className="px-3 py-3 text-right font-mono font-semibold" style={{ color: colorForPct(c.pctYTD) }}>
                {formatPct(c.pctYTD)}
              </td>
              <td className="px-3 py-3 text-right font-mono font-semibold" style={{ color: colorForPct(c.delta52w) }}>
                {formatPct(c.delta52w)}
              </td>
              <td className="px-3 py-3 text-right font-mono font-semibold text-red-600">
                {formatBillions(c.valueDestroyedB)}
              </td>
              <td className="px-3 py-3 text-right font-mono text-slate-600">
                {formatMillions(c.sbcAnnualM)}
              </td>
              <td className="px-3 py-3 text-right">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold font-mono ${bgForSBCPct(c.sbcPctRevenue)}`}>
                  {c.sbcPctRevenue.toFixed(1)}%
                </span>
              </td>
              <td className="px-3 py-3 text-right font-mono text-slate-500">
                {formatMillions(c.sbcSixMonthM)}
              </td>
              <td className="px-3 py-3 text-right font-mono font-semibold text-red-600">
                {formatMillions(c.sbcValueLostM)}
              </td>
              <td className="px-3 py-3 text-right font-mono text-slate-500">
                {c.employees.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Chart Card wrapper ─── */
function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-border">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  )
}

/* ─── Top Value Destroyers bar ─── */
function TopValueDestroyedChart({
  data,
  onSelect,
}: {
  data: CompanyWithMetrics[]
  onSelect: (c: CompanyWithMetrics) => void
}) {
  const top = [...data]
    .sort((a, b) => b.valueDestroyedB - a.valueDestroyedB)
    .slice(0, 10)
    .map((c) => ({
      ticker: c.ticker,
      company: c.company,
      value: Number(c.valueDestroyedB.toFixed(1)),
      pctYTD: c.pctYTD,
      _company: c,
    }))

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={top} layout="vertical" margin={{ top: 5, right: 60, left: 8, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: AXIS_FILL, fontSize: 11 }}
          tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}T` : `${v}B`}`}
        />
        <YAxis
          dataKey="ticker"
          type="category"
          tick={{ fill: TEXT_DARK, fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600 }}
          width={52}
          axisLine={false}
          tickLine={false}
        />
        <RechartsTooltip
          cursor={{ fill: "rgba(220, 38, 38, 0.06)" }}
          content={({ payload }) => {
            if (!payload?.[0]) return null
            const d = payload[0].payload
            return (
              <div className="bg-surface border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
                <div className="font-mono font-bold text-accent text-sm">{d.ticker}</div>
                <div className="text-slate-700 font-medium">{d.company}</div>
                <div className="text-red-600 font-semibold mt-1">-{formatBillions(d.value)} wiped</div>
                <div className="text-slate-500">YTD: {formatPct(d.pctYTD)}</div>
              </div>
            )
          }}
        />
        <Bar
          dataKey="value"
          radius={[0, 6, 6, 0]}
          cursor="pointer"
          onClick={(entry: any) => {
            if (entry?._company) onSelect(entry._company)
          }}
        >
          {top.map((_, i) => (
            <Cell key={i} fill="#dc2626" fillOpacity={0.85 - i * 0.035} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => `$${Number(v).toFixed(0)}B`}
            style={{ fill: "#dc2626", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ─── YTD Decline Histogram ─── */
function YTDHistogram({ data }: { data: CompanyWithMetrics[] }) {
  const buckets = [
    { key: "positive", label: "Up", min: 0, max: Infinity, color: "#16a34a" },
    { key: "b1", label: "0 to -15%", min: -15, max: 0, color: "#ca8a04" },
    { key: "b2", label: "-15 to -30%", min: -30, max: -15, color: "#d97706" },
    { key: "b3", label: "-30 to -45%", min: -45, max: -30, color: "#ea580c" },
    { key: "b4", label: "-45 to -60%", min: -60, max: -45, color: "#dc2626" },
    { key: "b5", label: "< -60%", min: -Infinity, max: -60, color: "#991b1b" },
  ]
  const chartData = buckets.map((b) => ({
    label: b.label,
    count: data.filter((c) => c.pctYTD > b.min && c.pctYTD <= b.max).length,
    color: b.color,
  }))

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={chartData} margin={{ top: 20, right: 16, left: 0, bottom: 28 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: AXIS_FILL, fontSize: 10 }}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={50}
        />
        <YAxis
          tick={{ fill: AXIS_FILL, fontSize: 11 }}
          allowDecimals={false}
          label={{ value: "Companies", angle: -90, position: "insideLeft", fill: AXIS_FILL, fontSize: 11 }}
        />
        <RechartsTooltip
          cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
          content={({ payload }) => {
            if (!payload?.[0]) return null
            const d = payload[0].payload
            return (
              <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
                <div className="font-semibold text-slate-900">{d.label}</div>
                <div className="text-slate-600 font-mono mt-0.5">{d.count} companies</div>
              </div>
            )
          }}
        />
        <ReferenceLine x="0 to -15%" stroke="#e2e8f0" />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={56}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
          <LabelList
            dataKey="count"
            position="top"
            style={{ fill: "#0f172a", fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ─── Mobile Sort Bar ─── */
function MobileSortBar({
  sortKey,
  sortDir,
  onSort,
}: {
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
}) {
  const options: { key: SortKey; label: string }[] = [
    { key: "pctYTD", label: "YTD %" },
    { key: "valueDestroyedB", label: "Value Lost" },
    { key: "sbcAnnualM", label: "SBC/Yr" },
    { key: "sbcPctRevenue", label: "SBC %" },
    { key: "marketCapB", label: "Mkt Cap" },
  ]
  return (
    <div className="flex items-center gap-2 px-3 py-3 overflow-x-auto border-b border-border">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">Sort</span>
      {options.map((o) => {
        const active = sortKey === o.key
        return (
          <button
            key={o.key}
            onClick={() => onSort(o.key)}
            className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              active
                ? "bg-accent/10 border-accent/30 text-accent"
                : "bg-slate-50 border-border text-slate-600"
            }`}
          >
            {o.label}
            {active && (sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Mobile Card List ─── */
function MobileCardList({
  data,
  onSelect,
}: {
  data: CompanyWithMetrics[]
  onSelect: (c: CompanyWithMetrics) => void
}) {
  if (data.length === 0) {
    return <div className="px-4 py-12 text-center text-sm text-slate-500">No companies match.</div>
  }
  return (
    <ul className="divide-y divide-border">
      {data.map((c) => (
        <li
          key={c.ticker}
          onClick={() => onSelect(c)}
          className="px-4 py-4 active:bg-slate-100 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-accent text-sm">{c.ticker}</span>
                <span className="text-xs text-slate-500">{formatBillions(c.marketCapB)}</span>
              </div>
              <div className="text-sm font-semibold text-slate-900 truncate mt-0.5">{c.company}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-base font-mono font-bold" style={{ color: colorForPct(c.pctYTD) }}>
                {formatPct(c.pctYTD)}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">YTD</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MobileMetric label="Value Lost" value={formatBillions(c.valueDestroyedB)} color="#dc2626" />
            <MobileMetric label="SBC/Yr" value={formatMillions(c.sbcAnnualM)} />
            <MobileMetric
              label="SBC % Rev"
              value={`${c.sbcPctRevenue.toFixed(0)}%`}
              color={colorForSBCPct(c.sbcPctRevenue)}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

function MobileMetric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-slate-50 rounded-lg px-2.5 py-2">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div
        className="text-[13px] font-mono font-bold mt-0.5 truncate"
        style={{ color: color ?? "#0f172a" }}
      >
        {value}
      </div>
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
    <div className="p-3 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-600 mb-4">
        SBC % Revenue vs Value Destroyed — dot size = market cap, color = YTD %
      </h3>
      <ResponsiveContainer width="100%" height={480}>
        <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
          <XAxis
            dataKey="x"
            type="number"
            name="SBC % Rev"
            unit="%"
            tick={{ fill: AXIS_FILL, fontSize: 12 }}
            label={{ value: "SBC % Revenue", position: "bottom", fill: AXIS_FILL, fontSize: 12 }}
          />
          <YAxis
            dataKey="y"
            type="number"
            name="Value Destroyed"
            tick={{ fill: AXIS_FILL, fontSize: 12 }}
            label={{
              value: "Value Destroyed ($B)",
              angle: -90,
              position: "insideLeft",
              fill: AXIS_FILL,
              fontSize: 12,
            }}
          />
          <RechartsTooltip
            cursor={{ strokeDasharray: "3 3", stroke: "#0284c7" }}
            content={({ payload }) => {
              if (!payload?.[0]) return null
              const d = payload[0].payload
              return (
                <div className="bg-surface border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
                  <div className="font-mono font-bold text-accent text-sm">{d.ticker}</div>
                  <div className="text-slate-600 mt-1">SBC % Rev: {d.x.toFixed(1)}%</div>
                  <div className="text-slate-600">Value Lost: {formatBillions(d.y)}</div>
                  <div className="text-slate-600">Mkt Cap: {formatBillions(d.z)}</div>
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
                fillOpacity={0.85}
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
    <div className="p-3 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-600 mb-4">
        Top 15 by Annual SBC ($M) — colored by SBC % Revenue
      </h3>
      <ResponsiveContainer width="100%" height={520}>
        <BarChart data={top15} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: AXIS_FILL, fontSize: 12 }}
            tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}B` : `${v}M`}`}
          />
          <YAxis
            dataKey="ticker"
            type="category"
            tick={{ fill: TEXT_DARK, fontSize: 12, fontFamily: "var(--font-mono)" }}
            width={55}
          />
          <RechartsTooltip
            cursor={{ fill: "rgba(2, 132, 199, 0.08)" }}
            content={({ payload }) => {
              if (!payload?.[0]) return null
              const d = payload[0].payload
              return (
                <div className="bg-surface border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
                  <div className="font-mono font-bold text-accent text-sm">{d.ticker}</div>
                  <div className="text-slate-600 mt-1">Annual SBC: {formatMillions(d.sbcAnnualM)}</div>
                </div>
              )
            }}
          />
          <Bar
            dataKey="sbcAnnualM"
            radius={[0, 6, 6, 0]}
            cursor="pointer"
            onClick={(entry: any) => {
              if (entry?._company) onSelect(entry._company)
            }}
          >
            {top15.map((entry, i) => (
              <Cell key={i} fill={entry.fill} fillOpacity={0.9} />
            ))}
            <LabelList
              dataKey="sbcAnnualM"
              position="right"
              formatter={(v) => formatMillions(Number(v))}
              style={{ fill: "#334155", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600 }}
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
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-base border-l border-border z-50 overflow-y-auto shadow-2xl">
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-mono font-bold text-accent">{c.ticker}</div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{c.company}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Section title="Price & Performance">
            <MetricRow label="Price" value={`$${c.price.toFixed(2)}`} />
            <MetricRow label="YTD Change" value={formatPct(c.pctYTD)} color={colorForPct(c.pctYTD)} />
            <MetricRow label="52-Week Change" value={formatPct(c.delta52w)} color={colorForPct(c.delta52w)} />
            <MetricRow label="Market Cap" value={formatBillions(c.marketCapB)} />
            <MetricRow label="Peak Market Cap (est.)" value={formatBillions(c.peakMcapB)} />
            <MetricRow label="Value Destroyed" value={formatBillions(c.valueDestroyedB)} color="#dc2626" />
          </Section>

          <Section title="Stock-Based Compensation">
            <MetricRow label="Annual SBC" value={formatMillions(c.sbcAnnualM)} />
            <MetricRow label="SBC % Revenue" value={`${c.sbcPctRevenue.toFixed(1)}%`} color={colorForSBCPct(c.sbcPctRevenue)} />
            <MetricRow label="SBC (6-Month)" value={formatMillions(c.sbcSixMonthM)} />
            <MetricRow label="SBC Value Lost" value={formatMillions(c.sbcValueLostM)} color="#dc2626" />
          </Section>

          <Section title="Revenue & Headcount">
            <MetricRow label="Annual Revenue" value={formatMillions(c.revenueM)} />
            <MetricRow label="Employees" value={c.employees.toLocaleString()} />
          </Section>

          <Section title="Per-Employee Metrics">
            <MetricRow label="SBC per Employee" value={formatK(c.sbcPerEmployeeK)} />
            <MetricRow label="SBC Value Lost per Employee" value={formatK(c.sbcValueLostPerEmployeeK)} color="#dc2626" />
          </Section>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.14em] mb-3">{title}</h3>
      <div className="bg-surface border border-border rounded-xl divide-y divide-border/70 shadow-sm">
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
    <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-mono font-semibold" style={color ? { color } : { color: "#0f172a" }}>
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
  tone,
}: {
  icon: React.ReactNode
  stat: string
  label: string
  sublabel: string
  tone: "red" | "orange" | "amber" | "blue"
}) {
  const palette = {
    red: { text: "text-red-600", iconBg: "bg-red-50", border: "hover:border-red-300" },
    orange: { text: "text-orange-600", iconBg: "bg-orange-50", border: "hover:border-orange-300" },
    amber: { text: "text-amber-600", iconBg: "bg-amber-50", border: "hover:border-amber-300" },
    blue: { text: "text-accent", iconBg: "bg-accent/10", border: "hover:border-accent/40" },
  }[tone]

  return (
    <div
      className={`bg-surface border border-border rounded-2xl p-4 sm:p-6 hover:shadow-md ${palette.border} transition-all duration-200 group shadow-sm`}
    >
      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${palette.iconBg} ${palette.text} flex items-center justify-center mb-3 sm:mb-4`}>
        {icon}
      </div>
      <div className={`text-[24px] sm:text-[34px] font-bold font-mono ${palette.text} leading-none break-words`}>
        {stat}
      </div>
      <div className="text-[13px] sm:text-sm text-slate-900 mt-2.5 sm:mt-3 leading-snug font-semibold">{label}</div>
      <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">{sublabel}</div>
    </div>
  )
}

/* ─── Explainer Card ─── */
function ExplainerCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-base border border-border rounded-xl p-4 hover:border-border-hover transition-colors">
      <h4 className="text-sm font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-xs text-slate-600 leading-relaxed">{body}</p>
    </div>
  )
}
