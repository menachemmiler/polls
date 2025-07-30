import { useApiQuery } from "../hooks/useAxiosQuery";

export const responsesService = {
  useGetAnswersByQuestionId: (questionId: string) => {
    return useApiQuery<string[]>({
      queryKey: ["getAnswersByQuestionId", questionId],
      url: `/response/question/${questionId}`,
    });
  },

  useGetStatistics: (pollId: string) => {
    return useApiQuery<string[]>({
      queryKey: ["getStatistics", pollId],
      url: `/statistics/${pollId}`,
    });
  },

  useGetUserResponse: (pollId: string, userId: string) => {
    return useApiQuery<string[]>({
      queryKey: ["getUserResponse", pollId, userId],
      url: `/response?pollId=${pollId}&respondentId=${userId}`,
    });
  },

  useGetResponders: (pollId: string) => {
    return useApiQuery<string[]>({
      queryKey: ["getResponders", pollId],
      url: `/response/respondents/${pollId}`,
    });
  }
};