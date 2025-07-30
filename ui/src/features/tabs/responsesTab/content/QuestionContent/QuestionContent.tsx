import { FC } from "react";
import QuestionAnswersList from "./QuestionAnswersList";
import QuestionCard from "./QuestionCard";
import { QuestionType } from "../../../../../types/statisticsType";
import { responsesService } from "../../../../../services/responsesService";

type QuestionStat = {
  questionId: string;
  questionTitle?: string;
  type: QuestionType;
  totalAnswers: number; // העדכון כאן: בשם, שיהיה כמו בקונטקסט
  optionAnswerCounts: { option: string; count: number }[];
};

type Props = {
  selectedIdx: number;
  setSelectedIdx: (idx: number) => void;
  allQuestions: QuestionStat[];
};

const QuestionContent: FC<Props> = ({ selectedIdx, allQuestions }) => {
  const questions = allQuestions || [];
  const question = questions[selectedIdx];

  // האופציות מתוך optionAnswerCounts
  const options = question?.optionAnswerCounts?.map(opt => opt.option) || [];

  return (
    <div>
      <QuestionCard
        question={question?.questionTitle ?? ""}
        options={options}
        type={question?.type as QuestionType}
      />
      <QuestionAnswersList
        questionId={question?.questionId}
        questionTitle={question?.questionTitle}
        type={question?.type as QuestionType}
        options={options}
        getAnswersByQuestionId={(questionId: string) => {
          const query = responsesService.useGetAnswersByQuestionId(questionId);
          return query.data ?? [];
        }}
      />
    </div>
  );
};

export default QuestionContent;
