import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import forms_logo from "../../assets/forms_logo.svg";
import { IPoll } from "../../types/survey";
import { formatDate } from "../../utils/formatDate";

interface Props {
  polls: IPoll[];
  setFilteredPolls: (polls: IPoll[]) => void;
  onFocus: () => void;
  setIsOpenStart: (isOpen: boolean) => void;
  setPollToImport: (poll: IPoll | null) => void;
  onClosePromptSelector: () => void;
  setIsImportQuestionsPanelOpen: (isOpen: boolean) => void;
}

export default function BasicSearchForm({
  polls,
  setFilteredPolls,
  onFocus,
  setIsOpenStart,
  setPollToImport,
  onClosePromptSelector,
  setIsImportQuestionsPanelOpen,
}: Props) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value.trim()) {
      const filtered = polls.filter((poll) =>
        poll.name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPolls(filtered);
    } else {
      setFilteredPolls(polls);
    }
  }, [value, polls, setFilteredPolls]);

  return (
    <div dir="rtl" className="relative w-full max-w-full sm:max-w-[700px] z-10">
      {/* search bar */}
      <div className="relative w-full flex items-center">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="חפש טופס..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsOpenStart(false);
          }}
          onFocus={() => {
            onFocus();
            setIsOpenStart(true);
            setShowSuggestions(true);
          }}
          onBlur={() =>
            setTimeout(() => {
              setShowSuggestions(false);
              setIsOpenStart(false);
            }, 150)
          }
          className="w-full bg-gray-100 rounded-md px-10 py-2 text-right shadow-sm focus:outline-none focus:bg-white focus:shadow-xl"
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <MdOutlineClose size={18} />
          </button>
        )}
      </div>

      {/* suggestions */}
      {showSuggestions && value.trim() && (
        <ul className="absolute right-0 left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-xl z-10 max-h-96 overflow-y-auto">
          {polls
            .filter((poll) =>
              poll.name?.toLowerCase().includes(value.toLowerCase())
            )
            .map((item) => (
              <li
                key={item._id}
                onMouseDown={() => {
                  setPollToImport(item);
                  onClosePromptSelector();
                  setValue("");
                  setShowSuggestions(false);
                  setIsOpenStart(false);
                  setIsImportQuestionsPanelOpen(true);
                }}
                className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={forms_logo}
                    alt="form icon"
                    className="w-5 h-5 mt-1"
                  />
                  <div className="text-sm text-right">
                    <div className="font-semibold">{item.name}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(item.createdAt!)}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
