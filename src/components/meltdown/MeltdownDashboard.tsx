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
import { X, ArrowUpDown, TrendingDown, DollarSign, Percent, AlertTriangle } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-8 py-6">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Software Meltdown
          </h1>
          <p className="text-text-muted text-sm mt-1">
            SBC & Value Destruction Tracker — 35 Public Software Companies
          </p>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Stat Bar */}
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
