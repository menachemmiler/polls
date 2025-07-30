import { useEffect, useState } from "react";
import {
  CreateQuestionDTO,
  IPoll,
  Question,
  QuestionType,
} from "../../types/survey";
import { pollService } from "../../services/pollService";
import { FileInput } from "lucide-react";

interface Props {
  pollToImport: IPoll;
  pollId: string;
  index: number;
  sectionId: string;
  onClose: () => void;
  onPollImported: () => void;
}

type SelectedMap = {
  [sectionId: string]: {
    sectionTitle?: string;
    sectionDescription?: string;
    questionIds: string[];
  };
};

export default function ImportQuestionsPanel({
  pollToImport,
  pollId,
  index: curIndex,
  sectionId: newSectionId,
  onClose,
  onPollImported,
}: Props) {
  const [selected, setSelected] = useState<SelectedMap>({});
  const { mutate: createSection } = pollService.useCreateSection();
  const { mutate: addQuestion } = pollService.useAddQuestion();
  const { mutate: updateSection } = pollService.useUpdateSection();

  const handleImport = async () => {
    if (!selected || Object.keys(selected).length === 0) {
      return;
    }

    try {
      for (const [sectionId, sectionData] of Object.entries(selected)) {
        if (
          (sectionData.sectionTitle || sectionData.sectionDescription) &&
          sectionData.sectionTitle !== ""
        ) {
          const updatedPoll = await new Promise<IPoll>((resolve, reject) => {
            createSection(
              { pollId },
              {
                onSuccess: (data) => resolve(data),
                onError: (error) => reject(error),
              }
            );
          });

          const newSectionIdFromServer =
            updatedPoll.sections[updatedPoll.sections.length - 1]._id;

          const dataToUpdate =
            sectionData.sectionDescription &&
            sectionData.sectionDescription !== ""
              ? {
                  title: sectionData.sectionTitle,
                  description: sectionData.sectionDescription,
                }
              : { title: sectionData.sectionTitle };
          updateSection(
            {
              data: dataToUpdate,
              pollId,
              sectionId: newSectionIdFromServer,
            },
            {
              onSuccess(updatedPoll) {
                console.log(updatedPoll);
              },
              onError(error) {
                console.log({ error });
              },
            }
          );
          if (sectionData.questionIds && sectionData.questionIds.length !== 0) {
            for (const questionId of sectionData.questionIds) {
              const question = pollToImport.sections
                .find((s) => s._id === sectionId)
                ?.questions.find((q) => q._id === questionId);
              if (!question) continue;

              const createQuestion: CreateQuestionDTO = {
                data: {
                  type: question.type,
                  title: question.title,
                  description: question.description || "",
                  options:
                    question.options?.map((o) => ({ option: o.option })) || [],
                  pollId,
                  relatedSectionIds:
                    question.relatedSectionIds?.map(String) || [],
                  index: question.index as number,
                  sectionId: newSectionIdFromServer,
                },
              };

              await new Promise<void>((resolve, reject) => {
                addQuestion(createQuestion, {
                  onSuccess() {
                    resolve();
                  },
                  onError(error) {
                    reject(error);
                  },
                });
              });
            }
          }
        } else if (
          sectionData.questionIds &&
          sectionData.questionIds.length !== 0
        ) {
          for (const [index, questionId] of sectionData.questionIds.entries()) {
            const question = pollToImport.sections
              .find((s) => s._id === sectionId)
              ?.questions.find((q) => q._id === questionId);
            if (!question) continue;

            const createQuestion: CreateQuestionDTO = {
              data: {
                type: question.type,
                title: question.title,
                description: question.description || "",
                options:
                  question.options?.map((o) => ({ option: o.option })) || [],
                pollId,
                relatedSectionIds:
                  question.relatedSectionIds?.map(String) || [],
                index: index + curIndex,
                sectionId: newSectionId,
              },
            };

            await new Promise<void>((resolve, reject) => {
              addQuestion(createQuestion, {
                onSuccess() {
                  resolve();
                },
                onError(error) {
                  reject(error);
                },
              });
            });
          }
        }
      }

      onPollImported();
      onClose();
    } catch (error) {
      console.error("שגיאה בייבוא:", error);
    }
  };

  useEffect(() => {
    console.log("selected:", selected);
  }, [selected]);

  const isQuestionSelected = (sectionId: string, questionId: string) =>
    !!selected[sectionId]?.questionIds?.includes(questionId);

  const isSectionSelected = (sectionId: string) =>
    !!selected[sectionId]?.sectionTitle;

  const toggleQuestion = (sectionId: string, questionId: string) => {
    setSelected((prev) => {
      const current = prev[sectionId] || { questionIds: [] };
      const exists = current.questionIds.includes(questionId);
      const newIds = exists
        ? current.questionIds.filter((id) => id !== questionId)
        : [...current.questionIds, questionId];

      if (newIds.length === 0 && !current.sectionTitle) {
        const rest = Object.fromEntries(
          Object.entries(prev).filter(([key]) => key !== sectionId)
        );
        return rest;
      }

      return {
        ...prev,
        [sectionId]: {
          ...current,
          questionIds: newIds,
        },
      };
    });
  };

  const toggleSection = (sectionId: string, sectionTitle: string) => {
    const section = pollToImport.sections.find((s) => s._id === sectionId);
    const allQuestionIds = section?.questions.map((q) => q._id) || [];
    const sectionDescription = section?.description;

    setSelected((prev) => {
      const current = prev[sectionId];
      const alreadySelected = !!current?.sectionTitle;

      if (alreadySelected) {
        if (!current?.questionIds || current.questionIds.length === 0) {
          const rest = Object.fromEntries(
            Object.entries(prev).filter(([key]) => key !== sectionId)
          );
          return rest;
        }

        return {
          ...prev,
          [sectionId]: { questionIds: current.questionIds },
        };
      }

      return {
        ...prev,
        [sectionId]: {
          sectionTitle,
          sectionDescription,
          questionIds: allQuestionIds,
        },
      };
    });
  };

  const getQuestionDescription = (q: Question): string | null => {
    switch (q.type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.CHECKBOXES:
      case QuestionType.DROPDOWN:
      case QuestionType.MULTIPLE_CHOICE_GRID:
      case QuestionType.CHECKBOX_GRID:
        return `בחירה מרובה: ${
          !q.options?.length ? "אפשרות אחת" : `${q.options.length} אפשרויות`
        }`;
      case QuestionType.SHORT_ANSWER:
        return "תשובה קצרה";
      case QuestionType.PARAGRAPH:
        return "תשובה ארוכה";
      case QuestionType.LINEAR_SCALE:
        return `סולם מ-1 עד ${q.scale || 5}`;
      case QuestionType.RATING:
        return `דירוג מ-1 עד ${q.scale || 5}`;
      case QuestionType.DATE:
        return "תאריך";
      case QuestionType.TIME:
        return "זמן";
      default:
        return null;
    }
  };

  const totalSelectedQuestions = Object.values(selected).reduce(
    (acc, section) => acc + (section.questionIds?.length || 0),
    0
  );

  const totalSelectedSections = Object.values(selected).filter(
    (s) => s.sectionTitle
  ).length;

  const isImportDisabled =
    totalSelectedQuestions === 0 && totalSelectedSections === 0;

  return (
    <div className="fixed top-23 bottom-0 left-0 z-200 shadow-xl w-[340px] bg-white text-right font-sans text-sm border-l border-gray-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between px-4 py-3 border-y border-gray-300 shadow-sm">
          <div className="flex items-center gap-2">
            <FileInput className="text-purple-800" />
            <span className="font-medium text-xl">ייבוא שאלות</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-300 transition duration-200"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-2 border-b border-gray-100">
          <div className="text-gray-800 font-medium text-lg">
            {pollToImport.name || "ללא שם"}
          </div>
          <div
            className="text-blue-700 cursor-pointer hover:underline inline-block"
            onClick={() => {
              console.log("בחר טופס אחר");
            }}
          >
            בחירת טופס אחר
          </div>
        </div>

        {pollToImport.sections.map((section, index) => (
          <div
            key={section._id}
            className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 rounded-md mb-2 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                checked={isSectionSelected(section._id)}
                onChange={() =>
                  toggleSection(
                    section._id,
                    index === 0
                      ? pollToImport.title || "ללא כותרת"
                      : section.title || "ללא כותרת"
                  )
                }
                className="w-5 h-5 cursor-pointer"
              />
              <span className="font-semibold text-lg select-none cursor-pointer">
                קטע:{" "}
                {index === 0
                  ? pollToImport.title || "ללא כותרת"
                  : section.title || "ללא כותרת"}
              </span>
            </div>

            <div className="ml-8 flex flex-col gap-2">
              {section.questions.map((q) => (
                <div
                  key={q._id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isQuestionSelected(section._id, q._id)}
                    onChange={() => toggleQuestion(section._id, q._id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-medium text-base">
                      {q.title || "שאלה ללא כותרת"}
                    </div>
                    {getQuestionDescription(q) && (
                      <div className="text-gray-500 text-sm">
                        {getQuestionDescription(q)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-4">
        <button
          onClick={handleImport}
          disabled={isImportDisabled}
          className={`w-full rounded-md py-3 text-lg font-semibold transition duration-200
            ${
              isImportDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800"
            }
          `}
        >
          ייבוא שאלות
          {`(${totalSelectedQuestions + totalSelectedSections})`}
        </button>
      </div>
    </div>
  );
}
