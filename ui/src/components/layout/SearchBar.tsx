import React from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center w-full max-w-sm px-4 py-2 bg-white rounded-full border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <Search className="w-5 h-5 text-gray-500 ml-2" />
      <input
        type="text"
        placeholder={t("common.search")}
        className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-500"
      />
    </div>
  );
};

export default SearchBar;
