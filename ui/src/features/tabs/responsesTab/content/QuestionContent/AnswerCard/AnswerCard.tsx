import { FC } from "react";
import ContentCard from "../../ContentCard";
import { AnswerContent } from "./AnswerContent";
import { AnswerFooter } from "./AnswerFooter";
import { QuestionType } from "../../../../../../types/statisticsType";

interface AnswerCardProps {
  type: QuestionType;
  answer: string | number | (string | number)[];
  count: number;
  options?: string[];
  isBlank?: boolean;
}

const AnswerCard: FC<AnswerCardProps> = ({
  type,
  answer,
  count,
  options,
  isBlank,
}) => (
  <ContentCard>
    <div className=" mb-6">
      <AnswerContent
        type={type}
        answer={answer}
        options={options}
        isBlank={isBlank}
      />
    </div>
    <AnswerFooter count={count} />
  </ContentCard>
);

export default AnswerCard;
