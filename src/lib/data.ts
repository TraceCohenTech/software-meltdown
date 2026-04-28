export type Company = {
  ticker: string
  company: string
  price: number
  pctYTD: number
  delta52w: number
  marketCapB: number
  sbcAnnualM: number
  sbcPctRevenue: number
  revenueM: number
  employees: number
}

// Data as of April 27, 2026 — prices from Yahoo Finance, CNBC, Finviz & Capital.com
// Revenue & SBC from most recent annual filings (FY2025 for most)
// Sorted by YTD performance (worst first)

export const companies: Company[] = [
  // ── Extreme destruction ────────────────────────────────────────────────────
  { ticker: "FIG",  company: "Figma",          price: 17.47,  pctYTD: -75.4, delta52w: -87.7, marketCapB: 9.7,   sbcAnnualM: 470,  sbcPctRevenue: 52.2, revenueM: 900,   employees: 2000  },
  { ticker: "MNDY", company: "monday.com",     price: 69.74,  pctYTD: -51.4, delta52w: -62.0, marketCapB: 3.6,   sbcAnnualM: 225,  sbcPctRevenue: 16.1, revenueM: 1400,  employees: 2800  },
  { ticker: "ASAN", company: "Asana",          price: 5.80,   pctYTD: -48.2, delta52w: -59.5, marketCapB: 1.3,   sbcAnnualM: 265,  sbcPctRevenue: 36.8, revenueM: 720,   employees: 2500  },
  { ticker: "SNAP", company: "Snap",           price: 6.15,   pctYTD: -46.1, delta52w: -58.0, marketCapB: 10.2,  sbcAnnualM: 1620, sbcPctRevenue: 24.9, revenueM: 6500,  employees: 4500  },
  { ticker: "HUBS", company: "HubSpot",        price: 230.95, pctYTD: -45.4, delta52w: -55.8, marketCapB: 12.1,  sbcAnnualM: 335,  sbcPctRevenue: 11.6, revenueM: 2890,  employees: 8100  },
  { ticker: "APPS", company: "Digital Turbine",price: 3.75,   pctYTD: -45.0, delta52w: -54.7, marketCapB: 0.45,  sbcAnnualM: 8,    sbcPctRevenue: 14.5, revenueM: 55,    employees: 280   },
  { ticker: "ZETA", company: "Zeta Global",    price: 18.01,  pctYTD: -44.8, delta52w: -56.1, marketCapB: 4.3,   sbcAnnualM: 145,  sbcPctRevenue: 15.3, revenueM: 950,   employees: 2400  },
  { ticker: "KVYO", company: "Klaviyo",        price: 19.80,  pctYTD: -44.5, delta52w: -55.7, marketCapB: 5.8,   sbcAnnualM: 205,  sbcPctRevenue: 18.6, revenueM: 1100,  employees: 2200  },
  { ticker: "DOCU", company: "DocuSign",       price: 46.22,  pctYTD: -43.2, delta52w: -55.0, marketCapB: 9.0,   sbcAnnualM: 315,  sbcPctRevenue: 11.7, revenueM: 2700,  employees: 6600  },
  { ticker: "DOCS", company: "Doximity",       price: 23.50,  pctYTD: -42.4, delta52w: -53.6, marketCapB: 4.3,   sbcAnnualM: 62,   sbcPctRevenue: 7.9,  revenueM: 780,   employees: 950   },
  { ticker: "GTLB", company: "GitLab",         price: 20.80,  pctYTD: -42.3, delta52w: -54.1, marketCapB: 3.5,   sbcAnnualM: 325,  sbcPctRevenue: 29.5, revenueM: 1100,  employees: 2600  },
  // ── Heavy losses ──────────────────────────────────────────────────────────
  { ticker: "NOW",  company: "ServiceNow",     price: 89.80,  pctYTD: -41.3, delta52w: -54.8, marketCapB: 93.0,  sbcAnnualM: 1180, sbcPctRevenue: 7.9,  revenueM: 14900, employees: 24000 },
  { ticker: "TTD",  company: "Trade Desk",     price: 23.49,  pctYTD: -41.0, delta52w: -62.7, marketCapB: 11.4,  sbcAnnualM: 228,  sbcPctRevenue: 8.1,  revenueM: 2800,  employees: 3500  },
  { ticker: "CVLT", company: "Commvault",      price: 93.92,  pctYTD: -38.4, delta52w: -53.1, marketCapB: 4.2,   sbcAnnualM: 55,   sbcPctRevenue: 6.3,  revenueM: 880,   employees: 2800  },
  { ticker: "IOT",  company: "Samsara",        price: 29.28,  pctYTD: -38.2, delta52w: -51.0, marketCapB: 17.0,  sbcAnnualM: 425,  sbcPctRevenue: 17.7, revenueM: 2400,  employees: 4000  },
  { ticker: "ADP",  company: "ADP",            price: 209.11, pctYTD: -37.1, delta52w: -37.1, marketCapB: 84.0,  sbcAnnualM: 248,  sbcPctRevenue: 1.2,  revenueM: 21200, employees: 58000 },
  { ticker: "TEAM", company: "Atlassian",      price: 71.69,  pctYTD: -37.0, delta52w: -48.1, marketCapB: 18.65, sbcAnnualM: 745,  sbcPctRevenue: 14.9, revenueM: 5000,  employees: 11500 },
  { ticker: "CRM",  company: "Salesforce",     price: 178.16, pctYTD: -36.8, delta52w: -47.4, marketCapB: 165.0, sbcAnnualM: 3050, sbcPctRevenue: 7.5,  revenueM: 40500, employees: 55000 },
  { ticker: "WIX",  company: "Wix",            price: 72.00,  pctYTD: -36.5, delta52w: -50.0, marketCapB: 4.0,   sbcAnnualM: 195,  sbcPctRevenue: 12.2, revenueM: 1600,  employees: 5100  },
  { ticker: "WDAY", company: "Workday",        price: 129.84, pctYTD: -35.6, delta52w: -51.5, marketCapB: 33.0,  sbcAnnualM: 900,  sbcPctRevenue: 10.7, revenueM: 8400,  employees: 19500 },
  { ticker: "GWRE", company: "Guidewire",      price: 117.95, pctYTD: -35.4, delta52w: -49.2, marketCapB: 9.9,   sbcAnnualM: 198,  sbcPctRevenue: 14.1, revenueM: 1400,  employees: 3300  },
  { ticker: "ESTC", company: "Elastic",        price: 48.88,  pctYTD: -35.1, delta52w: -47.8, marketCapB: 5.1,   sbcAnnualM: 275,  sbcPctRevenue: 19.6, revenueM: 1400,  employees: 3700  },
  { ticker: "BRZE", company: "Braze",          price: 23.27,  pctYTD: -34.6, delta52w: -47.5, marketCapB: 2.7,   sbcAnnualM: 178,  sbcPctRevenue: 23.4, revenueM: 760,   employees: 1700  },
  { ticker: "CLBT", company: "Cellebrite",     price: 13.38,  pctYTD: -34.5, delta52w: -45.0, marketCapB: 3.3,   sbcAnnualM: 72,   sbcPctRevenue: 10.0, revenueM: 720,   employees: 2600  },
  { ticker: "DUOL", company: "Duolingo",       price: 100.29, pctYTD: -33.9, delta52w: -44.7, marketCapB: 4.5,   sbcAnnualM: 94,   sbcPctRevenue: 9.4,  revenueM: 1000,  employees: 1000  },
  // ── Significant losses ────────────────────────────────────────────────────
  { ticker: "INTU", company: "Intuit",         price: 391.73, pctYTD: -32.3, delta52w: -42.8, marketCapB: 108.0, sbcAnnualM: 985,  sbcPctRevenue: 4.3,  revenueM: 22800, employees: 18500 },
  { ticker: "VEEV", company: "Veeva",          price: 163.47, pctYTD: -31.4, delta52w: -44.9, marketCapB: 26.5,  sbcAnnualM: 360,  sbcPctRevenue: 10.6, revenueM: 3400,  employees: 10500 },
  { ticker: "ADBE", company: "Adobe",          price: 240.42, pctYTD: -31.0, delta52w: -43.1, marketCapB: 96.0,  sbcAnnualM: 1280, sbcPctRevenue: 5.3,  revenueM: 24000, employees: 30000 },
  { ticker: "DDOG", company: "Datadog",        price: 128.35, pctYTD: -29.8, delta52w: -42.0, marketCapB: 45.0,  sbcAnnualM: 650,  sbcPctRevenue: 14.4, revenueM: 4500,  employees: 6800  },
  { ticker: "ZM",   company: "Zoom",           price: 82.40,  pctYTD: -29.5, delta52w: -38.6, marketCapB: 24.2,  sbcAnnualM: 305,  sbcPctRevenue: 6.2,  revenueM: 4900,  employees: 7200  },
  { ticker: "SNOW", company: "Snowflake",      price: 140.32, pctYTD: -28.4, delta52w: -40.2, marketCapB: 47.0,  sbcAnnualM: 1080, sbcPctRevenue: 21.6, revenueM: 5000,  employees: 7400  },
  { ticker: "SAP",  company: "SAP",            price: 172.97, pctYTD: -28.1, delta52w: -38.0, marketCapB: 215.0, sbcAnnualM: 1180, sbcPctRevenue: 2.9,  revenueM: 41000, employees: 105000},
  { ticker: "ADSK", company: "Autodesk",       price: 237.44, pctYTD: -25.9, delta52w: -34.8, marketCapB: 50.0,  sbcAnnualM: 565,  sbcPctRevenue: 8.3,  revenueM: 6800,  employees: 13500 },
  { ticker: "MDB",  company: "MongoDB",        price: 261.43, pctYTD: -22.4, delta52w: -34.7, marketCapB: 21.0,  sbcAnnualM: 375,  sbcPctRevenue: 17.0, revenueM: 2200,  employees: 5500  },
  // ── Moderate losses ───────────────────────────────────────────────────────
  { ticker: "NET",  company: "Cloudflare",     price: 207.67, pctYTD: -20.1, delta52w: -27.8, marketCapB: 72.0,  sbcAnnualM: 760,  sbcPctRevenue: 28.1, revenueM: 2700,  employees: 4200  },
  { ticker: "APP",  company: "AppLovin",       price: 448.29, pctYTD: -19.8, delta52w: -27.1, marketCapB: 151.0, sbcAnnualM: 188,  sbcPctRevenue: 2.6,  revenueM: 7200,  employees: 1400  },
  { ticker: "TWLO", company: "Twilio",         price: 141.59, pctYTD: -19.2, delta52w: -27.5, marketCapB: 21.5,  sbcAnnualM: 272,  sbcPctRevenue: 11.3, revenueM: 2400,  employees: 5800  },
]
