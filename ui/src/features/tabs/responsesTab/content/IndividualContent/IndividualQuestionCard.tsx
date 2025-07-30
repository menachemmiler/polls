import { FC } from "react";
import ContentCard from "../ContentCard";
import { QuestionType } from "../../../../../types/survey";
import IndividualOptions from "./IndividualOptions";

type Props = {
  title?: string;
  type: QuestionType
  options?: { optionId: string; option: string }[];
  answer: string | string[] | number | null;
};


const IndividualQuestionCard: FC<Props> = ({ title, options, type, answer }) => {
  return (
    <ContentCard className="mb-4">
      <div className="mb-2">
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      <IndividualOptions options={options} type={type} answer={answer} />
    </ContentCard>
  );
};

export default IndividualQuestionCard;
