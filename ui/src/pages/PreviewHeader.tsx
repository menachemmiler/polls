import {
  AlertTriangle,
  ArrowRight,
  Link2,
  CircleCheckBig,
  CircleOff,
} from "lucide-react";
import { useState } from "react";
import UnpublishedLinkPopover from "../components/layout/LinkPopover";
import { IPoll } from "../types/survey";
import { useNavigate } from "react-router-dom";

interface PreviewHeaderProps {
  poll: IPoll;
  isPublished: boolean;
}

const PreviewHeader = ({ poll, isPublished }: PreviewHeaderProps) => {
  const [showPopover, setShowPopover] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    const link = `${window.location.origin}/response/${poll._id}`;
    navigator.clipboard.writeText(link).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    });
  };

  return (
    <div className="w-full bg-white shadow-sm" dir="rtl">
      <div className="flex items-center justify-between px-8 py-5 text-lg font-medium text-gray-800 border-b border-gray-100">
        <div
          className="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-all duration-200"
          onClick={() => navigate(`/poll/${poll._id}`)}
          role="button"
          tabIndex={0}
        >
          <ArrowRight className="w-6 h-6 ml-3 text-gray-600 transition-transform hover:scale-110" />
          <span className="text-xl font-semibold">מצב של תצוגה מקדימה</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-bold text-[15px] flex items-center gap-2">
              {isPublished ? (
                <>
                  <CircleCheckBig className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-bold">פורסם</span>
                </>
              ) : (
                <>
                  <CircleOff className="w-5 h-5 text-red-500" />
                  <span className="text-red-600 font-bold">לא פורסם</span>
                </>
              )}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowPopover(!showPopover)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-gray-50 transition font-bold text-[15px]"
              title="העתקת קישור"
            >
              <Link2 className="w-4 h-4" />
              העתקת הקישור של המשיב/ה
            </button>

            {showPopover && (
              <UnpublishedLinkPopover
                pollId={poll._id}
                isPublished={isPublished}
                onClose={() => setShowPopover(false)}
                onCopy={handleCopy}
              />
            )}
          </div>
        </div>
      </div>

      {!isPublished && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-t border-amber-100">
          <div className="flex items-center justify-between py-4 px-8">
            <div className="flex items-center gap-3">
              <span className="text-amber-700 font-semibold text-base">
                ניהול הגדרות הפרסום
              </span>
            </div>
            <div className="flex items-center gap-3 bg-amber-100 px-4 py-2 rounded-lg border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-amber-700 text-base">
                לא ניתן לשלוח תשובות לטופס הזה.
              </span>
            </div>
          </div>
        </div>
      )}
      {showCopyToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-lg z-50">
          הקישור הועתק ללוח.
        </div>
      )}
    </div>
  );
};

export default PreviewHeader;
