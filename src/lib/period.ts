export type Period = "This year" | "Last quarter" | "Last month";

export const PERIODS: Period[] = ["This year", "Last quarter", "Last month"];

// The seeded demo data is anchored to a fixed "today" rather than the real
// system clock (matching the hardcoded "2026-07" month checks already used
// elsewhere in this data set) — otherwise every period filter would come up
// empty on a machine whose real clock isn't sitting inside 2026.
const TODAY = new Date(2026, 6, 19);

export function periodStart(period: Period): Date {
  const start = new Date(TODAY);
  switch (period) {
    case "Last month":
      start.setDate(start.getDate() - 30);
      return start;
    case "Last quarter":
      start.setDate(start.getDate() - 90);
      return start;
    case "This year":
    default:
      return new Date(TODAY.getFullYear(), 0, 1);
  }
}

export function isWithinPeriod(isoDate: string, period: Period): boolean {
  const d = new Date(isoDate);
  return d >= periodStart(period) && d <= TODAY;
}

export function periodLabel(period: Period): string {
  switch (period) {
    case "Last month":
      return "last month";
    case "Last quarter":
      return "last quarter";
    case "This year":
      return "this year";
  }
}

export const DEALS_WON_TARGET: Record<Period, number> = {
  "Last month": 5,
  "Last quarter": 15,
  "This year": 30,
};
