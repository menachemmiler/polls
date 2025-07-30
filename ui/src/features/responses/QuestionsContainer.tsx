import clsx from "clsx";
import { useEffect } from "react";
import { IAnswer, IPoll, QuestionType } from "../../types/survey";
import QuestionCard from "./questionCard/QuestionCard";
import ShortAnswerRespons from "./questionCard/ShortAnswerRespons";
import ParagraphRespons from "./questionCard/ParagraphRespons";

const questionsContainer = clsx("space-y-4", "mt-4");

interface Prpos {
  poll: IPoll;
  currentSectionIndex: number;
  responses: Record<string, IAnswer>;
  setResponses: React.Dispatch<React.SetStateAction<Record<string, IAnswer>>>;
}

const safeArr = (arr: string[] | undefined | null) => arr ?? [];

const QuestionsContainer = ({
  poll,
  currentSectionIndex,
  responses,
  setResponses,
}: Prpos) => {
  const questions = poll.sections[currentSectionIndex].questions;
  const handleResponseChange = (questionId: string, answer: string[]) => {
    setResponses((prev) => {
      const existingResponse = prev[questionId];
      return {
        ...prev,
        [questionId]: {
          answer,
          questionId: questionId,
          questionType:
            existingResponse?.questionType ??
            questions.find((q) => q._id === questionId)?.type ??
            "",
        },
      };
    });
  };

  useEffect(() => {}, [responses]);

  return (
    <div className={questionsContainer}>
      {questions.map((curQuestion, index) => (
        <div>
          {currentSectionIndex !== 0 &&
            poll.sections[currentSectionIndex].title &&
            index === 0 && (
              <div className="w-full bg-purple-700 h-14 rounded-t-lg text-white flex items-center px-4 text-lg font-semibold">
                {poll.sections[currentSectionIndex].title}
              </div>
            )}
          <QuestionCard key={curQuestion._id} curQuestion={curQuestion}>
            {/* תשובה קצרה */}
            {curQuestion.type === QuestionType.SHORT_ANSWER && (
              <ShortAnswerRespons
                type="text"
                value={safeArr(responses[curQuestion._id]?.answer)[0] ?? ""}
                onChange={(e) =>
                  handleResponseChange(curQuestion._id, [e.target.value])
                }
                placeholder="Your answer"
              />
            )}

            {/* תשובת פסקה */}
            {curQuestion.type === QuestionType.PARAGRAPH && (
              <ParagraphRespons
                value={safeArr(responses[curQuestion._id]?.answer)[0] ?? ""}
                onChange={(e) =>
                  handleResponseChange(curQuestion._id, [e.target.value])
                }
                placeholder="Your answer"
              />
            )}

            {/* בחירה בודדת */}
            {curQuestion.type === QuestionType.MULTIPLE_CHOICE && (
              <div className="space-y-2">
                {curQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      id={`${curQuestion._id}-${index}`}
                      name={curQuestion._id}
                      value={option.option}
                      checked={safeArr(
                        responses[curQuestion._id]?.answer
                      ).includes(option.option)}
                      onChange={() =>
                        handleResponseChange(curQuestion._id, [option.option])
                      }
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <label
                      htmlFor={`${curQuestion._id}-${index}`}
                      className="ms-2 text-gray-700"
                      style={{
                        fontSize: `${poll.design?.text?.fontSize || 14}px`,
                        fontFamily: poll.design?.text?.fontFamily || "Arial",
                      }}
                    >
                      {option.option}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* בחירה מרובה */}
            {curQuestion.type === QuestionType.CHECKBOXES && (
              <div className="space-y-2">
                {curQuestion.options?.map((option, index) => {
                  const currentValues = safeArr(
                    responses[curQuestion._id]?.answer
                  );
                  return (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${curQuestion._id}-${index}`}
                        checked={currentValues.includes(option.option)}
                        onChange={() => {
                          if (currentValues.includes(option.option)) {
                            handleResponseChange(
                              curQuestion._id,
                              currentValues.filter(
                                (item: string) => item !== option.option
                              )
                            );
                          } else {
                            handleResponseChange(curQuestion._id, [
                              ...currentValues,
                              option.option,
                            ]);
                          }
                        }}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                      />
                      <label
                        htmlFor={`${curQuestion._id}-${index}`}
                        className="ms-2 text-gray-700"
                        style={{
                          fontSize: `${poll.design?.text?.fontSize || 14}px`,
                          fontFamily: poll.design?.text?.fontFamily || "Arial",
                        }}
                      >
                        {option.option}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* דרופדאון */}
            {curQuestion.type === QuestionType.DROPDOWN && (
              <select
                value={safeArr(responses[curQuestion._id]?.answer)[0] ?? ""}
                onChange={(e) =>
                  handleResponseChange(curQuestion._id, [e.target.value])
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose an option</option>
                {curQuestion.options?.map((option, index) => (
                  <option key={index} value={option.option}>
                    {option.option}
                  </option>
                ))}
              </select>
            )}

            {/* סולם לינארי */}
            {curQuestion.type === QuestionType.LINEAR_SCALE && (
              <div className="mt-2">
                <div className="flex justify-between">
                  {Array.from(
                    { length: curQuestion.scale || 5 },
                    (_, i) => i + 1
                  ).map((num) => (
                    <div key={num} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleResponseChange(curQuestion._id, [
                            num.toString(),
                          ])
                        }
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-colors ${
                          safeArr(responses[curQuestion._id]?.answer)[0] ===
                          num.toString()
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {num}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>1</span>
                  <span>{curQuestion.scale || 5}</span>
                </div>
              </div>
            )}

            {/* תאריך */}
            {curQuestion.type === QuestionType.DATE && (
              <input
                type="date"
                value={safeArr(responses[curQuestion._id]?.answer)[0] ?? ""}
                onChange={(e) =>
                  handleResponseChange(curQuestion._id, [e.target.value])
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            {/* שעה */}
            {curQuestion.type === QuestionType.TIME && (
              <input
                type="time"
                value={safeArr(responses[curQuestion._id]?.answer)[0] ?? ""}
                onChange={(e) =>
                  handleResponseChange(curQuestion._id, [e.target.value])
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </QuestionCard>
        </div>
      ))}
    </div>
  );
};

export default QuestionsContainer;
