import { useState, useRef, FC, useCallback } from "react";
import { MoreVertical } from "lucide-react";
import { pollService } from "../../../services/pollService";
import { useSaveStatus } from "../../../context/SaveStatusContext";
import { usePoll } from "../../../context/PollContext";
import DraggableSections from "./DraggableSections";

export const SectionMenu: FC<{
  sectionId: string;
  onDeleteSection?: (sectionId: string) => void;
}> = ({ sectionId, onDeleteSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { poll } = usePoll();
  const pollId = poll?._id || "";
  const { setSaveStatus } = useSaveStatus();

  const reorderSectionsMutation = pollService.useReorderSections();
  const { refetch: refreshPoll } = pollService.GetPoll(pollId);
  const { mutate: copySection } = pollService.useCopySection();

  const handleReorderSections = async (sectionId: string, newIndex: number) => {
    if (!poll) return;

    try {
      await reorderSectionsMutation.mutateAsync({
        pollId: poll._id,
        sectionId: sectionId,
        index: newIndex,
      });
      refreshPoll();
      setSaveStatus("saved", "סדר המקטעים עודכן");
      setShowReorderModal(false);
    } catch {
      setSaveStatus("error", "שגיאה בעדכון סדר המקטעים");
    }
  };

  const { mutate: deleteSectionMutation } = pollService.useDeleteSection(
    async () => {
      setSaveStatus("saved", "הסעיף נמחק");
      refreshPoll();
      setIsOpen(false);
    },
    (error) => {
      console.error("Error deleting section:", error);
      setSaveStatus("error", "שגיאה במחיקת הסעיף");
    }
  );

  const handleClickOutside = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    },
    []
  );

  const handleDeleteSection = useCallback(() => {
    if (!poll || poll.sections.length <= 1) return;

    if (onDeleteSection) {
      onDeleteSection(sectionId);
    }

    deleteSectionMutation({ pollId: poll._id, sectionId });
  }, [poll, sectionId, onDeleteSection, deleteSectionMutation]);

  const handleReorderSection = useCallback(() => {
    setIsOpen(false);
    setShowReorderModal(true);
  }, []);

  const handleCancelReorder = useCallback(() => {
    setShowReorderModal(false);
  }, []);

  const handleCopySection = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      if (!poll) return;

      try {
        await new Promise<void>((resolve, reject) => {
          copySection(
            {
              pollId: poll._id,
              sectionId,
            },
            {
              onSuccess: () => {
                setSaveStatus("saved", "הסעיף שוכפל בהצלחה");
                refreshPoll();
                setIsOpen(false);
                resolve();
              },
              onError: (error) => {
                setSaveStatus("error", "שגיאה בשכפול הסעיף");
                reject(error);
              },
            }
          );
        });
      } catch {
        setSaveStatus("error", "שגיאה בשכפול הסעיף");
      }
    },
    [poll, copySection, sectionId, setSaveStatus, refreshPoll]
  );
  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          title="אפשרויות סעיף"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={handleClickOutside} />
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-2 w-50 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              <button
                onClick={handleCopySection}
                className="w-full px-4 py-3 text-right text-gray-700 hover:bg-gray-50 flex items-center justify-start"
              >
                <span className="text-sm">יצירת עותק משוכפל של סעיף</span>
              </button>

              <button
                onClick={handleReorderSection}
                className="w-full px-4 py-3 text-right text-gray-700 hover:bg-gray-50 flex items-center justify-start border-t border-gray-100"
              >
                <span className="text-sm">העברת סעיף</span>
              </button>
              {poll?.sections.length > 1 && (
                <button
                  onClick={handleDeleteSection}
                  className="w-full px-4 py-3 text-right text-gray-700 hover:bg-gray-50 flex items-center justify-start border-t border-gray-100"
                >
                  <span className="text-sm">מחיקת סעיף</span>
                </button>
              )}
              {/* <button className="w-full px-4 py-3 text-right text-gray-700 hover:bg-gray-50 flex items-center justify-start border-t border-gray-100">
                <span className="text-sm">מיזוג עם הבחירה למעלה</span>
              </button> */}
            </div>
          </>
        )}
      </div>

      {showReorderModal && poll && (
        <DraggableSections
          sections={poll.sections}
          onSave={handleReorderSections}
          onCancel={handleCancelReorder}
        />
      )}
    </>
  );
};
