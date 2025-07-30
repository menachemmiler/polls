import { pollService } from "../../../../../services/pollService";
import { usePoll } from "../../../../../context/PollContext";
import { useSaveStatus } from "../../../../../context/SaveStatusContext";
import { QuestionType } from "../../../../../types/survey";
import { useSidebarStore } from "../../../../../stores/sidebar";

export const usePollApiActions = () => {
  const { poll } = usePoll();
  const { setSaveStatus } = useSaveStatus();
  const pollId = poll?._id || "";

  const { formHeaderElement } = useSidebarStore();

  const {
    data: pollData,
    isLoading,
    refetch: refreshPoll,
  } = pollService.GetPoll(pollId);
  const { mutate: updatePollMutation } = pollService.useUpdatePoll();
  const { mutate: updateSectionMutation } = pollService.useUpdateSection();
  const { mutateAsync: createSectionMutation } = pollService.useCreateSection();
  const { mutateAsync: createQuestionMutation } = pollService.useAddQuestion();
  const { mutateAsync: deleteSectionMutation } = pollService.useDeleteSection();
  const reorderQuestionMutation = pollService.useReorderQuestion();

  const updatePollTitle = (value: string) => {
    const finalValue = !value.trim() ? "Untitled form" : value.trim();
    updatePollMutation(
      { data: { title: finalValue }, pollId },
      {
        onSuccess: () => {
          setSaveStatus("saved", "הכותרת עודכנה");
        },
        onError: () => {
          setSaveStatus("error", "שגיאה בשמירה");
          refreshPoll();
        },
      }
    );
  };

  const updatePollDescription = (value: string) => {
    const finalValue = value.trim();
    updatePollMutation(
      { data: { description: finalValue }, pollId },
      {
        onSuccess: () => {
          setSaveStatus("saved", "התיאור עודכן");
        },
        onError: () => {
          setSaveStatus("error", "שגיאה בשמירה");
          refreshPoll();
        },
      }
    );
  };

  const updateSectionTitle = (sectionId: string, value: string) => {
    const finalValue = !value.trim() ? "כותרת סעיף" : value.trim();
    updateSectionMutation(
      { pollId, sectionId, data: { title: finalValue } },
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
  };

  const updateSectionDescription = (sectionId: string, value: string) => {
    const finalValue = value.trim();
    updateSectionMutation(
      { pollId, sectionId, data: { description: finalValue } },
      {
        onSuccess: () => {
          setSaveStatus("saved", "תיאור הסעיף עודכן");
          refreshPoll();
        },
        onError: () => {
          setSaveStatus("error", "שגיאה בשמירת הסעיף");
          refreshPoll();
        },
      }
    );
  };

  const createSection = async (): Promise<string | undefined> => {
    const res = await createSectionMutation({ pollId });
    await refreshPoll();
    return res?._id;
  };

  const createQuestion = async (
    sectionId: string,
    options?: {
      index?: number;
      type?: QuestionType;
    }
  ): Promise<string | undefined> => {
    const res = await createQuestionMutation({
      data: {
        pollId,
        sectionId,
        index: options?.index ?? 0,
        type: options?.type ?? "MULTIPLE_CHOICE",
        options: [{ option: "אופציה 1" }],
      },
    });

    await refreshPoll();
    return res?._id;
  };

  const deleteSection = async (sectionId: string) => {
    const sections = poll.sections;
    const index = sections.findIndex((s) => s._id === sectionId);

    await deleteSectionMutation({ pollId, sectionId });
    await refreshPoll();

    if (index === 1) {
      useSidebarStore.getState().setTarget(formHeaderElement);
    } else {
      const prevSectionId = sections[index - 1]._id;
      const el = document.getElementById(`section-header-${prevSectionId}`);
      if (el) {
        useSidebarStore.getState().setTarget(el);
      }
    }
  };

  return {
    poll,
    pollId,
    pollData,
    isLoading,
    refreshPoll,
    updatePollTitle,
    updatePollDescription,
    updateSectionTitle,
    updateSectionDescription,
    createSection,
    createQuestion,
    deleteSection,
    reorderQuestionMutation,
  };
};
