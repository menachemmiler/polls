import { useRef, useCallback, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Question } from "../../../types/survey";
import { pollService } from "../../../services/pollService";
import { toastService } from "../../../services/toastService";
import { QuestionCard } from "./questionCard/QuestionCard";
import { useSaveStatus } from "../../../context/SaveStatusContext";
import { useSidebarStore } from "../../../stores/sidebar";

interface QuestionsContainerProps {
  questions: Question[];
  pollId: string;
  sectionId: string;
  onQuestionsChanged: () => void;
  activeQuestionId: string | null;
  onSetActiveQuestion: (id: string | null) => void;
  onQuestionAdded: (questionId?: string) => void;
  questionDesign?: {
    title: { fontSize: number; fontFamily: string };
    text: { fontSize: number; fontFamily: string };
    color: string;
  };
}

export const QuestionsContainer: React.FC<QuestionsContainerProps> = ({
  questions,
  pollId,
  sectionId,
  questionDesign,
  onQuestionsChanged,
  activeQuestionId,
  onSetActiveQuestion,
  onQuestionAdded,
}) => {
  const { setTarget, setActiveQuestionId, setActiveSectionId } =
    useSidebarStore();
  const activeQuestionRef = useRef<HTMLDivElement | null>(null);
  const updateDebounceRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const { setSaveStatus } = useSaveStatus();

  const { mutate: updateQuestionMutation } = pollService.useUpdateQuestion();
  const { mutate: deleteQuestionMutation } = pollService.useDeleteQuestion();
  const { mutate: createQuestionMutation } = pollService.useAddQuestion();

  const handleUpdateQuestion = useCallback(
    (question: Question) => {
      const existingTimeout = updateDebounceRefs.current.get(question._id);
      if (existingTimeout) clearTimeout(existingTimeout);

      const timeoutId = setTimeout(() => {
        updateQuestionMutation(
          {
            questionId: question._id,
            data: {
              ...question,
              pollId,
              relatedSectionIds: question.relatedSectionIds?.map(String),
            },
          },
          {
            onSuccess: () => {
              setSaveStatus("saved", "השאלה עודכנה");
              setTimeout(() => setSaveStatus("idle"), 3000);
              onQuestionsChanged();
            },
            onError: () => {
              setSaveStatus("error", "שגיאה בעדכון השאלה");
            },
          }
        );
        updateDebounceRefs.current.delete(question._id);
      }, 3000);

      updateDebounceRefs.current.set(question._id, timeoutId);
    },
    [updateQuestionMutation, onQuestionsChanged, pollId, setSaveStatus]
  );

  const handleDeleteQuestion = useCallback(
    (questionId: string) => {
      const existingTimeout = updateDebounceRefs.current.get(questionId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        updateDebounceRefs.current.delete(questionId);
      }

      deleteQuestionMutation(
        { data: { questionId, pollId, sectionId } },
        {
          onSuccess: () => {
            setSaveStatus("saved", "השאלה נמחקה");
            setTimeout(() => setSaveStatus("idle"), 3000);

            if (activeQuestionId === questionId) {
              if (questions.length > 1) {
                const currentIndex = questions.findIndex(
                  (q) => q._id === questionId
                );
                const newActiveIndex = currentIndex > 0 ? currentIndex - 1 : 0;
                const newActiveId = questions[newActiveIndex]._id;
                setActiveQuestionId(newActiveId);

                const questionElement = document.getElementById(
                  `question-${newActiveId}`
                );
                if (questionElement) {
                  questionElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  setTarget(questionElement);
                }
              } else {
                setActiveQuestionId(null);
                setActiveSectionId(sectionId);
                const sectionElement = document.getElementById(
                  `section-header-${sectionId}`
                );
                if (sectionElement) {
                  sectionElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  setTarget(sectionElement);
                }
              }
            }

            onQuestionsChanged();
          },
          onError: () => {
            toastService.error("שגיאה במחיקת השאלה");
          },
        }
      );
    },
    [
      deleteQuestionMutation,
      pollId,
      sectionId,
      setSaveStatus,
      activeQuestionId,
      questions,
      onQuestionsChanged,
      setTarget,
      setActiveQuestionId,
      setActiveSectionId,
    ]
  );

  const handleDuplicateQuestion = useCallback(
    (questionId: string) => {
      const question = questions.find((q) => q._id === questionId);
      if (!question) return;

      updateDebounceRefs.current.forEach(clearTimeout);
      updateDebounceRefs.current.clear();

      const currentIndex = questions.findIndex((q) => q._id === questionId);

      createQuestionMutation(
        {
          data: {
            title: question.title || "",
            type: question.type,
            options: question.options,
            isRequired: question.isRequired,
            sectionId,
            pollId,
            index: currentIndex + 1,
          },
        },
        {
          onSuccess: (data) => {
            setSaveStatus("saved", "השאלה שוכפלה");
            setTimeout(() => setSaveStatus("idle"), 3000);
            onQuestionAdded(data._id);
          },
          onError: () => {
            toastService.error("שגיאה בשכפול השאלה");
          },
        }
      );
    },
    [
      questions,
      sectionId,
      pollId,
      createQuestionMutation,
      onQuestionAdded,
      setSaveStatus,
    ]
  );

  const handleQuestionFocus = useCallback(
    (questionId: string) => {
      const element = document.getElementById(`question-${questionId}`);
      if (element) setTarget(element);
      onSetActiveQuestion(questionId);
    },
    [onSetActiveQuestion, setTarget]
  );

  useEffect(() => {
    return () => {
      updateDebounceRefs.current.forEach(clearTimeout);
      updateDebounceRefs.current.clear();
    };
  }, []);

  return (
    <>
      {questions.map((question, index) => (
        <Draggable
          key={question._id}
          draggableId={question._id}
          index={index}
          disableInteractiveElementBlocking
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={{
                ...provided.draggableProps.style,
                transition: snapshot.isDragging
                  ? "transform 0.2s ease"
                  : "none",
              }}
            >
              <div
                ref={
                  question._id === activeQuestionId ? activeQuestionRef : null
                }
                id={`question-${question._id}`}
                className={snapshot.isDragging ? "opacity-50" : ""}
              >
                <QuestionCard
                  key={question._id}
                  question={question}
                  onUpdate={handleUpdateQuestion}
                  onDelete={() => handleDeleteQuestion(question._id)}
                  onDuplicate={() => handleDuplicateQuestion(question._id)}
                  isActive={activeQuestionId === question._id}
                  onFocus={() => handleQuestionFocus(question._id)}
                  dragHandleProps={provided.dragHandleProps}
                  questionDesign={questionDesign}
                />
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </>
  );
};
