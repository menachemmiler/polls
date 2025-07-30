import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Printer, Trash2, XCircle } from "lucide-react";
import { pollService } from "../../services/pollService";
import { useSaveStatus } from "../../context/SaveStatusContext";
import ConfirmationDialog from "../shared/ConfirmationDialog";
import { toastService } from "../../services/toastService"; // הוספתי את הטוסט סרוויס
import { usePoll } from "../../context/PollContext";

interface MoreOptionsMenuProps {
  pollId: string;
  isPublished: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCopyToast: () => void;
  onNavigateHome: () => void;
}

const MoreOptionsMenu: React.FC<MoreOptionsMenuProps> = ({
  pollId,
  isPublished,
  isOpen,
  onClose,
  onCopyToast,
  onNavigateHome,
}) => {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { setSaveStatus } = useSaveStatus();
  const { poll } = usePoll(); // במקום fetch – יש לך כבר את הסקר

  const { mutate: deletePoll } = pollService.useDeletePoll();
  const { mutate } = pollService.useCreatePoll();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateName, setDuplicateName] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      const pollUrl = `${window.location.origin}/poll/${pollId}`;
      await navigator.clipboard.writeText(pollUrl);
      onCopyToast();
    } catch (error) {
      console.error("Failed to copy:", error);
      setSaveStatus("error", "שגיאה בהעתקה");
      toastService.error("שגיאה בהעתקת הקישור");
    }
    onClose();
  };

  const confirmDuplicate = async () => {
    mutate(
      {
        name: duplicateName || poll.name + " (העתק)",
        title: poll.title || "",
        description: poll.description || "",
        isAnonymous: poll.isAnonymous ?? true,
        startAt: poll.startAt || new Date().toISOString(),
        sections: (poll.sections || []).map((section) => ({
          title: section.title,
          description: section.description || "",
          questions: (section.questions || []).map((question) => ({
            title: question.title || "",
            description: question.description || "",
            type: question.type,
            isRequired: question.isRequired,
            index: question.index,
            relatedSectionIds: question.relatedSectionIds || [],
            options: (question.options || []).map((opt) => ({
              option: opt.option,
            })),
          })),
        })),
      },
      {
        onSuccess: (data) => {
          console.log("Poll duplicated successfully:", data);

          setSaveStatus("saved", "הסקר הועתק בהצלחה");
          toastService.success(
            "הסקר נוצר בהצלחה! תוכל לראות אותו ברשימת הסקרים."
          );
        },
        onError: (error: unknown) => {
          const errorMessage =
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message
              : String(error);
          toastService.error(`שגיאה בהעתקת הסקר: ${errorMessage}`);
          console.error("Error duplicating poll:", error);
        },
      }
    );
  };

  const handleDelete = () => {
    deletePoll(
      { pollId },
      {
        onSuccess: () => {
          setSaveStatus("saved", "הסקר נמחק");
          toastService.success("הסקר נמחק בהצלחה");
          onNavigateHome();
        },
        onError: () => {
          setSaveStatus("error", "שגיאה במחיקה");
          toastService.error("שגיאה במחיקת הסקר");
        },
      }
    );
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 w-56 bg-white border border-gray-300 rounded-xl shadow-xl z-50 p-2 space-y-1"
          dir="rtl"
        >
          <button
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4 ml-2" />
            העתק קישור
          </button>

          <button
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => setShowDuplicateDialog(true)}
          >
            <Copy className="w-4 h-4 ml-2" />
            שכפל סקר
          </button>

          <button
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 ml-2" />
            הדפס כ־PDF
          </button>

          {isPublished && (
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-orange-600 hover:bg-orange-100 rounded-lg"
              onClick={() => alert("בטל פרסום לא ממומש")}
            >
              <XCircle className="w-4 h-4 ml-2" />
              ביטול פרסום
            </button>
          )}

          <hr className="border-gray-200 my-1" />

          <button
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            מחק סקר
          </button>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="מחיקת סקר"
        message="האם אתה בטוח שברצונך למחוק את הסקר? פעולה זו בלתי הפיכה."
        confirmText="מחק"
      />

      {showDuplicateDialog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 text-center">
              שכפול סקר
            </h2>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="שם חדש לסקר"
              value={duplicateName}
              onChange={(e) => setDuplicateName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDuplicateDialog(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={confirmDuplicate}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                שכפל
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoreOptionsMenu;
