import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface RenameDialogProps {
  isOpen: boolean;
  currentName: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
  isOpen,
  currentName,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState(currentName || "");

  useEffect(() => {
    if (isOpen) setNewName(currentName || "");
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 text-right"
        onClick={(e) => e.stopPropagation()}
        // dir="rtl"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">שינוי שם</h2>
        <p className="text-sm text-gray-800 mb-4">יש להזין שם חדש לפריט:</p>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
          autoFocus
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-purple-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={() => onConfirm(newName)}
            disabled={!newName.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameDialog;
