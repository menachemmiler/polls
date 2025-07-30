import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "../hooks/useApiMutation";
import { useApiQuery } from "../hooks/useAxiosQuery";
import { toastService } from "./toastService";
import {
  CanResponsePoll,
  CreateQuestionDTO,
  CreateSectionDTO,
  DeletePollDTO,
  DeleteQuestionDTO,
  IPoll,
  IPollsResponse,
  IResponse,
  NewResponseDTO,
  PublishPollDTO,
  Question,
  UpdatePollDTO,
  UpdateQuestionDTO,
  UpdateRespondableDTO,
} from "../types/survey";

export const pollService = {
  useGetMyPolls(enabled = true) {
    return useApiQuery<IPollsResponse>({
      queryKey: ["getMyPolls"],
      url: "/polls/getMyPolls",
      enabled,
    });
  },

  GetPoll(pollId: string) {
    return useApiQuery<IPoll>({
      queryKey: ["getPoll", pollId],
      url: `/polls/${pollId}`,
    });
  },

  useUpdateSection(
    onSuccess?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<
      IPoll,
      {
        pollId: string;
        sectionId: string;
        data: { title?: string; description?: string };
      }
    >({
      url: ({ pollId, sectionId }) => `/polls/${pollId}/section/${sectionId}`,
      method: "put",
      transformBody: ({ data }) => data,
      onSuccess,
      onError,
    });
  },
  useCanResponsePoll(pollId: string) {
    return useApiQuery<CanResponsePoll>({
      queryKey: ["canResponsePoll", pollId],
      url: `/response/canRespond/${pollId}`,
    });
  },

  useDeleteSection(
    onSuccess?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<IPoll, { pollId: string; sectionId: string }>({
      url: ({ pollId, sectionId }) => `/polls/section/${pollId}/${sectionId}`,
      method: "delete",
      onSuccess,
      onError,
    });
  },

  useCheckIfPublished(pollId: string, enabled = true) {
    return useApiQuery<boolean>({
      queryKey: ["checkIfPublished", pollId],
      url: `/permissions/ispublished/${pollId}`,
      enabled,
    });
  },

  useCreatePoll(
    onSuccess?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<IPoll>({
      url: "/polls",
      method: "post",
      onSuccess,
      onError,
    });
  },

  useCreateSection(
    onSuccess?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<IPoll, CreateSectionDTO>({
      url: ({ pollId }) => `/polls/addsection/${pollId}`,
      method: "post",
      onSuccess,
      onError,
    });
  },

  useCopySection(
    onSuccess?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<IPoll, { pollId: string; sectionId: string }>({
      url: ({ pollId, sectionId }) =>
        `/polls/section/${pollId}/copy/${sectionId}`,
      method: "post",
      onSuccess,
      onError,
    });
  },

  useAddQuestion(
    onSuccess?: (d: Question) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<Question, CreateQuestionDTO>({
      url: "/questions",
      method: "post",
      transformBody: ({ data }) => data,
      onSuccess,
      onError,
    });
  },

  useDeletePoll(
    onSuccessExternal?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    const queryClient = useQueryClient();

    return useApiMutation<IPoll, DeletePollDTO>({
      url: ({ pollId }) => `/polls/${pollId}`,
      method: "delete",
      onSuccess: (deletedPoll: IPoll) => {
        onSuccessExternal?.(deletedPoll);
        toastService.success(`הטופס "${deletedPoll.name ?? ""}" נמחק בהצלחה`);
        const removedId = deletedPoll._id;
        queryClient.setQueryData<IPollsResponse>(["getMyPolls"], (old) => {
          if (!old) return old;
          const keep = (list: IPoll[]) =>
            list.filter((p) => p._id !== removedId);
          return {
            ...old,
            owner: keep(old.owner),
            editor: keep(old.editor),
          };
        });
        queryClient.removeQueries({ queryKey: ["getPoll", removedId] });
      },
      onError,
    });
  },

  useDeleteQuestion(
    onSuccess?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<IPoll, DeleteQuestionDTO>({
      url: ({ data }) => `/questions/${data.questionId}`,
      method: "delete",
      onSuccess,
      onError,
    });
  },

  useUpdateQuestion(
    onSuccess?: (d: Question) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<Question, UpdateQuestionDTO>({
      url: ({ questionId }) => `/questions/${questionId}`,
      method: "put",
      transformBody: ({ data }) => data,
      onSuccess,
      onError,
    });
  },

  useReorderQuestion(onSuccess?: () => void, onError?: (e: unknown) => void) {
    return useApiMutation<
      void,
      { pollId: string; sectionId: string; questionId: string; index: number }
    >({
      url: ({ pollId, sectionId, questionId, index }) =>
        `/polls/question/${pollId}/reorder-questions?sectionId=${sectionId}&questionId=${questionId}&index=${index}`,
      method: "put",
      transformBody: () => ({}),
      onSuccess,
      onError,
    });
  },

  useReorderSections(onSuccess?: () => void, onError?: (e: unknown) => void) {
    return useApiMutation<
      void,
      { pollId: string; sectionId: string; index: number }
    >({
      url: ({ pollId, sectionId, index }) =>
        `/polls/section/${pollId}/reorder-sections?sectionId=${sectionId}&index=${index}`,
      method: "put",
      transformBody: () => ({}),
      onSuccess,
      onError,
    });
  },

  usePublishPoll(
    onSuccess?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<IPoll, PublishPollDTO>({
      url: ({ pollId }) => `/permissions/publish/${pollId}`,
      method: "put",
      onSuccess,
      onError,
    });
  },
  useAddQuestionToPoll(
    onSuccess?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<
      IPoll,
      {
        pollId: string;
        sectionId: string;
        questionId: string;
        index: number;
      }
    >({
      url: "/polls/question",
      method: "put",
      onSuccess,
      onError,
    });
  },
  useUpdatePoll(
    onSuccessExternal?: (d: IPoll) => void,
    onError?: (e: unknown) => void
  ) {
    const queryClient = useQueryClient();

    return useApiMutation<IPoll, UpdatePollDTO>({
      url: ({ pollId }) => `/polls/${pollId}`,
      method: "put",
      transformBody: ({ data }) => data,
      onSuccess: (updated) => {
        onSuccessExternal?.(updated);
        queryClient.setQueryData<IPollsResponse>(["getMyPolls"], (old) => {
          if (!old) return old;
          const patch = (list: IPoll[]) =>
            list.map((p) => (p._id === updated._id ? { ...p, ...updated } : p));
          return {
            ...old,
            owner: patch(old.owner),
            editor: patch(old.editor),
          };
        });
        queryClient.invalidateQueries({ queryKey: ["getPoll", updated._id] });
      },
      onError,
    });
  },

  useResponsePoll(
    onSuccess?: (d: IResponse) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<IResponse, NewResponseDTO>({
      url: "/response",
      method: "post",
      transformBody: ({ data }) => data,
      onSuccess,
      onError,
    });
  },

  useRespondablePoll(
    onSuccess?: (d: IResponse) => void,
    onError?: (e: unknown) => void
  ) {
    return useApiMutation<IResponse, UpdateRespondableDTO>({
      url: ({ pollId }) => `/permissions/respondable/${pollId}`,
      method: "put",
      transformBody: ({ data }) => data,
      onSuccess,
      onError,
    });
  },
};
