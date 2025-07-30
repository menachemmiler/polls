import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "../../../../hooks/useClickOutside";

interface DropdownOption<T> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  isNew?: boolean;
}

interface DropdownProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

export function DropdownOptions<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select option",
  className = "",
  buttonClassName = "",
  menuClassName = "",
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const selected = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between pr-4 pl-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 min-w-[180px] ${buttonClassName}`}
      >
        <div className="flex items-center gap-1">
          {selected?.icon && <selected.icon className="w-4 h-4 shrink-0" />}
          <span className="text-left text-sm truncate">
            {selected?.label || placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          dir="rtl"
          className={`absolute right-0 top-1/2 -translate-y-1/3 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-64 max-h-96 overflow-y-auto ${menuClassName}`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-sm text-right border-b border-gray-100 last:border-b-0 ${
                option.value === value ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {option.icon && <option.icon className="w-4 h-4 ml-1" />}
                <span>{option.label}</span>
              </div>

              {option.isNew && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  חדש
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
