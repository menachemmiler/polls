import { FC } from "react";
import { responsesService } from "../../../../../services/responsesService";
import TitleCard from "./TitleCard";
import IndividualQuestionCard from "./IndividualQuestionCard";
import { useSurveyData } from "../../../../../context/responsesContext";
import { QuestionType } from "../../../../../types/statisticsType";

type Props = {
  selectedIdx: number;
  setSelectedIdx: (idx: number) => void;
  responders: { respondentId: string; mail: string; name: string }[];
};

const IndividualContent: FC<Props> = ({
  responders,
  selectedIdx,
}) => {
  // משוך מהקונטקסט הכל (ולא מה־poll prop!)
  const surveyData = useSurveyData();

  const pollId = surveyData?.pollId;
  const pollTitle = surveyData?.pollTitle;
  const pollDescription = surveyData?.pollDescription;
  const sections = surveyData?.sections ?? [];

  const respondentId = responders[selectedIdx]?.respondentId;
  const response =
    pollId && respondentId
      ? responsesService.useGetUserResponse(pollId, respondentId)
      : undefined;

  // שאלות שטוחות (flat) – כל השאלות מכל הסקשנים
  const allQuestions = sections.flatMap((section) => section.questions);

  const answers =
    Array.isArray(response?.data) &&
    response.data[0] &&
    typeof response.data[0] === "object" &&
    "answers" in response.data[0]
      ? (
          response.data[0] as {
            answers: { questionId: string; answer: unknown }[];
          }
        ).answers
      : [];

  return (
    <div>
      <TitleCard title={pollTitle} description={pollDescription} />
      <div className="flex flex-col gap-4 mt-4">
        {allQuestions.map((q, idx) => {
          const answerObj = answers.find((a) => a.questionId === q.questionId);
          // התאמת הפורמט של התשובה – תמיד החזר פשוט
          const answer =
            Array.isArray(answerObj?.answer) && answerObj.answer.length === 1
              ? answerObj.answer[0]
              : answerObj?.answer;
          // הצג IndividualQuestionCard עם האופציות המתאימות
          return (
            <IndividualQuestionCard
              key={q.questionId || idx}
              title={q.questionTitle}
              type={q.type as QuestionType}
              options={
                q.optionAnswerCounts?.map(opt => ({
                  optionId: opt.option,
                  option: opt.option,
                })) || []
              }
              answer={answer}
            />
          );
        })}
      </div>
    </div>
  );
};

export default IndividualContent;
