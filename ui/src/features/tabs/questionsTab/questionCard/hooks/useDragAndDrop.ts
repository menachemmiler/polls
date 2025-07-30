import { DropResult } from "@hello-pangea/dnd";
import { UseMutationResult } from "@tanstack/react-query";
import { IPoll } from "../../../../../types/survey";
import { useSaveStatus } from "../../../../../context/SaveStatusContext";

export const useDragAndDrop = (
  poll: IPoll | undefined,
  reorderQuestionMutation: UseMutationResult<
    void,
    unknown,
    { pollId: string; sectionId: string; questionId: string; index: number },
    unknown
  >,
  refetch: () => void
) => {
  const { setSaveStatus } = useSaveStatus();
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !poll) return;
    const sectionId = result.source.droppableId.replace("section-", "");
    const index = result.destination.index;

    if (result.source.index === index) return;
    try {
      await reorderQuestionMutation.mutateAsync({
        pollId: poll._id,
        sectionId,
        questionId: result.draggableId,
        index,
      });
      refetch();
      setSaveStatus("saved", "סדר השאלות עודכן");
    } catch {
      setSaveStatus("error", "שגיאה בעדכון סדר השאלות");
    }
  };

  return { handleDragEnd };
};
