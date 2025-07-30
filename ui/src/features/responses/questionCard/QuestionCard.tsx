import clsx from "clsx";
import { Question } from "../../../types/survey";
import { MarkdownText } from "../../../components/shared/MarkdownText";

const question = clsx(
  "border",
  "border-gray-300",
  "p-4",
  "bg-white",
  "rounded-lg",
  "shadow-md",
  "overflow-hidden",
  "space-y-2"
);

interface Props {
  children: React.ReactNode;
  curQuestion: Question;
}

const QuestionCard = ({ children, curQuestion }: Props) => {
  return (
    <div className={question}>
      <div className="flex items-start gap-1">
        <h3 className="text-base font-medium text-gray-900">
          <MarkdownText text={curQuestion.title || "שאלה ללא כותרת"} />
        </h3>

        {curQuestion.isRequired && <span className="text-red-500">*</span>}
      </div>

      {curQuestion.description && (
        <p className="text-sm text-gray-500">{curQuestion.description}</p>
      )}

      {children}
    </div>
  );
};

export default QuestionCard;
