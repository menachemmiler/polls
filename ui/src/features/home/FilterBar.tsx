import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  ChevronDown,
  LayoutGrid,
  LayoutList,
  ArrowDownAZ,
  Check,
} from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";

type OwnershipFilter = "all" | "owner" | "notOwner";
export type SortOption =
  | "recentFirst"
  | "oldestFirst"
  | "nameAsc"
  | "nameDesc"
  | "updatedRecently";

interface FilterBarProps {
  viewMode: "grid" | "list";
  ownershipFilter: OwnershipFilter;
  sortOption?: SortOption;
  onViewChange: (mode: "grid" | "list") => void;
  onOwnershipChange: (filter: OwnershipFilter) => void;
  setSortOption?: (option: SortOption) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  viewMode,
  ownershipFilter,
  sortOption,
  onViewChange,
  onOwnershipChange,
  setSortOption,
}) => {
  const { t } = useTranslation();
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsOwnerDropdownOpen(false);
    setIsSortDropdownOpen(false);
  });

  const ownerOptions = [
    { label: t("filterBar.ownership.all"), value: "all" },
    { label: t("filterBar.ownership.owner"), value: "owner" },
    { label: t("filterBar.ownership.notOwner"), value: "notOwner" },
  ];

  const sortByOptions: { label: string; value: SortOption }[] = [
    { label: t("filterBar.sortBy.updatedRecently"), value: "updatedRecently" },
    { label: t("filterBar.sortBy.recentFirst"), value: "recentFirst" },
    { label: t("filterBar.sortBy.oldestFirst"), value: "oldestFirst" },
    { label: t("filterBar.sortBy.nameAsc"), value: "nameAsc" },
    { label: t("filterBar.sortBy.nameDesc"), value: "nameDesc" },
  ];

  return (
    <div
      className="flex items-center justify-between mb-4 text-sm text-gray-600"
      dir="rtl"
    >
      <div className="text-lg font-medium">{t("filterBar.title")}</div>

      <div ref={dropdownRef} className="flex items-center gap-4">
        {/* Owner Dropdown */}
        <div className="relative outline-none" tabIndex={0}>
          <button
            onClick={() => setIsOwnerDropdownOpen((prev) => !prev)}
            className={clsx(
              "flex items-center gap-1 px-3 py-1 rounded-md text-sm",
              isOwnerDropdownOpen
                ? "bg-purple-100"
                : "hover:bg-gray-100 text-gray-700"
            )}
            title={t("filterBar.filterTitle")}
          >
            {ownerOptions.find((o) => o.value === ownershipFilter)?.label}
            <ChevronDown
              size={16}
              className={clsx(
                "transition-transform",
                isOwnerDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {isOwnerDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10 text-right">
              {ownerOptions.map(({ label, value }) => (
                <div
                  key={value}
                  onClick={() => {
                    onOwnershipChange(value as OwnershipFilter);
                    setIsOwnerDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                >
                  <span>{label}</span>
                  {value === ownershipFilter && (
                    <Check size={16} className="text-purple-600" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Toggle */}
        <button
          onClick={() => onViewChange(viewMode === "grid" ? "list" : "grid")}
          aria-label={t("filterBar.viewToggle.ariaLabel")}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          title={t("filterBar.viewToggle.title")}
        >
          {viewMode === "grid" ? (
            <LayoutList size={20} className="text-gray-600" />
          ) : (
            <LayoutGrid size={20} className="text-gray-600" />
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="relative outline-none" tabIndex={0}>
          <button
            onClick={() => setIsSortDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
            aria-haspopup="listbox"
            aria-expanded={isSortDropdownOpen}
            title={t("filterBar.sortTitle")}
          >
            <ArrowDownAZ
              size={20}
              className={clsx(
                "transition-colors",
                isSortDropdownOpen && "text-purple-600"
              )}
            />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-10 text-right">
              {sortByOptions.map(({ label, value }) => (
                <div
                  key={value}
                  onClick={() => {
                    setSortOption?.(value);
                    setIsSortDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                >
                  <span>{label}</span>
                  {value === sortOption && (
                    <Check size={16} className="text-purple-600" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
