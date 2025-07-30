import { FC } from "react";
import { QuestionType } from "../../../../../types/survey";
import CustomRadio from "./CustomRadio";
import CustomCheckbox from "./CustomCheckbox";
import DropDownDisplay from "./DropDownDisplay";
import DateAnswer from "../QuestionContent/AnswerCard/DateAnswer";
import TimeAnswer from "../QuestionContent/AnswerCard/TimeAnswer";
import LinearScaleAnswer from "../QuestionContent/AnswerCard/LinearScaleAnswer";

type Option = { optionId: string; option: string };
type Props = {
  type: QuestionType;
  options?: Option[];
  answer?: string | string[] | number | null;
};

const IndividualOptions: FC<Props> = ({ type, options, answer }) => {
  if (
    type === "MULTIPLE_CHOICE" 
  ) {
    const selected =
      Array.isArray(answer) ? answer : answer != null ? [answer] : [];
    return (
      <div className="flex flex-col gap-2">
        {options?.map((opt) => (
          <label
            key={opt.optionId}
            className="flex items-center gap-2 cursor-default"
          >
            <CustomRadio checked={selected.includes(opt.option)} />

            <span
              className={
                answer === opt.option
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500"
              }
            >
              {opt.option}
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (type === "CHECKBOXES") {
    const selected = Array.isArray(answer) ? answer : [];
    return (
      <div className="flex flex-col gap-2">
        {options?.map((opt) => (
          <label
            key={opt.optionId}
            className="flex items-center gap-2 cursor-default"
          >
            <CustomCheckbox checked={selected.includes(opt.option)} />
            <span
              className={
                selected.includes(opt.option)
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500"
              }
            >
              {opt.option}
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (type === "DROPDOWN") {
    return (
      <DropDownDisplay
        value={
          Array.isArray(answer)
            ? answer.join(", ")
            : typeof answer === "string"
            ? answer
            : typeof answer === "number"
            ? answer.toString()
            : undefined
        }
      />
    );
  }

  if (type === "LINEAR_SCALE") {
  const scaleOptions = options?.map((opt) => opt.option) ?? [];
  const valueStr =
    typeof answer === "number"
      ? String(answer)
      : typeof answer === "string"
      ? answer
      : Array.isArray(answer)
      ? answer.join(", ")
      : ""; // fallback to empty string if null or undefined
  return (
    <div className="w-full">
      <LinearScaleAnswer
        options={scaleOptions}
        value={valueStr}
      />
    </div>
  );
}

  if (type === "SHORT_ANSWER" || type === "PARAGRAPH") {
    return (
      <div className="text-base text-gray-700">
        {answer ? answer : <span className="text-gray-400">(שדה ריק)</span>}
      </div>
    );
  }

  if (type === "DATE") {
    return (
      <DateAnswer
        value={
          Array.isArray(answer)
            ? answer.join(", ")
            : typeof answer === "string"
            ? answer
            : typeof answer === "number"
            ? answer.toString()
            : ""
        }
      />
    );
  }

  if (type === "TIME") {
    return (
      <TimeAnswer
        value={
          Array.isArray(answer)
            ? answer.join(", ")
            : typeof answer === "string"
            ? answer
            : typeof answer === "number"
            ? answer.toString()
            : ""
        }
      />
    );
  }

  return null;
};

export default IndividualOptions;
