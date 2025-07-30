import { FC } from "react";

interface CustomCheckboxProps {
  checked: boolean;
}

const CustomCheckbox: FC<CustomCheckboxProps> = ({ checked }) => {
  return (
    <span
      className={[
        "inline-block w-5 h-5 rounded-sm relative mr-2 box-border transition-colors duration-200 align-middle",
        "border-2",
        checked ? "border-[#4d2b87] bg-[#4d2b87]" : "border-[#c7c7c7] bg-white",
      ].join(" ")}
    >
      {checked && (
        <svg
          className="absolute left-1 top-1 w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 16 16"
        >
          <path d="M-0 5L5 10L14 0" stroke="currentColor" strokeWidth="3" />
        </svg>
      )}
    </span>
  );
};

export default CustomCheckbox;
