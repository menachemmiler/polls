import { FC, useEffect } from "react";
import NumberSpinner from "../shered/NumberSpinner";

type Responder = {
  respondentId: string;
  name: string;
  mail: string;
};
type Props = {
  pollId: string;
  responders: Responder[];
  selectedIdx: number;
  setSelectedIdx: React.Dispatch<React.SetStateAction<number>>;
};

const IndividualSelector: FC<Props> = ({
  responders,
  selectedIdx,
  setSelectedIdx,
}) => {
  const minIdx = 1;
  const maxIdx = responders.length;
  const storageKey = `responder-selected-idx-${responders
    .map((r) => r.respondentId)
    .join("-")}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setSelectedIdx(Number(stored));
  }, [storageKey, setSelectedIdx]);

  useEffect(() => {
    localStorage.setItem(storageKey, String(selectedIdx));
  }, [selectedIdx, storageKey]);

  const setResponderIdx = (val: number) => {
    setSelectedIdx(Math.max(0, Math.min(responders.length - 1, val - 1)));
  };

  return (
    <div className="flex flex-row flex-wrap gap-3 items-start rtl">
      <div className="relative flex-1 min-w-55 max-w-[260px]">
        <select
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
          className="
            w-full border border-gray-300 rounded
            bg-white px-3 py-2
            text-base text-gray-900
            focus:ring-2 focus:ring-[#6f36b8] focus:border-[#6f36b8]
            transition
            appearance-none pr-8 shadow-sm cursor-pointer
            truncate
          "
          dir="rtl"
        >
          {responders.map((responder, idx) => (
            <option
              key={responder.respondentId}
              value={idx}
              className="truncate"
            >
              {responder.name
                ? `${responder.name}${
                    responder.mail ? " (" + responder.mail + ")" : ""
                  }`
                : responder.mail || responder.respondentId}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setResponderIdx(selectedIdx)}
          disabled={selectedIdx === 0}
          aria-label="previous"
          className="
            w-7 h-7 flex items-center justify-center
            rounded-full text-gray-500 hover:bg-gray-100
            disabled:opacity-30 transition
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <NumberSpinner
          value={selectedIdx + 1}
          min={minIdx}
          max={maxIdx}
          onChange={setResponderIdx}
        />
        <span className="mx-1 text-[15px] text-gray-600 select-none">מתוך</span>
        <span className="mx-1 text-[16px] text-gray-900 font-medium">
          {responders.length}
        </span>
        <button
          onClick={() => setResponderIdx(selectedIdx + 2)}
          disabled={selectedIdx === responders.length - 1}
          aria-label="next"
          className="
            w-7 h-7 flex items-center justify-center
            rounded-full text-gray-500 hover:bg-gray-100
            disabled:opacity-30 transition
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default IndividualSelector;
