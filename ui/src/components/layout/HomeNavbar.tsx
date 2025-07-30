import React, { useState } from "react";
import forms_logo from "../../assets/forms_logo.svg";
import { useUserStore } from "../../stores/user";
import { IPoll } from "../../types/survey";
import SearchForm from "../../features/home/SearchForm";
import LanguageSettingsDialog from "./LanguageSettingsDialog"; // ניצור אותו מיד

interface HomeNavbarProps {
  polls: IPoll[];
}

const HomeNavbar: React.FC<HomeNavbarProps> = ({ polls }) => {
  const shragaUser = useUserStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDialogOpen, setIsLangDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 cursor-pointer">
          <img src={forms_logo} alt="Forms Icon" className="w-full h-full" />
        </div>
        <h1 className="text-2xl text-gray-700">Forms</h1>
      </div>

      {/* Search Bar */}
      <SearchForm polls={polls} />

      {/* Right Icons */}
      <div className="flex items-center gap-3 relative">
        <button className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
          {shragaUser.name
            ? shragaUser.name.firstName[0] + "." + shragaUser.name.lastName[0]
            : ""}
        </button>

        {/* כפתור שלושת הקווים */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 5h16v2H4zM4 11h16v2H4zM4 17h16v2H4z" />
          </svg>
        </button>

        {/* תפריט נפתח */}
        {isMenuOpen && (
          <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg z-10 w-48 text-right p-2">
            <button
              onClick={() => {
                setIsLangDialogOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-full text-sm px-4 py-2 hover:bg-gray-100 text-gray-700 text-right"
            >
              הגדרות שפה
            </button>
            {/* כאן תוכל להוסיף כפתורים נוספים בעתיד */}
          </div>
        )}
      </div>

      {/* מודאלית הגדרות שפה */}
      <LanguageSettingsDialog
        isOpen={isLangDialogOpen}
        onClose={() => setIsLangDialogOpen(false)}
      />
    </div>
  );
};

export default HomeNavbar;
