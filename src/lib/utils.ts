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
  if (v <= -60) return "#dc2626"
  if (v <= -40) return "#ea580c"
  if (v <= -20) return "#d97706"
  if (v < 0) return "#ca8a04"
  return "#16a34a"
}

export function colorForSBCPct(v: number): string {
  if (v > 30) return "#dc2626"
  if (v > 18) return "#ea580c"
  if (v > 8) return "#d97706"
  return "#16a34a"
}

export function bgForSBCPct(v: number): string {
  if (v > 30) return "bg-red-50 text-red-700 border border-red-200"
  if (v > 18) return "bg-orange-50 text-orange-700 border border-orange-200"
  if (v > 8) return "bg-amber-50 text-amber-700 border border-amber-200"
  return "bg-emerald-50 text-emerald-700 border border-emerald-200"
}
