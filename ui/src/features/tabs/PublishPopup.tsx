import React from "react";
import { BellOff } from "lucide-react";

interface PublishPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PublishPopup: React.FC<PublishPopupProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden text-right">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-semibold text-right text-gray-900">
            פרסום הטופס
          </h1>
        </div>

        <div
          className="flex items-center justify-start px-6 py-5 text-sm text-gray-600 border-t border-gray-500"
          dir="rtl"
        >
          <BellOff className="w-5 h-5 text-gray-500 ml-2" />
          <span>אף אחד לא יקבל התראה על פרסום הטופס</span>
        </div>

        <div className="flex justify-end items-center px-6 py-4 bg-gray-50 border-t border-gray-500 rounded-b-xl">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-1.5 rounded-md transition cursor-pointer"
            >
              סגירה
            </button>

            <button
              onClick={onConfirm}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2 rounded-md transition cursor-pointer"
            >
              פרסום
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishPopup;
