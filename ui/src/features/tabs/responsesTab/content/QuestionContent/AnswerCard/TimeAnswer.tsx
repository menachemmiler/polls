import { FC } from "react";
function parseTimeValue(value: string | number | (string | number)[]) {
  let str = Array.isArray(value) ? value[0] : value;
  if (typeof str === "number") str = String(str);

  if (!str) return { hour: "", minute: "", ampm: "" };

  const timeMatch = String(str).match(
    /^(\d{1,2}):(\d{2})(?:\s*(AM|PM|am|pm))?$/
  );
  if (timeMatch) {
    const [, hour, minute, ampmRaw] = timeMatch;
    const ampm = ampmRaw ? ampmRaw.toUpperCase() : "";
    return { hour, minute, ampm };
  }

  const isoMatch = String(str).match(/T(\d{2}):(\d{2})/);
  if (isoMatch) {
    return { hour: isoMatch[1], minute: isoMatch[2], ampm: "" };
  }

  return { hour: "", minute: "", ampm: "" };
}

const TimeAnswer: FC<{
  value: string | number | (string | number)[];
}> = ({ value }) => {
  const { hour, minute, ampm } = parseTimeValue(value);

  return (
    <div style={{ display: "inline-block" }}>
      <div className="flex gap-5 text-xs text-gray-500 font-medium mb-1">
        <span style={{ minWidth: 26 }}>Time</span>
      </div>
      <div className="flex items-end gap-1.5">
        <span className="flex flex-col items-center" style={{ minWidth: 26 }}>
          <span className="text-base font-normal tracking-wider">
            {minute || "--"}
          </span>
          <span className="block w-full border-b border-gray-300 mt-1"></span>
        </span>
        <span className="mx-0.5 text-lg font-light" style={{ marginBottom: 1 }}>
          :
        </span>
        <span className="flex flex-col items-center" style={{ minWidth: 26 }}>
          <span className="text-base font-normal tracking-wider">
            {hour || "--"}
          </span>
          <span className="block w-full border-b border-gray-300 mt-1"></span>
        </span>
        <span className="mr-3 flex flex-col items-center">
          <span
            className="text-xs font-normal text-gray-600 flex items-center select-none"
            style={{ marginBottom: 1, minWidth: 22 }}
          >
            {ampm ? ampm : <>&nbsp;&nbsp;</>}
            <svg
              width={13}
              height={13}
              style={{ marginLeft: 2, marginBottom: -1 }}
              viewBox="0 0 24 24"
            >
              <path
                d="M7 10l5 5 5-5"
                stroke="#757575"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="block w-full border-b border-transparent mt-1"></span>
        </span>
      </div>
    </div>
  );
};

export default TimeAnswer;
