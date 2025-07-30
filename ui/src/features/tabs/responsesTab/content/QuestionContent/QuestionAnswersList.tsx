import React from "react";
import AnswerCard from "./AnswerCard/AnswerCard";
import { QuestionType } from "../../../../../types/statisticsType";

type AnswerValue = string | number | (string | number)[];
type AnswerItem = { answer: AnswerValue } | AnswerValue;

type Props = {
  questionId: string;
  getAnswersByQuestionId: (questionId: string) => AnswerItem[];
  questionTitle?: string;
  questionOptions?: string[];
  type: QuestionType;
  options?: string[];
};

const serializeAnswer = (answer: AnswerValue) => {
  if (Array.isArray(answer)) {
    return answer.slice().sort().join(", ");
  }
  return String(answer ?? "").trim();
};

const QuestionAnswersList: React.FC<Props> = ({
  questionId,
  getAnswersByQuestionId,
  type,
  options,
}) => {
  const answersRaw = getAnswersByQuestionId(questionId);

  const answers = (Array.isArray(answersRaw) ? answersRaw : []).map((item) => {
    if (item && typeof item === "object" && "answer" in item) {
      return item.answer;
    }
    return item;
  });

  const answerMap: Record<string, { answer: AnswerValue; count: number }> = {};

  answers.forEach((ans) => {
    const key = serializeAnswer(ans);
    if (!key) return;
    if (answerMap[key]) {
      answerMap[key].count++;
    } else {
      answerMap[key] = { answer: ans, count: 1 };
    }
  });

  const uniqueAnswers = Object.values(answerMap);

  return (
    <div className="flex flex-col gap-3">
      {uniqueAnswers.length === 0 ? (
        <AnswerCard answer="" isBlank type={type} count={0} />
      ) : (
        uniqueAnswers.map(({ answer, count }, idx) => (
          <AnswerCard
            key={
              typeof answer === "string" ? answer : JSON.stringify(answer) + idx
            }
            answer={answer}
            isBlank={!answer || (Array.isArray(answer) && answer.length === 0)}
            type={type}
            count={count}
            options={options}
          />
        ))
      )}
    </div>
  );
};

export default QuestionAnswersList;
