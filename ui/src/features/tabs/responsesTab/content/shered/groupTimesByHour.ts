export function groupTimesByHour(
  optionAnswerCounts: { option: string; count: number }[]
) {
  const map: Record<string, string[]> = {};
  for (const { option, count } of optionAnswerCounts) {
    const [hour, minute] = option.split(":");
    if (!map[hour]) map[hour] = [];
    for (let i = 0; i < count; i++) {
      map[hour].push(minute);
    }
  }
  return map;
}
