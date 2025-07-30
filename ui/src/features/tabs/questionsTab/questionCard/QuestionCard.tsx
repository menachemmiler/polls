import { useState, useEffect } from "react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { DropdownOptions } from "./DropdownOptions";
import { QuestionFooter } from "./QuestionFooter";
import { QUESTION_TYPE_LIST } from "./optionTypeList";
import { Question, QuestionType } from "../../../../types/survey";
import { QuestionMain } from "./QuestionMain";
import { getDefaultContentForType } from "../../../../utils/questionTypeHelpers";
import DynamicOptionsList, {
  getQuestionTypeIcon,
} from "../../../typesQuestions/DynamicOptionsList";
import { MarkdownText } from "../../../../components/shared/MarkdownText";

interface Props {
  question: Question;
  onUpdate: (q: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isActive: boolean;
  onFocus: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  questionDesign?: {
    title: {
      fontSize: number;
      fontFamily: string;
    };
    text: {
      fontSize: number;
      fontFamily: string;
    };
    color: string;
  };
}

export const QuestionCard: React.FC<Props> = ({
  question,
  onUpdate,
  onDelete,
  onDuplicate,
  isActive,
  onFocus,
  dragHandleProps,
  questionDesign,
}) => {
  const [local, setLocal] = useState(question);

  useEffect(() => {
    setLocal(question);
  }, [question]);

  useEffect(() => {
    if (local.type === QuestionType.HEADER) {
      changeType(local.type);
    }
  }, [local.type]);

  const changeType = (t: QuestionType) => {
    const updates = getDefaultContentForType(t, local);
    const q = { ...local, ...updates };
    setLocal(q);
    onUpdate(q);
  };

  const updateLocal = (q: Question) => {
    setLocal(q);
    onUpdate(q);
  };

  const changeOptions = (opts: Question["options"]) => {
    const q = { ...local, options: opts };
    setLocal(q);
    onUpdate(q);
  };
  const questionDesignstyles = {
    title: {
      fontSize: questionDesign?.title.fontSize || 18,
      fontFamily: questionDesign?.title.fontFamily || "Arial",
    },
    text: {
      fontSize: questionDesign?.text.fontSize || 14,
      fontFamily: questionDesign?.text.fontFamily || "Arial",
    },
    color: questionDesign?.color || "#9333ea",
  };

  if (isActive) {
    return (
      <div
        dir="rtl"
        className="relative mx-auto max-w-[720px] rounded-lg border border-gray-300 bg-white hover:border-gray-400"
        onClick={onFocus}
      >
        <div className="absolute top-0 bottom-0 right-0 w-1 rounded-r-lg" style={{ backgroundColor: questionDesignstyles.color }} />
        <div className="px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <QuestionMain
                question={local}
                isActive={isActive}
                dragHandleProps={dragHandleProps}
                onUpdate={updateLocal}
              />
              {local.type === QuestionType.HEADER && (
                <div className="mt-2">
                  <QuestionFooter
                    question={local}
                    onUpdate={updateLocal}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                  />
                </div>
              )}
            </div>
            {local.type !== QuestionType.HEADER && (
              <div className="mt-11">
                <DropdownOptions
                  value={local.type}
                  onChange={changeType}
                  options={QUESTION_TYPE_LIST}
                  placeholder="Select question type"
                />
              </div>
            )}
          </div>
          {local.type !== QuestionType.HEADER && (
            <>
              <div className="flex justify-end">
                <DynamicOptionsList
                  questionType={local.type}
                  initialOptions={local.options}
                  onOptionsChange={changeOptions}
                />
              </div>
              <QuestionFooter
                question={local}
                onUpdate={updateLocal}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="relative mx-auto max-w-[720px] rounded-lg border border-gray-300 bg-white hover:border-gray-400"
    >
      <div className="flex">
        <div className="flex-1 cursor-pointer" onClick={onFocus}>
          <div className="px-6 py-4" dir="rtl">
            <h3 className="mb-3 overflow-hidden break-all text-right text-base font-medium text-gray-900">
              <MarkdownText
                text={local.title || ""}
              />
            </h3>

            {local.type !== QuestionType.HEADER && (
              <>
                {(local.type === QuestionType.MULTIPLE_CHOICE ||
                  local.type === QuestionType.CHECKBOXES ||
                  local.type === QuestionType.DROPDOWN) &&
                local.options?.length ? (
                  <div className="space-y-2">
                    {local.options.map((o, i) => (
                      <div
                        key={o._id || i}
                        className="flex flex-row items-center gap-3"
                      >
                        {local.type === QuestionType.DROPDOWN ? (
                          <span
                            className="overflow-hidden break-all text-right text-gray-700"
                            style={questionDesignstyles.text}
                          >
                            {i + 1}.
                          </span>
                        ) : (
                          getQuestionTypeIcon(local.type, true)
                        )}
                        <span
                          className="overflow-hidden break-all text-right text-gray-700"
                          style={questionDesignstyles.text}
                        >
                          {o.option || `Option ${i + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : local.type === QuestionType.LINEAR_SCALE &&
                  local.options?.length ? (
                  <DynamicOptionsList
                    questionType={QuestionType.LINEAR_SCALE}
                    initialOptions={local.options}
                    onOptionsChange={() => {}}
                    showLinearScalePreview={true}
                  />
                ) : (
                  <div className="mt-3">
                    {getQuestionTypeIcon(local.type, true)}
                  </div>
                )}

                {local.type === "rating" && (
                  <div className="mt-3 flex justify-end gap-2">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <div
                        key={n}
                        className="flex h-8 w-8 items-center justify-center rounded border-2 border-gray-300"
                      >
                        <span
                          className="text-sm text-gray-600"
                          style={questionDesignstyles.text}
                        >
                          {n}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div
          {...dragHandleProps}
          className="px-3 py-4 cursor-move hover:bg-gray-50 flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M7 2a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zM7 18a2 2 0 11-4 0 2 2 0 014 0zM17 2a2 2 0 11-4 0 2 2 0 014 0zM17 10a2 2 0 11-4 0 2 2 0 014 0zM17 18a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
