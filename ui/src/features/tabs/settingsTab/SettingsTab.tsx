import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ContentCard from "../responsesTab/content/ContentCard";

const options = ["לא לאסוף", "מאומתות", "קלט של משיבים"];

const SettingsTab: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isFormSectionOpen, setIsFormSectionOpen] = useState(false);
  const [isQuestionSectionOpen, setIsQuestionSectionOpen] = useState(false);
  const [isRequired, setIsRequired] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  return (
    <ContentCard className="p-6">
      <h2 className="text-[20px] font-medium text-gray-800 pb-2 text-right border-b border-gray-300">
        ברירות מחדל
      </h2>
      <div className="pr-6">

        {/* טופס */}
        <div className="py-6 pl-3 border-b border-gray-300">
          <div
            className="flex flex-row-reverse items-center justify-between cursor-pointer mb-1"
            onClick={() => setIsFormSectionOpen((open) => !open)}
          >
            <ChevronUp
              className={`w-4 h-4 text-gray-600 transition-transform ${isFormSectionOpen ? "rotate-0" : "rotate-180"}`}
            />
            <span className="text-sm text-gray-800 font-normal text-right">
              ברירות המחדל של הטופס
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2 text-right">
            הגדרות שחלות על הטופס הזה ועל טפסים חדשים
          </p>

          {isFormSectionOpen && (
            <div className="pt-6 pr-6 pl-2">
              <div className="flex flex-row-reverse items-center justify-between pb-4">
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="border border-gray-300 px-3 py-2 text-xs w-39 bg-white text-gray-800 shadow-sm flex flex-row-reverse items-center justify-between gap-8"
                    onClick={() => setOpenDropdown((prev) => !prev)}
                    type="button"
                    dir="rtl"
                  >
                    {openDropdown ? (
                      <ChevronUp className="w-4 h-4 text-gray-600 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600 ml-2" />
                    )}
                    {selectedOption}
                  </button>
                  {openDropdown && (
                    <div className="absolute top-0 right-0 bg-white rounded-sm w-40 shadow-md z-10">
                      {options.map((option) => {
                        const isSelected = selectedOption === option;
                        return (
                          <div
                            key={option}
                            onClick={() => {
                              setSelectedOption(option);
                              setTimeout(() => setOpenDropdown(false), 120);
                            }}
                            className={`px-4 py-2 text-xs cursor-pointer text-right relative select-none
                              transition-colors duration-400
                              ${
                                isSelected
                                  ? "bg-[#edf4fc] font-medium"
                                  : "hover:bg-gray-100 active:bg-gray-200"
                              }
                            `}
                          >
                            {option}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <label className="text-sm font-normal text-gray-800 block min-w-[170px]">
                  איסוף כתובות אימייל כברירת מחדל
                </label>
              </div>
            </div>
          )}
        </div>

        {/* שאלה */}
        <div className="pt-6 pb-3">
          <div
            className="flex flex-row-reverse items-center justify-between cursor-pointer mb-1"
            onClick={() => setIsQuestionSectionOpen((open) => !open)}
          >
            <ChevronUp
              className={`w-4 h-4 text-gray-600 transition-transform ${isQuestionSectionOpen ? "rotate-0" : "rotate-180"}`}
            />
            <div>
              <span className="text-sm text-gray-800 font-normal text-right">
                ברירות המחדל של השאלה
              </span>
              <p className="text-xs text-gray-500 text-right">
                הגדרות שחלות על כל השאלות
              </p>
            </div>
          </div>

          {isQuestionSectionOpen && (
            <div className="pt-6 pr-6 pl-3">
              <div className="flex flex-row-reverse items-center justify-between gap-8">
                <button
                  type="button"
                  onClick={() => setIsRequired((v) => !v)}
                  className={`relative inline-flex h-3.5 w-9.5 items-center rounded-full transition-colors duration-300 ${
                    isRequired ? "bg-[#e3daf2]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`
                      inline-block h-5 w-5 shadow-md transform rounded-full transition-all duration-300
                      ${isRequired ? "bg-[#693bb8] -translate-x-full" : "bg-white translate-x-0"}
                    `}
                  />
                </button>
                <label className="text-sm font-normal text-gray-800 block text-right min-w-[170px]">
                  חובה להוסיף שאלות כברירת מחדל
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentCard>
  );
};

export default SettingsTab;
