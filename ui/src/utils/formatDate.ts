import { IPoll } from "../types/survey";

export const formatDate = (date: Date) => {
  return new Date(date || "").toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const categorizePollByDate = (poll: IPoll): string => {
  const now = new Date();
  const updated = new Date(poll.updatedAt ?? poll.createdAt ?? now);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const isLastMonth =
    (now.getMonth() === 0 &&
      updated.getMonth() === 11 &&
      now.getFullYear() - updated.getFullYear() === 1) ||
    (now.getMonth() - updated.getMonth() === 1 &&
      now.getFullYear() === updated.getFullYear());

  if (updated >= startOfToday) return "היום";
  if (updated >= startOfWeek) return "השבוע";
  if (isLastMonth) return "חודש שעבר";
  if (updated.getFullYear() === now.getFullYear()) return "מוקדם יותר השנה";
  if (updated.getFullYear() === now.getFullYear() - 1) return "שנה שעברה";
  return "מוקדם יותר";
};

