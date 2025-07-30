import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, X } from "lucide-react";
import { QuestionType } from "../../types/survey";

interface OptionItem {
  _id?: string;
  option: string;
}

interface Props {
  initialOptions?: OptionItem[];
  onOptionsChange: (options: OptionItem[]) => void;
  questionType: QuestionType;
  showLinearScalePreview?: boolean;
}

export const getQuestionTypeIcon = (
  type: QuestionType,
  isInactive?: boolean
) => {
  switch (type) {
    case QuestionType.MULTIPLE_CHOICE:
      return <div className="w-4 h-4 rounded-full border border-gray-400" />;
    case QuestionType.CHECKBOXES:
      return <div className="w-4 h-4 border border-gray-400" />;
    case QuestionType.DROPDOWN:
      return (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 5L8 10L13 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case QuestionType.SHORT_ANSWER:
      if (isInactive) {
        return (
          <input
            type="text"
            placeholder="תשובת טקסט קצרה"
            disabled
            className="w-full border-b border-gray-300 pb-1 text-sm text-gray-500 bg-transparent cursor-not-allowed"
          />
        );
      }
      return (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 8H14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case QuestionType.PARAGRAPH:
      if (isInactive) {
        return (
          <input
            type="text"
            placeholder="תשובת טקסט ארוכה"
            disabled
            className="w-full border-b border-gray-300 pb-1 text-sm text-gray-500 bg-transparent cursor-not-allowed"
          />
        );
      }
      return (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 4H14M2 8H14M2 12H10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case QuestionType.DATE:
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-sm">שנה חודש יום</span>
          <CalendarDays className="w-6 h-6" />
        </div>
      );

    case QuestionType.TIME:
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-sm">שעה</span>
          <Clock3 className="w-6 h-6" />
        </div>
      );

    default:
      return null;
  }
};

const getNextOptionLabel = (options: OptionItem[]) => {
  const max = options.reduce((acc, opt) => {
    const match = opt.option.match(/^אפשרות (\d+)$/);
    const num = match ? parseInt(match[1]) : 0;
    return Math.max(acc, num);
  }, 0);
  return `אפשרות ${max + 1}`;
};

const getTypeLabel = (type: QuestionType) => {
  switch (type) {
    case QuestionType.SHORT_ANSWER:
      return "טקסט של תשובה קצרה";
    case QuestionType.PARAGRAPH:
      return "טקסט של תשובה ארוכה";
    case QuestionType.DATE:
      return "יום‚ חודש‚ שנה";
    case QuestionType.TIME:
      return "שעה";
    default:
      return "אפשרות";
  }
};

const getMinMaxFromOptions = (
  opts: OptionItem[]
): { min: number; max: number } => {
  if (!opts || !opts.length) return { min: 1, max: 5 };
  const nums = opts.map((o) => Number(o.option)).filter((n) => !isNaN(n));
  if (!nums.length) return { min: 1, max: 5 };
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return {
    min: min === 0 || min === 1 ? min : 1,
    max: Math.max(min + 1, Math.min(max, 10)),
  };
};

export default function DynamicOptionsList({
  initialOptions = [{ option: "אפשרות 1" }],
  onOptionsChange,
  questionType,
  showLinearScalePreview = false,
}: Props) {
  const [options, setOptions] = useState<OptionItem[]>(initialOptions);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const isLinearScale = questionType === QuestionType.LINEAR_SCALE;
  const [linearRange, setLinearRange] = useState<{ min: number; max: number }>(
    getMinMaxFromOptions(initialOptions)
  );

  useEffect(() => {
    if (isLinearScale) {
      setLinearRange(getMinMaxFromOptions(initialOptions));
    }
  }, [isLinearScale, initialOptions]);

  useEffect(() => {
    if (isLinearScale) {
      let min = linearRange.min;
      let max = linearRange.max;
      if (min < 0) min = 0;
      if (min > 1) min = 1;
      if (max <= min) max = min + 1;
      if (max > 10) max = 10;
      if (max < 2) max = 2;

      const newOptions: OptionItem[] = [];
      for (let i = min; i <= max; i++) {
        newOptions.push({ option: String(i) });
      }
      setOptions(newOptions);
      onOptionsChange(newOptions);
    }
  }, [isLinearScale, linearRange.min, linearRange.max]);

  const isEditableType = [
    QuestionType.MULTIPLE_CHOICE,
    QuestionType.CHECKBOXES,
    QuestionType.DROPDOWN,
  ].includes(questionType);

  useEffect(() => {
    if (!isLinearScale && isEditableType) {
      setOptions(
        initialOptions.length ? initialOptions : [{ option: "אפשרות 1" }]
      );
    }
  }, [initialOptions, questionType, isLinearScale]);

  const handleAddOption = () => {
    const newLabel = getNextOptionLabel(options);
    const updated = [...options, { option: newLabel }];
    setOptions(updated);
    setEditingIndex(updated.length - 1);
    onOptionsChange(updated);
  };

  const handleOptionChange = (value: string, index: number) => {
    const updated = [...options];
    updated[index] = { ...updated[index], option: value };
    setOptions(updated);
    onOptionsChange(updated);
  };

  const handleBlur = (index: number) => {
    const updated = [...options];
    if (!updated[index].option.trim()) {
      const newLabel = getNextOptionLabel(
        updated.filter((_, i) => i !== index)
      );
      updated[index] = { ...updated[index], option: newLabel };
    }
    setOptions(updated);
    onOptionsChange(updated);
    setEditingIndex(null);
  };

  const handleRemove = (index: number) => {
    const updated = [...options];
    updated.splice(index, 1);
    const result = updated.length ? updated : [{ option: "אפשרות 1" }];
    setOptions(result);
    onOptionsChange(result);
  };

  const renderIcon = (idx?: number) => {
    switch (questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="w-4 h-4 rounded-full border border-gray-400 shrink-0" />
        );
      case QuestionType.CHECKBOXES:
        return <div className="w-4 h-4 border border-gray-400 shrink-0" />;
      case QuestionType.DROPDOWN:
        return (
          <span className="w-5 text-sm text-right font-medium">
            {(idx ?? options.length) + 1}.
          </span>
        );
      default:
        return null;
    }
  };

  if (isLinearScale && !showLinearScalePreview) {
    return (
      <div className="space-y-2 flex flex-col justify-start w-full" dir="rtl">
        <div className="flex items-center gap-2 mb-2">
          <span>טווח:</span>
          <select
            value={linearRange.min}
            onChange={(e) =>
              setLinearRange((prev) => ({
                ...prev,
                min: Number(e.target.value),
                max: Math.max(prev.max, Number(e.target.value) + 1),
              }))
            }
            className="w-14 border border-gray-300 rounded px-2 z-2"
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
          </select>
          <span>עד</span>
          <select
            value={linearRange.max}
            onChange={(e) =>
              setLinearRange((prev) => ({
                ...prev,
                max: Number(e.target.value),
              }))
            }
            className="w-14 border border-gray-300 rounded px-2 z-2"
          >
            {Array.from({ length: 10 - linearRange.min }, (_, i) => {
              const val = i + linearRange.min + 1;
              return (
                <option key={val} value={val}>
                  {val}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }

  if (isLinearScale && showLinearScalePreview) {
    return (
      <div className="items-center justify-center w-full space-y-2 px-20 py-8">
        <div className="flex flex-row-reverse items-center gap-8">
          {options.map((opt, idx) => (
            <label
              key={idx}
              className="flex flex-col gap-4 w-full items-center cursor-pointer"
            >
              <span className="mb-1">{opt.option}</span>
              <input
                type="radio"
                name="linear-scale-demo"
                value={opt.option}
                className="w-5 h-5"
              />
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (!isEditableType) {
    return (
      <div
        dir="rtl"
        className="px-2 py-2 text-sm text-gray-700 border-b border-gray-300 w-full text-right"
      >
        {getTypeLabel(questionType)}
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-1 w-full">
      {options.map((opt, idx) => (
        <div key={opt._id || idx} className="relative px-2">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: editingIndex === idx ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 right-8 left-6 h-[2px] bg-purple-600 origin-center"
          />
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 w-full">
              {renderIcon(idx)}
              {editingIndex === idx ? (
                <input
                  autoFocus
                  value={opt.option}
                  onChange={(e) => handleOptionChange(e.target.value, idx)}
                  onBlur={() => handleBlur(idx)}
                  className="text-sm w-full bg-transparent border-none outline-none"
                  placeholder={getNextOptionLabel(
                    options.filter((_, i) => i !== idx)
                  )}
                />
              ) : (
                <div
                  onClick={() => setEditingIndex(idx)}
                  className="text-sm w-full cursor-text"
                >
                  {opt.option}
                </div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <X
                size={18}
                className="text-gray-600 cursor-pointer ml-2 shrink-0"
                onClick={() => handleRemove(idx)}
              />
            </motion.div>
          </div>
        </div>
      ))}
      <div className="relative px-2">
        <div
          onClick={handleAddOption}
          className="flex items-center justify-between py-1 text-sm text-gray-600 hover:underline cursor-pointer"
        >
          <div className="flex items-center gap-2 w-full">
            {renderIcon()}
            <div>הוספת אפשרות</div>
          </div>
          <X size={18} className="opacity-0 ml-2" />
        </div>
      </div>
    </div>
  );
}
