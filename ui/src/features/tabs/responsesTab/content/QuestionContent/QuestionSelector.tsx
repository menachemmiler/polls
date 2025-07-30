import { FC, useEffect } from "react";
import NumberSpinner from "../shered/NumberSpinner";

type QuestionStat = {
  questionId: string;
  type: string;
  totalResponses: number;
  optionAnswerCounts: { option: string; count: number }[];
  title?: string; // אם קיים, תשתמש בו
};

type Props = {
  allQuestions: QuestionStat[];
  selectedIdx: number;
  setSelectedIdx: React.Dispatch<React.SetStateAction<number>>;
};

const getStorageKey = (allQuestions: QuestionStat[]) =>
  `question-selected-idx-${allQuestions.map((q) => q.questionId).join("-")}`;

const QuestionSelector: FC<Props> = ({
  allQuestions,
  selectedIdx,
  setSelectedIdx,
}) => {
  const minIdx = 1;
  const maxIdx = allQuestions.length;
  const storageKey = getStorageKey(allQuestions);

  // שליפת ערך מה-storage בהעלאה
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setSelectedIdx(Number(stored));
  }, [storageKey, setSelectedIdx]);

  // שמירת ערך ב-storage כל שינוי
  useEffect(() => {
    localStorage.setItem(storageKey, String(selectedIdx));
  }, [selectedIdx, storageKey]);

  const setQuestionIdx = (val: number) => {
    setSelectedIdx(Math.max(0, Math.min(allQuestions.length - 1, val - 1)));
  };

  return (
    <div className="flex flex-row flex-wrap gap-3 items-start rtl w-full">
      <div className="relative flex-1 min-w-[170px] max-w-[230px]">
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
          {allQuestions.map((q, idx) => (
            <option key={q.questionId} value={idx} className="truncate">
              {q.title || `שאלה ${idx + 1}`}
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
          onClick={() => setQuestionIdx(selectedIdx)}
          disabled={selectedIdx === 0}
          className="
            w-7 h-7 flex items-center justify-center
            rounded-full text-gray-500 hover:bg-gray-100
            disabled:opacity-30 transition
          "
          aria-label="previous"
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
          onChange={setQuestionIdx}
        />
        <span className="mx-1 text-[15px] text-gray-600 select-none">מתוך</span>
        <span className="mx-1 text-[16px] text-gray-900 font-medium">
          {allQuestions.length}
        </span>
        <button
          onClick={() => setQuestionIdx(selectedIdx + 2)}
          disabled={selectedIdx === allQuestions.length - 1}
          className="
            w-7 h-7 flex items-center justify-center
            rounded-full text-gray-500 hover:bg-gray-100
            disabled:opacity-30 transition
          "
          aria-label="next"
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
          </svg>{" "}
        </button>
      </div>
    </div>
  );
};

export default QuestionSelector;
