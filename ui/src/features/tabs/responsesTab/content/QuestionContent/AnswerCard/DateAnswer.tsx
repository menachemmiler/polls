import { FC } from "react";

function parseDateValue(value: string | number | (string | number)[]) {
  let str = Array.isArray(value) ? value[0] : value;
  if (typeof str === "number") str = String(str);
  // פורמט צפי: "2025-07-10" או "10/07/2025" או דומה
  if (!str) return { day: "", month: "", year: "" };
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    // פורמט YYYY-MM-DD
    const [year, month, day] = str.split("-");
    return { day, month, year };
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    // פורמט DD/MM/YYYY
    const [day, month, year] = str.split("/");
    return { day, month, year };
  }
  return { day: "", month: "", year: "" };
}

const DateAnswer: FC<{ value: string | number | (string | number)[] }> = ({
  value,
}) => {
  const { day, month, year } = parseDateValue(value);

  const parts = [year, month, day];

  return (
    <div style={{ display: "inline-block" }}>
      <div className="flex gap-6 text-xs text-gray-500 font-medium mb-2">
        <span style={{ minWidth: 36 }}>YYYY</span>
        <span style={{ minWidth: 26 }}>MM</span>
        <span style={{ minWidth: 26 }}>DD</span>
      </div>
      <div className="flex gap-2 text-base font-normal items-end">
        {parts
          .map((part, idx) => (
            <span
              key={idx}
              className="flex flex-col items-center"
              style={{ minWidth: idx === 2 ? 36 : 26 }}
            >
              <span className="font-normal tracking-wider">{part || "--"}</span>
              <span className="block w-full border-b border-gray-300 mt-1"></span>
            </span>
          ))
          .reduce<React.ReactNode[]>(
            (prev, curr, idx) =>
              idx < parts.length - 1
                ? [
                    ...prev,
                    curr,
                    <span
                      key={`sep-${idx}`}
                      className="mx-1 text-l font-normal"
                    >
                      /
                    </span>,
                  ]
                : [...prev, curr],
            []
          )}
      </div>
    </div>
  );
};

export default DateAnswer;
