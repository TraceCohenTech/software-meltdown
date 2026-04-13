import { Company } from "./data"

export type DerivedMetrics = {
  peakMcapB: number
  valueDestroyedB: number
  sbcSixMonthM: number
  sbcValueLostM: number
  sbcPerEmployeeK: number
  sbcValueLostPerEmployeeK: number
}

export type CompanyWithMetrics = Company & DerivedMetrics

export function computeMetrics(c: Company): CompanyWithMetrics {
  const peakMcapB = c.marketCapB / (1 + c.delta52w / 100)
  const valueDestroyedB = peakMcapB - c.marketCapB
  const sbcSixMonthM = c.sbcAnnualM / 2
  const sbcValueLostM = sbcSixMonthM * (1 - (1 + c.delta52w / 100))
  const sbcPerEmployeeK = (c.sbcAnnualM * 1000) / c.employees
  const sbcValueLostPerEmployeeK = (sbcValueLostM * 1000) / c.employees

  return {
    ...c,
    peakMcapB,
    valueDestroyedB,
    sbcSixMonthM,
    sbcValueLostM,
    sbcPerEmployeeK,
    sbcValueLostPerEmployeeK,
  }
}

export function formatBillions(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}T`
  if (Math.abs(n) >= 1) return `$${n.toFixed(1)}B`
  return `$${(n * 1000).toFixed(0)}M`
}

export function formatMillions(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}B`
  return `$${n.toFixed(0)}M`
}

export function formatPct(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`
}

export function formatK(n: number): string {
  return `$${n.toFixed(0)}K`
}

export function colorForPct(v: number): string {
  if (v <= -60) return "#ef4444"
  if (v <= -40) return "#f97316"
  if (v <= -20) return "#f59e0b"
  if (v < 0) return "#fbbf24"
  return "#22c55e"
}

export function colorForSBCPct(v: number): string {
  if (v > 30) return "#ef4444"
  if (v > 18) return "#f97316"
  if (v > 8) return "#f59e0b"
  return "#22c55e"
}

export function bgForSBCPct(v: number): string {
  if (v > 30) return "bg-red-500/25 text-red-300 border border-red-500/20"
  if (v > 18) return "bg-orange-500/25 text-orange-300 border border-orange-500/20"
  if (v > 8) return "bg-yellow-500/25 text-yellow-300 border border-yellow-500/20"
  return "bg-green-500/25 text-green-300 border border-green-500/20"
}
