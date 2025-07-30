import React from "react";

type TabType = "summary" | "question" | "individual";
const TABS: { label: string; value: TabType }[] = [
  { label: "סיכום", value: "summary" },
  { label: "שאלה", value: "question" },
  { label: "יחידה", value: "individual" },
];

const StatisticsTabs: React.FC<{
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}> = ({ activeTab, onTabChange }) => (
  <div
    role="tablist"
    className="flex w-full border-b border-gray-200 select-none"
  >
    {TABS.map((tab) => (
      <div
        key={tab.value}
        role="tab"
        aria-selected={activeTab === tab.value}
        tabIndex={0}
        aria-label={tab.label}
        onClick={() => onTabChange(tab.value)}
        className="
          flex-1 flex justify-center items-end cursor-pointer py-0 px-0 outline-none
          active:bg-accent focus-visible:bg-[#ebe7f6] transition
        "
        style={{ minWidth: 0 }}
      >
        <div className="flex flex-col items-center w-fit px-4 pb-0 pt-2">
          <span
            className={[
              "font-medium",
              "text-[14px]",
              activeTab === tab.value ? "text-[#4C2B87]" : "text-[#202124]",
            ].join(" ")}
            style={{ fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif" }}
          >
            {tab.label}
          </span>
          <div
            className={[
              "h-[3px] mt-2 w-full rounded-full transition-all duration-200",
              activeTab === tab.value ? "bg-[#4C2B87]" : "bg-transparent",
            ].join(" ")}
          />
        </div>
      </div>
    ))}
  </div>
);

export default StatisticsTabs;
