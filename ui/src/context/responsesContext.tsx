import { createContext, useContext, useMemo } from "react";
import { usePoll } from "./PollContext";
import { responsesService } from "../services/responsesService";
import { IPoll } from "../types/survey";
import { QuestionType } from "../types/statisticsType";

type QuestionStat = {
  questionId: string;
  questionTitle?: string;
  type: QuestionType;
  totalAnswers: number;
  optionAnswerCounts: { option: string; count: number }[];
};
type Responder = {
  respondentId: string;
  name: string;
  mail: string;
  timeStamp: string;
};

interface OrganizedSurveyData {
  pollId: string;
  pollName: string;
  pollTitle: string;
  pollDescription: string;
  isAnonymous: boolean;
  sections: {
    sectionId: string;
    sectionTitle: string;
    questions: QuestionStat[];
  }[];
  responders: Responder[];
}

const SurveyDataContext = createContext<OrganizedSurveyData | null>(null);

export const SurveyDataProvider = ({
  children,
  pollId,
}: {
  children: React.ReactNode;
  pollId: string;
}) => {
  const poll = usePoll().poll as IPoll; 
  const responders = responsesService.useGetResponders(pollId);
  const statistics = responsesService.useGetStatistics(pollId);

  const value = useMemo(() => {
    if (!statistics.data || !responders.data) return null;

    const statsByQuestionId: Record<string, QuestionStat> = {};
    const statsArr =
      Array.isArray(statistics.data) &&
      typeof statistics.data[0] === "object" &&
      statistics.data[0] !== null &&
      "questionStats" in statistics.data[0]
        ? (statistics.data as unknown as { questionStats: QuestionStat[] }[])
        : [];
    if (
      statsArr.length > 0 &&
      typeof statsArr[0] === "object" &&
      statsArr[0] !== null &&
      "questionStats" in statsArr[0]
    ) {
      for (const stat of statsArr[0].questionStats || []) {
        statsByQuestionId[stat.questionId] = stat;
      }
    }

    const rawRespondersArr =
      responders.data &&
      typeof responders.data === "object" &&
      "respondentIds" in responders.data &&
      Array.isArray(
        (responders.data as { respondentIds: string[] }).respondentIds
      )
        ? (responders.data as { respondentIds: string[] }).respondentIds
        : Array.isArray(responders.data)
        ? responders.data
        : [];

    const respondersList: Responder[] = (() => {
      if (rawRespondersArr.length) {
        if (
          typeof rawRespondersArr[0] === "object" &&
          rawRespondersArr[0] !== null
        ) {
          return (
            rawRespondersArr as Array<{
              respondentId?: string;
              id?: string;
              name?: string;
              mail?: string;
              timeStamp?: string;
            }>
          ).map((r) => ({
            respondentId: r.respondentId ?? r.id ?? "",
            name: r.name ?? "",
            mail: r.mail ?? "",
            timeStamp: r.timeStamp ?? "",
          }));
        } else if (typeof rawRespondersArr[0] === "string") {
          return (rawRespondersArr as string[]).map((id) => ({
            respondentId: id,
            name: "",
            mail: "",
            timeStamp: "",
          }));
        }
      }
      return [];
    })();

    const organizedSurveyData: OrganizedSurveyData = {
      pollId: poll._id,
      pollName: poll.name ?? "",
      pollTitle: poll.title ?? "",
      pollDescription: poll.description ?? "",
      isAnonymous: poll.isAnonymous ?? false,
      sections: poll.sections.map((section) => ({
        sectionId: section._id,
        sectionTitle: section.title,
        questions: section.questions.map((q) => {
          const stat = statsByQuestionId[q._id] || {
            questionId: q._id,
            type: q.type as QuestionType,
            totalAnswers: 0,
            optionAnswerCounts: [],
          };
          return {
            questionId: q._id,
            questionTitle: q.title,
            type: q.type as QuestionType,
            totalAnswers: stat.totalAnswers,
            optionAnswerCounts: stat.optionAnswerCounts,
          };
        }),
      })),
      responders: respondersList,
    };

    return organizedSurveyData;
  }, [poll, statistics.data, responders.data]);

  return (
    <SurveyDataContext.Provider value={value}>
      {children}
    </SurveyDataContext.Provider>
  );
};

export const useSurveyData = (): OrganizedSurveyData | null => {
  return useContext(SurveyDataContext);
};
