import React, { useEffect, useState } from "react";
import {
  Eye,
  Link,
  UserPlus2,
  Palette,
  SlidersHorizontal,
  Redo2,
  Undo2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import forms_logo from "../../assets/forms_logo.svg";
import { useUserStore } from "../../stores/user";
import UnpublishedLinkPopover from "./LinkPopover";
import { IPoll } from "../../types/survey";
import { pollService } from "../../services/pollService";
import { useSaveStatus } from "../../context/SaveStatusContext";
import PublishPopup from "../../features/tabs/PublishPopup";
import SharePopover from "./SharePopover";
import PublishedOptionsPopup from "./PublishedOptions";
import FormDesign from "./FormDesign";
import { usePoll } from "../../context/PollContext";

interface NavbarProps {
  poll: IPoll;
  onSaved?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ poll, onSaved }: NavbarProps) => {
  const navigate = useNavigate();
  const { saveStatus, saveMessage, setSaveStatus } = useSaveStatus();
  const [showSharePopover, setShowSharePopover] = useState(false);
  const [showFormDesign, setShowFormDesign] = useState(false);

  const { _id: pollId } = poll;
  const { data: publishStatus, refetch } =
    pollService.useCheckIfPublished(pollId);
  const isPublished = publishStatus === true;

  const shragaUser = useUserStore((state) => state.user);
  const [showPopover, setShowPopover] = useState(false);
  const { mutate: publishPoll } = pollService.usePublishPoll();
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const [showPublishedOptions, setShowPublishedOptions] = useState(false);

  useEffect(() => {
    if (onSaved) onSaved();
  }, [onSaved]);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(poll.name || "");
  const { mutate: updatePoll } = pollService.useUpdatePoll();
  const handleSave = () => {
    setIsEditing(false);
    if (tempName.trim() && tempName !== poll.name) {
      poll.name = tempName;
      updatePoll({ pollId: poll._id, data: { name: tempName } });
    }
    setSaveStatus("saved", " שם הסקר עודכן");
  };

  const handlePublish = () => {
    publishPoll(
      { pollId },
      {
        onSuccess: () => {
          setSaveStatus("saved", "הסקר פורסם בהצלחה");
          setTimeout(() => setSaveStatus("idle"), 3000);
          refetch();
        },
        onError: (error) => {
          console.error("Error publishing poll:", error);
          setSaveStatus("error");
        },
      }
    );
  };

  const { undo, redo } = usePoll();

  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-white"
      dir="rtl"
    >
      {/* Right Section */}
      <div className="flex items-center gap-3">
        <img
          src={forms_logo}
          alt="Forms"
          className="w-10 h-10 cursor-pointer"
          title="חזרה לדף הבית"
          onClick={() => navigate("/")}
        />
        {isEditing ? (
          <input
            className="text-lg font-medium bg-transparent border-b border-gray-300 focus:outline-none focus:border-purple-500"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            autoFocus
          />
        ) : (
          <h1
            className="text-lg font-medium cursor-pointer"
            onDoubleClick={() => setIsEditing(true)}
          >
            {poll.name || "שם הטופס"}
          </h1>
        )}
        {saveStatus === "saved" && (
          <span className="text-base text-green-600 mt-1">{saveMessage}</span>
        )}
        {saveStatus === "error" && (
          <span className="text-base text-red-600 mt-1">
            {saveMessage || "שגיאה בשמירה"}
          </span>
        )}
      </div>

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div
          title="די נו אז אנחנו לא בדיוק Google Forms"
          className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          onClick={() => setShowFormDesign(true)}
        >
          <Palette className="text-gray-600 w-5 h-5" />
        </div>

        {showFormDesign && (
          //צריך לשנות גובה אבסלוטי לגובה הקומפוננטה של שאלות
          <div className="fixed top-[93.5px] left-0 w-[350px] h-[calc(100vh-64px)] bg-white shadow-lg z-50 overflow-y-auto">
            <FormDesign onClose={() => setShowFormDesign(false)} />
          </div>
        )}

        <div
          title="ביטול"
          className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          onClick={() => {}}
        >
          <Undo2 className="text-gray-600 w-5 h-5" onClick={undo}/>
        </div>

        <div
          title="ביצוע חוזר"
          className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          onClick={() => {}}
        >
          <Redo2 className="text-gray-600 w-5 h-5" onClick={redo}/>
        </div>

        <div
          title="תצוגה מקדימה"
          className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          onClick={() => navigate(`/preview/${pollId}`)}
        >
          <Eye className="text-gray-600 w-5 h-5" />
        </div>

        <div
          className="relative p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          title="העתקת הקישור של המשיב/ה"
        >
          <Link
            className="text-gray-600 w-5 h-5"
            onClick={() => setShowPopover(!showPopover)}
          />
          {showPopover && (
            <UnpublishedLinkPopover
              pollId={pollId}
              isPublished={isPublished}
              onClose={() => setShowPopover(false)}
              onCopy={() => {
                setShowCopyToast(true);
                setTimeout(() => setShowCopyToast(false), 2000);
              }}
            />
          )}
        </div>

        <div
          className="relative p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          title="שיתוף"
        >
          <UserPlus2
            className="text-gray-600 w-5 h-5"
            onClick={() => setShowSharePopover(!showSharePopover)}
          />
          {showSharePopover && (
            <SharePopover
              pollId={poll._id}
              onClose={() => setShowSharePopover(false)}
            />
          )}
        </div>
        <button
          className={`text-sm px-4 py-1 rounded border flex items-center gap-1 cursor-pointer ${
            isPublished
              ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              : "bg-purple-600 text-white border-transparent hover:bg-purple-700"
          }`}
          onClick={() => {
            if (isPublished) {
              setShowPublishedOptions(true);
            } else {
              setShowPublishPopup(true);
            }
          }}
        >
          {isPublished && (
            <SlidersHorizontal className="w-4 h-4 text-purple-600" />
          )}
          {isPublished ? "פורסם" : "פרסום"}
        </button>

        <button className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
          {shragaUser?.name
            ? `${shragaUser.name.firstName[0]}.${shragaUser.name.lastName[0]}`
            : ""}
        </button>
      </div>
      <PublishPopup
        open={showPublishPopup}
        onClose={() => setShowPublishPopup(false)}
        onConfirm={() => {
          setShowPublishPopup(false);
          handlePublish();
        }}
      />
      <PublishedOptionsPopup
        pollId={pollId}
        open={showPublishedOptions}
        onClose={() => setShowPublishedOptions(false)}
        onCopyLinkClick={() => {
          setShowPopover(true);
          setShowPublishedOptions(false);
        }}
      />

      {showCopyToast && (
        <div className="fixed bottom-4 right-4  bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-lg z-50">
          הקישור הועתק ללוח.
        </div>
      )}
    </div>
  );
};

export default Navbar;
