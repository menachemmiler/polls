import { useEffect, useState } from "react";
import { pollService } from "../../services/pollService";
import { IPoll } from "../../types/survey";
import FormDisplay from "../home/FormDisplay";
import {
  LayoutGrid,
  List,
  ArrowRight,
} from "lucide-react";
import { OwnershipFilter } from "../../pages/HomePage";
import forms_logo from "../../assets/forms_logo.svg";
import lastMonthIcon from "../../assets/lastMonthIcon.png";
import todayIcon from "../../assets/todayIcon.png";
import lastWeekIcon from "../../assets/lastWeekIcon.png";
import last90DaysIcon from "../../assets/last90DaysIcon.png";
import peapleIcon from "../../assets/peapleIcon.png";
import notOwnerIcon from "../../assets/notOwnerIcon.png";
import { categorizePollByDate } from "../../utils/formatDate";
import BasicSearchForm from "./BasicSearchForm";

type DateFilter = "all" | "today" | "thisWeek" | "30Days" | "90Days";

interface PromptSelectorFromPollsProps {
  onClose: () => void;
  setPollToImport: (poll: IPoll | null) => void;
  setIsImportQuestionsPanelOpen: (isOpen: boolean) => void;
}

export default function PromptSelectorFromPolls({
  onClose,
  setPollToImport,
  setIsImportQuestionsPanelOpen,
}: PromptSelectorFromPollsProps) {
  const { data, isError, isSuccess } = pollService.useGetMyPolls();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isOpenStart, setIsOpenStart] = useState(false);
  const [isOpenOwnerSearch, setIsOpenOwnerSearch] = useState(false);
  const [isOpenDateSearch, setIsOpenDateSearch] = useState(false);
  const [dateFilfer, setDateFilfer] = useState<DateFilter>("all");
  const [ownershipFilter, setOwnershipFilter] =
    useState<OwnershipFilter>("all");
  const [allPollsForFilter, setAllPollsForFilter] = useState<IPoll[]>([]);

  useEffect(() => {
    if (!data) return;
    const newPolls =
      ownershipFilter === "all"
        ? [...data.owner, ...data.editor]
        : ownershipFilter === "owner"
        ? data.owner
        : data.editor;

    setAllPollsForFilter(newPolls);
    setFilteredPolls(newPolls);
  }, [ownershipFilter, data]);
  const [filteredPolls, setFilteredPolls] = useState<IPoll[]>([]);

  if (isError) return <div>שגיאה בטעינת הסקרים</div>;
  if (!isSuccess || !data) return <div>טוען...</div>;

  const pollsByCategory: Record<string, IPoll[]> = {};

  for (const poll of filteredPolls) {
    const category = categorizePollByDate(poll);
    if (!pollsByCategory[category]) {
      pollsByCategory[category] = [];
    }
    pollsByCategory[category].push(poll);
  }

  const handleSetViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const handleClearFilters = () => {
    setDateFilfer("all");
    setOwnershipFilter("all");
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className="bg-white text-gray-900 w-2/3 h-2/3 rounded-lg shadow-xl pt-4 flex flex-col overflow-hidden">
        <div className="flex px-5 h-10">
          {ownershipFilter === "all" && dateFilfer === "all" ? (
            <div className="w-1/6 flex items-center justify-center gap-3">
              <img src={forms_logo} alt="Forms Logo" className="h-5" />
              <div className="">בחירת טופס</div>
            </div>
          ) : (
            <div className="w-1/6 flex items-center justify-center ">
              <button
                onClick={handleClearFilters}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-300 transition duration-200"
              >
                <ArrowRight />
              </button>
              הקודם
            </div>
          )}
          <div className="relative w-4/6 max-w-2xl mx-auto flex flex-col gap-3">
            <div className="relative">
              {data && (
                <BasicSearchForm
                  polls={allPollsForFilter}
                  setFilteredPolls={setFilteredPolls}
                  onFocus={() => setIsOpenStart(true)}
                  setIsOpenStart={(isOpen) => setIsOpenStart(isOpen)}
                  setPollToImport={setPollToImport}
                  onClosePromptSelector={onClose}
                  setIsImportQuestionsPanelOpen={setIsImportQuestionsPanelOpen}
                />
              )}
              {isOpenStart && (
                <div className="absolute top-full right-0 mt-1 w-full max-h-60 overflow-y-auto rounded-md bg-white shadow-lg border border-gray-200 z-50">
                  <div className="py-1 text-right">
                    <div
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsOpenStart(false);
                        setIsOpenOwnerSearch(true);
                      }}
                    >
                      <img className="w-6 h-6 text-gray-600" src={peapleIcon} />
                      <span className="text-sm text-gray-700">בעלים</span>
                    </div>
                    <div
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsOpenDateSearch(true);
                        setIsOpenStart(false);
                      }}
                    >
                      <img className="w-6 h-6 text-gray-600" src={todayIcon} />
                      <span className="text-sm text-gray-700">
                        תאריך השינוי
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isOpenOwnerSearch && (
                <div className="absolute top-full right-0 mt-1 w-full max-h-60 overflow-y-auto rounded-md bg-white shadow-lg border border-gray-200 z-50">
                  <div className="py-1 text-right">
                    <div
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsOpenOwnerSearch(false);
                        setOwnershipFilter("owner");
                      }}
                    >
                      <img className="w-7 h-7 text-gray-600" src={peapleIcon} />
                      <span className="text-sm text-gray-700">בבעלות שלי</span>
                    </div>
                    <div
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsOpenOwnerSearch(false);
                        setOwnershipFilter("notOwner");
                      }}
                    >
                      <img className="w-6 h-6 text-gray-600" src={notOwnerIcon} />
                      <span className="text-sm text-gray-700">לא בבעלותי</span>
                    </div>
                  </div>
                </div>
              )}
              {isOpenDateSearch && (
                <div className="absolute top-full right-0 mt-1 w-full max-h-60 overflow-y-auto rounded-md bg-white shadow-lg border border-gray-200 z-50">
                  <div className="py-1 text-right">
                    <div
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsOpenDateSearch(false);
                        setDateFilfer("today");
                      }}
                    >
                      <img className="w-6 h-6 text-gray-600" src={todayIcon} />
                      <span className="text-sm text-gray-700">היום</span>
                    </div>
                    <div
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsOpenDateSearch(false);
                        setDateFilfer("thisWeek");
                      }}
                    >
                      <img
                        className="w-6 h-6 text-gray-600"
                        src={lastWeekIcon}
                      />
                      <span className="text-sm text-gray-700">
                        7 הימים האחרונים
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsOpenDateSearch(false);
                        setDateFilfer("30Days");
                      }}
                    >
                      <img
                        className="w-6 h-6 text-gray-600"
                        src={lastMonthIcon}
                      />
                      <span className="text-sm text-gray-700">
                        30 הימים האחרונים
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsOpenDateSearch(false);
                        setDateFilfer("90Days");
                      }}
                    >
                      <img
                        className="w-6 h-6 text-gray-600"
                        src={last90DaysIcon}
                      />
                      <span className="text-sm text-gray-700">
                        90 הימים האחרונים
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-1/6 flex justify-end">
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-300 transition duration-200"
            >
              ✕
            </button>
          </div>
        </div>
        {ownershipFilter === "all" && dateFilfer === "all" && (
          <div className="flex gap-2 mt-6 justify-end border-t border-b border-gray-200 px-4 py-2">
            <button
              onClick={() => handleSetViewMode()}
              className={`p-2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-300 transition duration-200`}
              title={viewMode === "grid" ? "רשימה" : "רשת"}
            >
              {viewMode === "list" ? (
                <LayoutGrid size={20} />
              ) : (
                <List size={20} />
              )}
            </button>
          </div>
        )}
        <div
          className={`overflow-y-auto flex justify-center mt-3 ${
            viewMode === "grid"
              ? "flex flex-wrap gap-4 px-4"
              : "flex flex-col gap-2"
          }`}
        >
          {dateFilfer === "all" &&
            [
              "היום",
              "השבוע",
              "חודש שעבר",
              "מוקדם יותר השנה",
              "שנה שעברה",
              "מוקדם יותר",
            ].map((category) =>
              pollsByCategory[category]?.length ? (
                <div key={category} className="w-full">
                  <h3
                    className={`text-base  text-right text-gray-500 ${
                      viewMode === "list" && "px-8"
                    }`}
                  >
                    {category}
                  </h3>
                  <div
                    className={`mt-2 ${
                      viewMode === "grid"
                        ? "flex flex-wrap gap-4"
                        : "flex flex-col"
                    }`}
                  >
                    {pollsByCategory[category].map((poll) => (
                      <div
                        key={poll._id}
                        onClick={() => setIsImportQuestionsPanelOpen(true)}
                      >
                        <FormDisplay
                          onClosePromptSelector={onClose}
                          isSelectorMode={true}
                          poll={poll}
                          viewMode={viewMode}
                          setPollToImport={setPollToImport}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}

          {dateFilfer !== "all" && (
            <div
              className={`mt-2 w-full ${
                viewMode === "grid" ? "flex flex-wrap gap-4" : "flex flex-col "
              }`}
            >
              {filteredPolls
                .filter((poll) => {
                  const createdAt = new Date(poll.createdAt!);
                  const now = new Date();
                  const startOfToday = new Date();
                  startOfToday.setHours(0, 0, 0, 0);

                  const diffMs = now.getTime() - createdAt.getTime();
                  const diffDays = diffMs / (1000 * 60 * 60 * 24);

                  switch (dateFilfer) {
                    case "today":
                      return createdAt >= startOfToday;
                    case "thisWeek":
                      return diffDays <= 7;
                    case "30Days":
                      return diffDays <= 30;
                    case "90Days":
                      return diffDays <= 90;
                    default:
                      return true;
                  }
                })
                .map((poll) => (
                  <div
                    key={poll._id}
                    onClick={() => setIsImportQuestionsPanelOpen(true)}
                  >
                    <FormDisplay
                      onClosePromptSelector={onClose}
                      isSelectorMode={true}
                      poll={poll}
                      viewMode={viewMode}
                      setPollToImport={setPollToImport}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
