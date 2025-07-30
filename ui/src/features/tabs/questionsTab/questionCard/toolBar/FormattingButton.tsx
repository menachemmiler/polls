import React from "react";

interface FormattingButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  isActive?: boolean;
  onAction: () => void;
}

export const FormattingButton: React.FC<FormattingButtonProps> = (props) => {
  return (
    <button
      className={`relative group p-1.5 rounded transition-colors ${
        props.isActive
          ? "bg-blue-100 text-blue-600"
          : "hover:bg-gray-200 text-gray-600 hover:text-black"
      }`}
      onClick={props.onAction}
      onMouseDown={(e) => e.preventDefault()}
      title={props.tooltip}
    >
      {props.icon}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {props.tooltip}
      </span>
    </button>
  );
};
