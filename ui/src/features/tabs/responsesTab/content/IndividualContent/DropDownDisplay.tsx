import { FC } from "react";

interface DropDownDisplayProps {
  value?: string;
  placeholder?: string;
  className?: string;
}

const DropDownDisplay: FC<DropDownDisplayProps> = ({
  value,
  placeholder = "בחר",
  className = "",
}) => {
  return (
    <div className={`relative w-56 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 rounded-md border border-gray-300 bg-white min-h-[48px] text-gray-700 text-base shadow-sm cursor-default select-none">
        <span className={value ? "" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <svg
          className="w-5 h-5 text-gray-400 ml-2"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default DropDownDisplay;
