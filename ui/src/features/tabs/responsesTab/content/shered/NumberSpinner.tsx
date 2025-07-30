import { FC, useRef, useState, useEffect } from "react";

type NumberSpinnerProps = {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
};

const NumberSpinner: FC<NumberSpinnerProps> = ({
  value,
  min,
  max,
  onChange,
}) => {
  const [input, setInput] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput(String(value));
  }, [value]);

  const clamp = (v: number) => Math.max(min, Math.min(v, max));

  const handleBlur = () => {
    const num = Number(input);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    } else {
      setInput(String(value));
    }
  };

  return (
    <div className="relative flex items-center mx-1">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={input}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") inputRef.current?.blur();
          if (e.key === "ArrowUp") onChange(clamp(value + 1));
          if (e.key === "ArrowDown") onChange(clamp(value - 1));
        }}
        className="
          w-15 h-8 text-center text-[17px] text-gray-900
          bg-transparent border-0 border-b border-[#6f36b8]
          outline-none focus:ring-0 p-0
          transition
          font-normal
          appearance-none
          focus:border-[#6f36b8]
          select-none
          pr-7
        "
        style={{ fontFamily: "inherit", letterSpacing: "0" }}
        aria-label="question index"
      />
      <div className="absolute right-0 top-0 flex flex-col justify-center h-full">
        <button
          className={`w-6 h-4 flex items-center justify-center 
            text-gray-400 hover:text-[#6f36b8] 
            ${value >= max ? "opacity-20" : ""}
            transition rounded-t`}
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= max}
          tabIndex={-1}
          aria-label="next"
          type="button"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 7l5 5H5l5-5z" />
          </svg>
        </button>
        <button
          className={`w-6 h-4 flex items-center justify-center 
            text-gray-400 hover:text-[#6f36b8] 
            ${value <= min ? "opacity-20" : ""}
            transition rounded-b`}
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          tabIndex={-1}
          aria-label="previous"
          type="button"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 13l5-5H5l5 5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NumberSpinner;
