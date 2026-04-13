import type { Metadata } from "next"
import MeltdownDashboard from "@/components/meltdown/MeltdownDashboard"

export const metadata: Metadata = {
  title: "Software Meltdown | Value Add VC",
  description:
    "SBC & Value Destruction Tracker — Tracking stock-based compensation and shareholder value destruction across 35 public software companies.",
}

export default function SoftwareMeltdownPage() {
  return <MeltdownDashboard />
}
