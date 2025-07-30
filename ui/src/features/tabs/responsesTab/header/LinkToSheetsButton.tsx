import React from "react";
import SheetsPlusIcon from "./SheetsPlusIcon";

const LinkToSheetsButton: React.FC<{ onClick?: () => void }> = ({
  onClick,
}) => (
  <div className="relative flex flex-col items-center group">
    <button
      type="button"
      className="
        bg-transparent p-0 border-0 flex items-center
        hover:bg-[#e3eefc] focus:outline-none cursor-pointer
        rounded px-4 py-2
      "
      onClick={onClick}
    >
      <SheetsPlusIcon size={20} />
      <span className="font-[500] text-[#1263cd] text-[12px] mr-2">
        Link to Sheets
      </span>
    </button>
    <span
      className="
    opacity-0 group-hover:opacity-100
    pointer-events-none
    transition
    absolute
    top-[110%]
    right-1/2
    translate-x-1/2
    bg-gray-500 text-white px-2 py-0.5
    text-[10px] shadow
    whitespace-nowrap
    z-50
  "
    >
      Sends responses to a spreadsheet
    </span>
  </div>
);

export default LinkToSheetsButton;
