export interface ParsedDates {
  month: string;
  year: number;
  days: number[];
}

const monthNames = [
  "",
  "ינו׳",
  "פבר׳",
  "מרץ",
  "אפר׳",
  "מאי",
  "יונ׳",
  "יול׳",
  "אוג׳",
  "ספט׳",
  "אוק׳",
  "נוב׳",
  "דצמ׳",
];

export function parseDateOptions(options: { option: string }[]): ParsedDates[] {
  if (!options.length) return [];
  const map = new Map<
    string,
    { year: number; month: number; days: number[] }
  >();
  for (const { option } of options) {
    const [year, month, day] = option.split("-");
    const key = `${year}-${month}`;
    if (!map.has(key)) {
      map.set(key, { year: Number(year), month: Number(month), days: [] });
    }
    map.get(key)!.days.push(Number(day));
  }
  return Array.from(map.values())
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map((x) => ({
      year: x.year,
      month: monthNames[x.month],
      days: x.days,
    }));
}
