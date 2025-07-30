import React, { useEffect, useState } from "react";
import ContentCard from "../ContentCard";
import { QuestionType } from "../../../../../types/statisticsType";

const SHOW_OPTIONS_TYPES: QuestionType[] = [
  QuestionType.MULTIPLE_CHOICE,
  QuestionType.CHECKBOXES,
  QuestionType.DROPDOWN,
];

type Props = {
  question: string;
  options?: string[];
  type: QuestionType;
  children?: React.ReactNode;
};

const QuestionCard: React.FC<Props> = ({
  question,
  options,
  type,
  children,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setShowOptions(false);
  }, [question]);

  const shouldShowOptions =
    SHOW_OPTIONS_TYPES.includes(type) && !!options && options.length > 0;

  const renderOptions = () => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
        return options!.map((opt, i) => (
          <label key={i} className="flex items-center gap-2 cursor-default">
            <input type="radio" disabled className="accent-[#1a73e8] w-5 h-5" />
            <span className="text-gray-400">{opt}</span>
          </label>
        ));
      case QuestionType.CHECKBOXES:
        return options!.map((opt, i) => (
          <label key={i} className="flex items-center gap-2 cursor-default">
            <input
              type="checkbox"
              disabled
              className="accent-[#1a73e8] w-5 h-5"
            />
            <span className="text-gray-400">{opt}</span>
          </label>
        ));
      case QuestionType.DROPDOWN:
        return (
          <ol className="flex flex-col gap-2 mr-6 list-decimal">
            {options!.map((opt, i) => (
              <li key={i} className="text-gray-800 pr-3">
                {opt}
              </li>
            ))}
          </ol>
        );
      default:
        return null;
    }
  };

  return (
    <ContentCard>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900 text-base">{question}</span>
        {shouldShowOptions ? (
          <button
            className="text-[#1a73e8] font-normal text-sm flex items-center gap-1 hover:underline"
            onClick={() => setShowOptions((v) => !v)}
          >
            {showOptions ? "Hide options" : "View options"}
            <svg
              className={`w-5 h-5 transition-transform ${
                showOptions ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="#1a73e8"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        ) : null}
      </div>
      {showOptions && shouldShowOptions && (
        <div className="mt-4 flex flex-col gap-2">{renderOptions()}</div>
      )}
      {children}
    </ContentCard>
  );
};

export default QuestionCard;
