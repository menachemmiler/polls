import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSettingsDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-lg shadow-xl p-6 text-right"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">הגדרות שפה</h2>
        <p className="text-sm text-gray-600 mb-2">בחר את שפת הממשק:</p>
        <div className="flex flex-col gap-2">
          {[
            { label: "עברית", value: "he" },
            { label: "English", value: "en" },
            { label: "יידיש", value: "yi" },
          ].map((lang) => {
            const isSelected = i18n.language === lang.value;
            return (
              <button
                key={lang.value}
                onClick={() => changeLanguage(lang.value)}
                className={`py-2 px-4 text-sm rounded border transition 
                  ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-purple-600 border-purple-600 hover:bg-purple-50"
                  }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguageSettingsDialog;
