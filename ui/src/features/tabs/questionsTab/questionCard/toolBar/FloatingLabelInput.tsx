import React from "react";

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChange,
  onKeyDown,
  inputRef,
  autoFocus,
}) => {
  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder=" "
        className="peer w-full px-0 pt-5 pb-1 border-0 border-b bg-transparent focus:outline-none transition-colors border-gray-300 focus:border-blue-500 focus:border-b-2"
        autoFocus={autoFocus}
      />
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none
          text-base text-gray-500
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
          peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500
          ${value ? "top-0 text-xs text-blue-500" : "top-5"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
