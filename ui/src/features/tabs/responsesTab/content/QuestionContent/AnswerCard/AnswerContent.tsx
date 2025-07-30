import { FC } from "react";
import { QuestionType } from "../../../../../../types/statisticsType";
import DateAnswer from "./DateAnswer";
import TimeAnswer from "./TimeAnswer";
import LinearScaleAnswer from "./LinearScaleAnswer";

type Props = {
  type: QuestionType;
  answer: string | number | (string | number)[] | null | undefined;
  options?: string[];
  question?: string;
  isBlank?: boolean;
};

export const AnswerContent: FC<Props> = ({ type, answer, isBlank, options }) => {
  if (isBlank) {
    return <i className="text-gray-400">Question left blank</i>;
  }

  switch (type) {
    case QuestionType.SHORT_ANSWER:
      return <span style={{ fontSize: "1.2rem" }}>{answer}</span>;
    case QuestionType.PARAGRAPH:
      return <span style={{ fontSize: "0.9rem" }}>{answer}</span>;
    case QuestionType.DROPDOWN:
      return <span>{answer}</span>;
    case QuestionType.DATE:
      return <DateAnswer value={answer ?? ""} />;
    case QuestionType.TIME:
      return <TimeAnswer value={answer ?? ""} />;
    case QuestionType.MULTIPLE_CHOICE:
      return (
        <div className="flex items-center">
          <RadioIcon />
          <span className="mr-2 text-gray-400">{answer}</span>
        </div>
      );
    case QuestionType.LINEAR_SCALE:
      return <LinearScaleAnswer value={answer ?? ""} options={options} />;

    case QuestionType.CHECKBOXES:
      if (Array.isArray(answer)) {
        return (
          <div className="flex flex-col gap-1">
            {answer.map((val, idx) => (
              <div className="flex items-center" key={idx}>
                <CheckboxIcon />
                <span className="mr-2 text-gray-400">{val}</span>
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="flex items-center">
          <CheckboxIcon />
          <span className="mr-2 text-gray-400">{answer}</span>
        </div>
      );

    default:
      return <span>{answer}</span>;
  }
};

const RadioIcon = () => (
  <svg
    width="23"
    height="23"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#757575"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" fill="#757575" />
  </svg>
);

const CheckboxIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect x="3" y="3" width="20" height="20" rx="4" fill="#6d6e71" />
    <path d="M6 13L11 17L19 8" stroke="#fff" strokeWidth="1.8" fill="none" />
  </svg>
);
