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

export const companies: Company[] = [
  { ticker: "TEAM", company: "Atlassian", price: 58.76, pctYTD: -63.76, delta52w: -75.72, marketCapB: 15.5, sbcAnnualM: 580, sbcPctRevenue: 18.2, revenueM: 3190, employees: 11000 },
  { ticker: "ASAN", company: "Asana", price: 5.73, pctYTD: -58.39, delta52w: -69.84, marketCapB: 1.4, sbcAnnualM: 238, sbcPctRevenue: 42.1, revenueM: 565, employees: 2700 },
  { ticker: "MNDY", company: "monday.com", price: 62.62, pctYTD: -57.81, delta52w: -80.24, marketCapB: 3.2, sbcAnnualM: 188, sbcPctRevenue: 19.8, revenueM: 950, employees: 2200 },
  { ticker: "DOCS", company: "Doximity", price: 21.16, pctYTD: -52.55, delta52w: -72.34, marketCapB: 3.9, sbcAnnualM: 52, sbcPctRevenue: 8.1, revenueM: 641, employees: 900 },
  { ticker: "FIG", company: "Figma", price: 19.06, pctYTD: -49.96, delta52w: -86.66, marketCapB: 9.9, sbcAnnualM: 357, sbcPctRevenue: 22.4, revenueM: 1594, employees: 1800 },
  { ticker: "DUOL", company: "Duolingo", price: 90.16, pctYTD: -48.98, delta52w: -83.45, marketCapB: 4.2, sbcAnnualM: 80, sbcPctRevenue: 14.3, revenueM: 559, employees: 900 },
  { ticker: "HUBS", company: "HubSpot", price: 205.46, pctYTD: -48.84, delta52w: -69.90, marketCapB: 10.8, sbcAnnualM: 267, sbcPctRevenue: 12.6, revenueM: 2120, employees: 7600 },
  { ticker: "GTLB", company: "GitLab", price: 19.67, pctYTD: -48.21, delta52w: -63.63, marketCapB: 3.3, sbcAnnualM: 285, sbcPctRevenue: 38.7, revenueM: 737, employees: 2500 },
  { ticker: "WDAY", company: "Workday", price: 113.03, pctYTD: -47.48, delta52w: -59.05, marketCapB: 29.0, sbcAnnualM: 695, sbcPctRevenue: 11.2, revenueM: 6210, employees: 18800 },
  { ticker: "TTD", company: "Trade Desk", price: 20.41, pctYTD: -46.57, delta52w: -77.68, marketCapB: 9.7, sbcAnnualM: 198, sbcPctRevenue: 9.8, revenueM: 2020, employees: 3200 },
  { ticker: "INTU", company: "Intuit", price: 358.39, pctYTD: -45.75, delta52w: -55.96, marketCapB: 99.2, sbcAnnualM: 892, sbcPctRevenue: 4.9, revenueM: 18200, employees: 18900 },
  { ticker: "KVYO", company: "Klaviyo", price: 17.81, pctYTD: -45.23, delta52w: -52.87, marketCapB: 5.4, sbcAnnualM: 175, sbcPctRevenue: 24.5, revenueM: 714, employees: 2100 },
  { ticker: "MDB", company: "MongoDB", price: 231.65, pctYTD: -45.17, delta52w: -47.91, marketCapB: 18.6, sbcAnnualM: 295, sbcPctRevenue: 20.1, revenueM: 1468, employees: 5300 },
  { ticker: "APP", company: "AppLovin", price: 375.55, pctYTD: -45.04, delta52w: -49.63, marketCapB: 126.7, sbcAnnualM: 143, sbcPctRevenue: 3.2, revenueM: 4474, employees: 1200 },
  { ticker: "NOW", company: "ServiceNow", price: 89.26, pctYTD: -41.70, delta52w: -57.79, marketCapB: 92.5, sbcAnnualM: 844, sbcPctRevenue: 8.4, revenueM: 10050, employees: 22800 },
  { ticker: "APPS", company: "Digital Turbine", price: 3.01, pctYTD: -40.28, delta52w: -63.65, marketCapB: 0.361, sbcAnnualM: 12, sbcPctRevenue: 15.2, revenueM: 79, employees: 350 },
  { ticker: "SNOW", company: "Snowflake", price: 131.96, pctYTD: -40.02, delta52w: -52.98, marketCapB: 45.6, sbcAnnualM: 900, sbcPctRevenue: 28.6, revenueM: 3146, employees: 7200 },
  { ticker: "ESTC", company: "Elastic", price: 45.31, pctYTD: -40.01, delta52w: -52.84, marketCapB: 4.7, sbcAnnualM: 236, sbcPctRevenue: 22.3, revenueM: 1059, employees: 3700 },
  { ticker: "BRZE", company: "Braze", price: 20.80, pctYTD: -39.43, delta52w: -44.78, marketCapB: 2.4, sbcAnnualM: 152, sbcPctRevenue: 31.4, revenueM: 484, employees: 1700 },
  { ticker: "CVLT", company: "Commvault", price: 76.79, pctYTD: -39.36, delta52w: -61.74, marketCapB: 3.4, sbcAnnualM: 48, sbcPctRevenue: 6.8, revenueM: 706, employees: 2900 },
  { ticker: "GWRE", company: "Guidewire", price: 124.37, pctYTD: -37.97, delta52w: -54.38, marketCapB: 10.5, sbcAnnualM: 175, sbcPctRevenue: 16.9, revenueM: 1036, employees: 3200 },
  { ticker: "WIX", company: "WIX", price: 66.80, pctYTD: -36.08, delta52w: -65.07, marketCapB: 3.7, sbcAnnualM: 173, sbcPctRevenue: 14.1, revenueM: 1227, employees: 5300 },
  { ticker: "CRM", company: "Salesforce", price: 170.29, pctYTD: -35.68, delta52w: -42.48, marketCapB: 157.1, sbcAnnualM: 2666, sbcPctRevenue: 8.7, revenueM: 30644, employees: 73000 },
  { ticker: "ADBE", company: "Adobe", price: 229.40, pctYTD: -34.58, delta52w: -45.76, marketCapB: 92.7, sbcAnnualM: 1138, sbcPctRevenue: 6.1, revenueM: 18684, employees: 30000 },
  { ticker: "DOCU", company: "DocuSign", price: 45.17, pctYTD: -34.16, delta52w: -52.29, marketCapB: 8.8, sbcAnnualM: 290, sbcPctRevenue: 12.3, revenueM: 2358, employees: 6700 },
  { ticker: "CLBT", company: "Cellebrite", price: 12.15, pctYTD: -32.65, delta52w: -40.82, marketCapB: 3.0, sbcAnnualM: 62, sbcPctRevenue: 10.4, revenueM: 596, employees: 2500 },
  { ticker: "SAP", company: "SAP", price: 164.23, pctYTD: -32.28, delta52w: -47.58, marketCapB: 208.2, sbcAnnualM: 1085, sbcPctRevenue: 3.1, revenueM: 35000, employees: 107000 },
  { ticker: "VEEV", company: "Veeva", price: 157.19, pctYTD: -29.64, delta52w: -49.38, marketCapB: 25.7, sbcAnnualM: 312, sbcPctRevenue: 6.8, revenueM: 2588, employees: 10000 },
  { ticker: "ZETA", company: "Zeta", price: 15.20, pctYTD: -26.21, delta52w: -38.96, marketCapB: 3.7, sbcAnnualM: 119, sbcPctRevenue: 18.7, revenueM: 637, employees: 2300 },
  { ticker: "IOT", company: "Samsara", price: 26.71, pctYTD: -25.60, delta52w: -44.83, marketCapB: 15.5, sbcAnnualM: 355, sbcPctRevenue: 25.3, revenueM: 1403, employees: 3700 },
  { ticker: "ADSK", company: "Autodesk", price: 221.03, pctYTD: -25.33, delta52w: -32.84, marketCapB: 46.6, sbcAnnualM: 507, sbcPctRevenue: 9.4, revenueM: 5397, employees: 14000 },
  { ticker: "ADP", company: "ADP", price: 195.51, pctYTD: -23.93, delta52w: -40.73, marketCapB: 78.7, sbcAnnualM: 222, sbcPctRevenue: 1.2, revenueM: 18500, employees: 60000 },
  { ticker: "DDOG", company: "Datadog", price: 109.44, pctYTD: -20.26, delta52w: -45.74, marketCapB: 38.7, sbcAnnualM: 522, sbcPctRevenue: 18.2, revenueM: 2869, employees: 6300 },
  { ticker: "TWLO", company: "Twilio", price: 124.10, pctYTD: -13.13, delta52w: -14.94, marketCapB: 18.8, sbcAnnualM: 244, sbcPctRevenue: 11.8, revenueM: 2068, employees: 6000 },
  { ticker: "NET", company: "Cloudflare", price: 191.56, pctYTD: -3.64, delta52w: -26.32, marketCapB: 67.3, sbcAnnualM: 628, sbcPctRevenue: 17.3, revenueM: 1629, employees: 3800 },
  { ticker: "ZM", company: "Zoom", price: 83.98, pctYTD: -2.67, delta52w: -13.94, marketCapB: 24.7, sbcAnnualM: 266, sbcPctRevenue: 5.9, revenueM: 4527, employees: 7400 },
  { ticker: "SNAP", company: "Snap", price: 7.18, pctYTD: -42.50, delta52w: -54.12, marketCapB: 12.1, sbcAnnualM: 1420, sbcPctRevenue: 27.2, revenueM: 5220, employees: 5000 },
]
