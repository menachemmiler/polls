import { FC } from "react";

type LinearScaleAnswerProps = {
  value: string | number | (string | number)[];
  options?: string[];
};

const RadioSvg = ({ checked = false }: { checked?: boolean }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    style={{ display: "block" }}
  >
    <circle
      cx="12"
      cy="12"
      r="8"
      stroke="#757575"
      strokeWidth="2.5"
      fill="white"
    />
    {checked && <circle cx="12" cy="12" r="5" fill="#424242" />}
  </svg>
);

const LinearScaleAnswer: FC<LinearScaleAnswerProps> = ({ value, options }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-col items-center w-full py-8 gap-4">
      <div className="flex justify-between w-full max-w-lg mb-1">
        {options.map((opt) => (
          <span
            key={opt}
            className="text-sm text-gray-800 w-8 text-center"
            style={{ minWidth: 24 }}
          >
            {opt}
          </span>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-lg">
        {options.map((opt) => (
          <div key={opt} className="flex flex-col items-center">
            <RadioSvg checked={String(value) === String(opt)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinearScaleAnswer;
