import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import forms_logo from "../../assets/forms_logo.svg";
import { useNavigate } from "react-router-dom";
import { IPoll } from "../../types/survey";
import { formatDate } from "../../utils/formatDate";

interface Props {
  polls: IPoll[];
}

const LOCAL_STORAGE_KEY = "recentSearchTerms";
const MAX_RECENT = 5;

export default function SearchForm({ polls }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isClickInsideSuggestion = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed.slice(0, MAX_RECENT));
        }
      } catch {}
    }
  }, []);

  const saveSearchTerm = (term: string) => {
    const updated = [term, ...searchHistory.filter((t) => t !== term)].slice(
      0,
      MAX_RECENT
    );
    setSearchHistory(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSearch = (term: string) => {
    setValue(term);
    saveSearchTerm(term);
    setTimeout(() => setShowSuggestions(true), 0); // פותח שוב
  };

  const filteredItems = value.trim()
    ? polls.filter((poll) =>
        poll.name?.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="relative w-full max-w-full sm:max-w-[700px] flex-shrink min-w-0 z-10"
    >
      {/* search bar */}
      <div className="flex items-center h-12 bg-slate-100 rounded-full px-6 py-4 w-full shadow-sm focus-within:bg-white transition-colors duration-200">
        <FiSearch className="text-gray-500 ml-4 w-6 h-6" />
        <input
          type="text"
          placeholder={t("SearchForm.searchPlaceholder")}
          className="bg-transparent border-none outline-none w-full text-xl text-right placeholder-gray-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            if (!isClickInsideSuggestion.current) {
              setShowSuggestions(false);
            }
          }}
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="text-gray-500 hover:bg-gray-200 rounded-full p-1 transition-colors"
          >
            <MdOutlineClose size={18} />
          </button>
        )}
      </div>

      {/* suggestions */}
      {showSuggestions && (value.trim() || searchHistory.length > 0) && (
        <ul
          className="absolute right-0 left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-96 overflow-y-auto"
          onMouseDown={() => {
            isClickInsideSuggestion.current = true;
          }}
          onMouseUp={() => {
            setTimeout(() => {
              isClickInsideSuggestion.current = false;
            }, 0);
          }}
        >
          {value.trim() ? (
            filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li
                  key={item._id}
                  onMouseDown={() => {
                    saveSearchTerm(value);
                    navigate(`/poll/${item._id}`);
                    setValue("");
                    setShowSuggestions(false);
                  }}
                  className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={forms_logo}
                      alt={t("SearchForm.formIcon")}
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
              ))
            ) : (
              <li className="text-center text-sm text-gray-500 py-4">
                {t("SearchForm.noResults")}
              </li>
            )
          ) : (
            <>
              {searchHistory.map((term, idx) => (
                <li
                  key={idx}
                  onMouseDown={() => handleSearch(term)}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-right"
                >
                  <FiSearch className="text-gray-500" />
                  {term}
                </li>
              ))}
              {searchHistory.length > 0 && (
                <li className="px-4 py-2 text-left text-xs text-gray-500 border-t border-gray-200">
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSearchHistory([]);
                      localStorage.removeItem(LOCAL_STORAGE_KEY);
                    }}
                    className=" text-red-500  cursor-pointer"
                  >
                    {t("SearchForm.clearSearchHistory")}
                  </button>
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
