// import { pollService } from "../../../../../services/pollService";
// import { usePoll } from "../../../../../context/PollContext";
// import { useSaveStatus } from "../../../../../context/SaveStatusContext";
// import { QuestionType } from "../../../../../types/survey";
// import { useSidebarStore } from "../../../../../stores/sidebar";

// export const usePollApiActions = () => {
//   const { poll } = usePoll();
//   const { setSaveStatus } = useSaveStatus();
//   const pollId = poll?._id || "";

//   const { formHeaderElement } = useSidebarStore();

//   const {
//     data: pollData,
//     isLoading,
//     refetch: refreshPoll,
//   } = pollService.GetPoll(pollId);
//   const { mutate: updatePollMutation } = pollService.useUpdatePoll();
//   const { mutate: updateSectionMutation } = pollService.useUpdateSection();
//   const { mutateAsync: createSectionMutation } = pollService.useCreateSection();
//   const { mutateAsync: createQuestionMutation } = pollService.useAddQuestion();
//   const { mutateAsync: deleteSectionMutation } = pollService.useDeleteSection();
//   const reorderQuestionMutation = pollService.useReorderQuestion();

//   const updatePollTitle = (value: string) => {
//     const finalValue = !value.trim() ? "Untitled form" : value.trim();
//     updatePollMutation(
//       { data: { title: finalValue }, pollId },
//       {
//         onSuccess: () => {
//           setSaveStatus("saved", "הכותרת עודכנה");
//         },
//         onError: () => {
//           setSaveStatus("error", "שגיאה בשמירה");
//           refreshPoll();
//         },
//       }
//     );
//   };

//   const updatePollDescription = (value: string) => {
//     const finalValue = value.trim();
//     updatePollMutation(
//       { data: { description: finalValue }, pollId },
//       {
//         onSuccess: () => {
//           setSaveStatus("saved", "התיאור עודכן");
//         },
//         onError: () => {
//           setSaveStatus("error", "שגיאה בשמירה");
//           refreshPoll();
//         },
//       }
//     );
//   };

//   const updateSectionTitle = (sectionId: string, value: string) => {
//     const finalValue = !value.trim() ? "כותרת סעיף" : value.trim();
//     updateSectionMutation(
//       { pollId, sectionId, data: { title: finalValue } },
//       {
//         onSuccess: () => {
//           setSaveStatus("saved", "כותרת הסעיף עודכנה");
//           refreshPoll();
//         },
//         onError: () => {
//           setSaveStatus("error", "שגיאה בשמירת הסעיף");
//           refreshPoll();
//         },
//       }
//     );
//   };

//   const updateSectionDescription = (sectionId: string, value: string) => {
//     const finalValue = value.trim();
//     updateSectionMutation(
//       { pollId, sectionId, data: { description: finalValue } },
//       {
//         onSuccess: () => {
//           setSaveStatus("saved", "תיאור הסעיף עודכן");
//           refreshPoll();
//         },
//         onError: () => {
//           setSaveStatus("error", "שגיאה בשמירת הסעיף");
//           refreshPoll();
//         },
//       }
//     );
//   };

//   const createSection = async (): Promise<string | undefined> => {
//     const res = await createSectionMutation({ pollId });
//     await refreshPoll();
//     return res?._id;
//   };

//   const createQuestion = async (
//     sectionId: string,
//     options?: {
//       index?: number;
//       type?: QuestionType;
//     }
//   ): Promise<string | undefined> => {
//     const res = await createQuestionMutation({
//       data: {
//         pollId,
//         sectionId,
//         index: options?.index ?? 0,
//         type: options?.type ?? "MULTIPLE_CHOICE",
//         options: [{ option: "אופציה 1" }],
//       },
//     });

//     await refreshPoll();
//     return res?._id;
//   };

//   const deleteSection = async (sectionId: string) => {
//     const sections = poll.sections;
//     const index = sections.findIndex((s) => s._id === sectionId);

//     await deleteSectionMutation({ pollId, sectionId });
//     await refreshPoll();

