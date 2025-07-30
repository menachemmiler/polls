import { forwardRef } from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  text: string;
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ active, onClick, text }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={`px-2 font-medium text-[17px] tracking-tight transition-all border-b-[3px] ${
        active
          ? "text-[#673ab7] border-[#673ab7]"
          : "text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa] border-transparent"
      }`}
    >
      {text}
    </button>
  )
);
