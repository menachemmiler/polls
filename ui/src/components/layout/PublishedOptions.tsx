import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "lucide-react";
import { pollService } from "../../services/pollService";
import { useSaveStatus } from "../../context/SaveStatusContext";
import SharePopover from "./SharePopover";
import { kartoffelService } from "../../services/kartoffelService";

interface Props {
  pollId: string;
  open: boolean;
  onClose: () => void;
  onCopyLinkClick: () => void;
}

const PublishedOptionsPopup: React.FC<Props> = ({
  open,
  onClose,
  pollId,
  onCopyLinkClick,
}) => {
  const { t } = useTranslation();
  const [acceptingResponses, setAcceptingResponses] = useState(true);
  const { mutate: updateRespondable } = pollService.useRespondablePoll();
  const { setSaveStatus } = useSaveStatus();
  const [showSharePopover, setShowSharePopover] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      const data = await kartoffelService.getPollPermission(pollId);
      setAcceptingResponses(data.respondable);
    };
    fetchPermissions();
  }, []);

  const handleSave = async () => {
    await updateRespondable(
      {
        pollId: pollId,
        data: {
          respondable: acceptingResponses,
        },
      },
      {
        onSuccess: () => {
          setSaveStatus("saved", " הגדרות הסקר עודכנו");
          setTimeout(() => setSaveStatus("idle"), 3000);
        },
        onError: (error) => {
          console.error("Failed to update poll", error);
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-[580px] rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-lg font-medium text-gray-900 text-right">
            אפשרויות לטופס שפורסם
          </h1>
        </div>

        <div className="px-6 py-4 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {acceptingResponses ? (
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-8a1 1 0 012 0v2a1 1 0 11-2 0v-2zm2-4a1 1 0 10-2 0 1 1 0 002 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {acceptingResponses
                      ? "מקבל תגובות"
                      : "הטופס לא מקבל עוד תגובות"}
                  </span>
                </div>
                {!acceptingResponses && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>המשיבים יראו את ההודעה הזו</strong>
                    <br />
                    "לא ניתן יותר לשלוח תשובות לטופס."
                  </p>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <button
                onClick={() => setAcceptingResponses(!acceptingResponses)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                  acceptingResponses ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    acceptingResponses ? "right-0.5" : "right-4"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* <div className="border-t border-gray-200"></div> */}

          {/* <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <UserPlus2 className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex flex-col">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    משיבים
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  כל מי שקיבל או קיבלה את הקישור הזה
                </div>
                <button
                  onClick={() => setShowSharePopover(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-5 py-1 rounded-md ml-auto transition"
                >
                  ניהול
                </button>
              </div>
            </div>

            <div className="mt-1"></div>
          </div> */}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
            onClick={onCopyLinkClick}
          >
            <Link className="w-4 h-4" />
            העתקת הקישור של המשיב/ה
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2 rounded-md transition-colors"
              onClick={() => {
                handleSave();
                onClose();
              }}
            >
              {t("common.save")}
            </button>
          </div>
        </div>
      </div>
      {showSharePopover && (
        <SharePopover
          pollId={pollId}
          onClose={() => setShowSharePopover(false)}
        />
      )}
    </div>
  );
};

export default PublishedOptionsPopup;