//     if (index === 1) {
//       useSidebarStore.getState().setTarget(formHeaderElement);
//     } else {
//       const prevSectionId = sections[index - 1]._id;
//       const el = document.getElementById(`section-header-${prevSectionId}`);
//       if (el) {
//         useSidebarStore.getState().setTarget(el);
//       }
//     }
//   };

//   return {
//     poll,
//     pollId,
//     pollData,
//     isLoading,
//     refreshPoll,
//     updatePollTitle,
//     updatePollDescription,
//     updateSectionTitle,
//     updateSectionDescription,
//     createSection,
//     createQuestion,
//     deleteSection,
//     reorderQuestionMutation,
//   };
// };

import { usePoll } from "../../../../../context/PollContext";
import { pollService } from "../../../../../services/pollService";
import {
  CreateQuestionDTO,
  CreateSectionDTO,
  DeleteQuestionDTO,
  IPoll,
  Question,
  QuestionType,
} from "../../../../../types/survey";
import { useActionHistory } from "../../../../../context/ActionHistoryContext";
import { useSaveStatus } from "../../../../../context/SaveStatusContext";

export const usePollApiActions = () => {
  const { perform } = useActionHistory();
  const { poll } = usePoll();
  const { setSaveStatus } = useSaveStatus();
  const pollId = poll?._id || "";

  const {
    data: pollData,
    isLoading,
    refetch: refreshPoll,
  } = pollService.GetPoll(pollId);

  const addQuestionMutation = pollService.useAddQuestion();
  const deleteQuestionMutation = pollService.useDeleteQuestion();
  const createSectionMutation = pollService.useCreateSection();
  const deleteSectionMutation = pollService.useDeleteSection();
  const updatePollMutation = pollService.useUpdatePoll();
  const updateSectionMutation = pollService.useUpdateSection();

  const createQuestion = async (
    sectionId: string,
    options?: {
      index?: number;
      type?: QuestionType;
    }
  ): Promise<string> => {
    let newQuestionId = "";
    const index = options?.index ?? 0;
    const type = options?.type ?? "MULTIPLE_CHOICE";
    const questionData = {
      pollId,
      sectionId,
      index,
      type,
      options: [{ option: "אופציה 1" }],
    };
    await perform({
      type: "CREATE_QUESTION",
      sectionId,
      question: questionData,
      do: async () => {
        const result = await addQuestionMutation.mutateAsync({
          data: questionData,
        });
        if (!result?._id) throw new Error("Failed to create question");
        newQuestionId = result._id;
        await refreshPoll();
      },
      undo: async () => {
        if (!newQuestionId) throw new Error("Missing question ID for undo");
        await deleteQuestionMutation.mutateAsync({
          data: { pollId, sectionId, questionId: newQuestionId },
        });
        await refreshPoll();
      },
    });
    return newQuestionId;
  };

  const deleteQuestion = async (
    sectionId: string,
    questionId: string,
    questionData: CreateQuestionDTO["data"] & { _id: string }
  ) => {
    await perform({
      type: "DELETE_QUESTION",
      sectionId,
      questionId,
      questionData,
      do: async () => {
        await deleteQuestionMutation.mutateAsync({
          data: { questionId, pollId, sectionId },
        });
      },
      undo: async () => {
        await addQuestionMutation.mutateAsync({
          data: { ...questionData, sectionId, pollId },
        });
      },
    });
  };

  const createSection = async (): Promise<string | undefined> => {
    let newSectionId: string | undefined;
    await perform({
      type: "CREATE_SECTION",
      section: {},
      do: async () => {
        const result = await createSectionMutation.mutateAsync({ pollId });
        if (!result?._id) throw new Error("Failed to create section");
        newSectionId = result._id;
      },
      undo: async () => {
        if (newSectionId) {
          await deleteSectionMutation.mutateAsync({
            pollId,
            sectionId: newSectionId,
          });
        }
      },
    });

    return newSectionId;
  };

  const deleteSection = async (sectionId: string) => {
    const sectionData = poll.sections.find((s) => s._id === sectionId);
    await perform({
      type: "DELETE_SECTION",
      sectionId,
      sectionData,
      do: async () => {
        await deleteSectionMutation.mutateAsync({ pollId, sectionId });
      },
      undo: async () => {
        await createSectionMutation.mutateAsync({ pollId });
      },
    });
  };

  const updatePollTitle = async (newTitle: string) => {
    const oldTitle = poll.title;
    await perform({
      type: "UPDATE_TITLE",
      prev: oldTitle!,
      next: newTitle,
      do: async () => {
        await updatePollMutation.mutateAsync(
          { pollId, data: { title: newTitle } },
          {
            onSuccess: () => setSaveStatus("saved", "הכותרת עודכנה"),
            onError: () => {
              setSaveStatus("error", "שגיאה בשמירה");
              refreshPoll();
            },
          }
        );
      },
      undo: async () => {
        await updatePollMutation.mutateAsync({
          pollId,
          data: { title: oldTitle },
        });
      },
    });
  };

  const updatePollDescription = async (newDesc: string) => {
    const oldDesc = poll.description;
    await perform({
      type: "UPDATE_DESCRIPTION",
      prev: oldDesc!,
      next: newDesc,
      do: async () => {
        await updatePollMutation.mutateAsync(
          { pollId, data: { description: newDesc } },
          {
            onSuccess: () => setSaveStatus("saved", "התיאור עודכן"),
            onError: () => {
              setSaveStatus("error", "שגיאה בשמירה");
              refreshPoll();
            },
          }
        );
      },
      undo: async () => {
        await updatePollMutation.mutateAsync({
          pollId,
          data: { description: oldDesc },
        });
      },
    });
  };

  const updateSectionTitle = async (sectionId: string, newTitle: string) => {
    const section = poll.sections.find((s) => s._id === sectionId);
    if (!section) throw new Error("Section not found");
    const oldTitle = section.title;
    const finalTitle = !newTitle.trim() ? "כותרת סעיף" : newTitle.trim();

    await perform({
      type: "UPDATE_SECTION_TITLE",
      sectionId,
      prev: oldTitle,
      next: finalTitle,
      do: async () => {
        await updateSectionMutation.mutateAsync(
          { pollId, sectionId, data: { title: finalTitle } },
          {
            onSuccess: () => {
              setSaveStatus("saved", "כותרת הסעיף עודכנה");
              refreshPoll();
            },
            onError: () => {
              setSaveStatus("error", "שגיאה בשמירת הסעיף");
              refreshPoll();
            },
          }
        );
      },
      undo: async () => {
        await updateSectionMutation.mutateAsync({
          pollId,
          sectionId,
          data: { title: oldTitle },
        });
      },
    });
  };

  const updateSectionDescription = async (
    sectionId: string,
    newDesc: string
  ) => {
    const section = poll.sections.find((s) => s._id === sectionId);
    if (!section) throw new Error("Section not found");
    const oldDesc = section.description;

    await perform({
      type: "UPDATE_SECTION_DESCRIPTION",
      sectionId,
      prev: oldDesc!,
      next: newDesc,
      do: async () => {
        await updateSectionMutation.mutateAsync(
          { pollId, sectionId, data: { description: newDesc } },
          {
            onSuccess: () => setSaveStatus("saved", "תיאור הסעיף עודכן"),
            onError: () => {
              setSaveStatus("error", "שגיאה בשמירת הסעיף");
              refreshPoll();
            },
          }
        );
      },
      undo: async () => {
        await updateSectionMutation.mutateAsync({
          pollId,
          sectionId,
          data: { description: oldDesc },
        });
      },
    });
  };

  return {
    poll,
    pollData,
    pollId,
    isLoading,
    refreshPoll,
    createQuestion,
    deleteQuestion,
    createSection,
    deleteSection,
    updatePollTitle,
    updatePollDescription,
    updateSectionTitle,
    updateSectionDescription,
  };
};
