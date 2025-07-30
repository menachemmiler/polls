import React from "react";
import { Copy, Trash2, MoreVertical } from "lucide-react";
import { Question } from "../../../../types/survey";

interface QuestionFooterProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const QuestionFooter: React.FC<QuestionFooterProps> = ({
  question,
  onUpdate,
  onDelete,
  onDuplicate,
}) => {
  return (
<div
  dir="rtl"
  className="flex justify-start mt-6 pt-4 border-t border-gray-200"
>
  <div className="flex items-center gap-2 mr-auto">
    <button
      onClick={onDuplicate}
      className="p-2 hover:bg-gray-100 rounded transition-colors"
      title="שכפל שאלה"
    >
      <Copy className="w-5 h-5 text-gray-600" />
    </button>

    <button
      onClick={onDelete}
      className="p-2 hover:bg-gray-100 rounded transition-colors"
      title="מחק שאלה"
    >
      <Trash2 className="w-5 h-5 text-gray-600" />
    </button>

    <div className="w-px h-6 bg-gray-300 mx-3" />

    <span className="text-sm text-gray-600">חובה</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={question.isRequired}
        onChange={(e) =>
          onUpdate({ ...question, isRequired: e.target.checked })
        }
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
    </label>

    <button
      className="p-2 hover:bg-gray-100 rounded transition-colors"
      title="עוד אפשרויות"
    >
      <MoreVertical className="w-5 h-5 text-gray-600" />
    </button>
  </div>
</div>




  );
};
