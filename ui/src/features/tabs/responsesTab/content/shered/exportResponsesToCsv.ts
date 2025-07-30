import { saveAs } from "file-saver";

interface Answer {
  questionId: string;
  value: string | string[];
}

interface Responder {
  name?: string | { firstName?: string; lastName?: string };
  mail?: string;
  answers?: Answer[];
  timeStamp?: string;
}

interface Option {
  optionId: string;
  option: string;
}

interface Question {
  questionId: string;
  questionTitle?: string;
  options?: Option[]; 
}

function formatDateWithAmPmAndZone(dateIso: string): string {
  if (!dateIso) return "";
  const date = new Date(dateIso);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short", 
  };
  return date.toLocaleString("en-GB", options);
}

export function exportResponsesToCsv({
  responders,
  allQuestions,
  pollId,
}: {
  responders: Responder[];
  allQuestions: Question[];
  pollId: string;
}) {
  const headers = [
    "מועד הגשה",
    "שם משיב",
    "מייל",
    ...allQuestions.map(
      (q, i) => q.questionTitle?.replace(/"/g, '""') || `שאלה ${i + 1}`
    ),
  ];

  const rows = responders.map((responder: Responder, idx: number) => {
    let name = responder.name;
    if (!name) name = responder.mail || `משיב ${idx + 1}`;
    if (typeof name === "object") {
      name =
        (name.firstName ? name.firstName : "") +
        (name.lastName ? " " + name.lastName : "");
    }

    const submittedAtIso = responder.timeStamp || "";
    const submittedAt = formatDateWithAmPmAndZone(submittedAtIso);

    const answers = allQuestions.map((q) => {
      const ansObj = responder.answers?.find?.(
        (a: Answer) => a.questionId === q.questionId
      );
      let value = ansObj?.value;

      if (Array.isArray(value)) value = value.join(", ");

      // כאן תוכל להמיר מזהי אופציה (אם value=optionId) לטקסט
      // לדוג':
      // if (q.options && typeof value === "string") {
      //   const opt = q.options.find(opt => opt.optionId === value);
      //   value = opt ? opt.optionText : value;
      // }

      if (typeof value === "string") value = value.replace(/"/g, '""');
      return value ?? "";
    });

    return [
      submittedAt,
      typeof name === "string" ? name.replace(/"/g, '""') : name,
      responder.mail ?? "",
      ...answers,
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.map((val) => `"${val ?? ""}"`).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  saveAs(blob, `responses-${pollId}.csv`);
}
