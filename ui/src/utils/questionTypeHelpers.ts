import { Question, QuestionType } from "../types/survey";

export const getDefaultContentForType = (
  type: QuestionType,
  currentQuestion: Question
): Partial<Question> => {
  const baseUpdate = {
    type,
    title: currentQuestion.title || "",
    description: currentQuestion.description,
    isRequired: currentQuestion.isRequired || false,
    relatedSectionIds: currentQuestion.relatedSectionIds,
  };

  switch (type) {
    case QuestionType.SHORT_ANSWER:
      return {
        ...baseUpdate,
        options: undefined,
        scale: undefined,
      };

    case QuestionType.PARAGRAPH:
      return {
        ...baseUpdate,
        options: undefined,
        scale: undefined,
      };

    case QuestionType.MULTIPLE_CHOICE:
    case QuestionType.DROPDOWN:
      return {
        ...baseUpdate,
        options: getOrCreateOptions(currentQuestion),
        scale: undefined,
      };

    case QuestionType.CHECKBOXES:
      return {
        ...baseUpdate,
        options: getOrCreateOptions(currentQuestion),
        scale: undefined,
      };

    case QuestionType.LINEAR_SCALE:
      return {
        ...baseUpdate,
        options: undefined,
        scale: currentQuestion.scale || 5,
      };

    case QuestionType.RATING:
      return {
        ...baseUpdate,
        options: undefined,
        scale: currentQuestion.scale || 5,
      };

    case QuestionType.FILE_UPLOAD:
      return {
        ...baseUpdate,
        options: undefined,
        scale: undefined,
      };

    case QuestionType.DATE:
      return {
        ...baseUpdate,
        options: undefined,
        scale: undefined,
      };

    case QuestionType.TIME:
      return {
        ...baseUpdate,
        options: undefined,
        scale: undefined,
      };

    case QuestionType.MULTIPLE_CHOICE_GRID:
    case QuestionType.CHECKBOX_GRID:
      return {
        ...baseUpdate,
        options: getOrCreateOptions(currentQuestion),
        scale: undefined,
      };

    case QuestionType.HEADER:
      return {
        ...baseUpdate,
        options: undefined,
        scale: undefined,
        isRequired: false,
      };

    default:
      return baseUpdate;
  }
};

const getOrCreateOptions = (question: Question) => {
  if (question.options && question.options.length > 0) {
    return question.options;
  }

  return [
    { option: "אופציה 1" },
    { option: "אופציה 2" },
    { option: "אופציה 3" },
  ];
};

export const requiresOptions = (type: QuestionType): boolean => {
  return [
    QuestionType.MULTIPLE_CHOICE,
    QuestionType.CHECKBOXES,
    QuestionType.DROPDOWN,
    QuestionType.MULTIPLE_CHOICE_GRID,
    QuestionType.CHECKBOX_GRID,
  ].includes(type);
};

export const requiresScale = (type: QuestionType): boolean => {
  return [QuestionType.LINEAR_SCALE, QuestionType.RATING].includes(type);
};

export const getPlaceholderForType = (type: QuestionType): string => {
  switch (type) {
    case QuestionType.SHORT_ANSWER:
      return "תשובה קצרה";
    case QuestionType.PARAGRAPH:
      return "תשובה ארוכה";
    case QuestionType.DATE:
      return "בחר תאריך";
    case QuestionType.TIME:
      return "בחר שעה";
    case QuestionType.FILE_UPLOAD:
      return "העלה קובץ";
    case QuestionType.HEADER:
      return "כותרת סקציה";
    default:
      return "";
  }
};

export const isTextQuestion = (type: QuestionType): boolean => {
  return [QuestionType.SHORT_ANSWER, QuestionType.PARAGRAPH].includes(type);
};

export const isChoiceQuestion = (type: QuestionType): boolean => {
  return [
    QuestionType.MULTIPLE_CHOICE,
    QuestionType.CHECKBOXES,
    QuestionType.DROPDOWN,
  ].includes(type);
};

export const isGridQuestion = (type: QuestionType): boolean => {
  return [
    QuestionType.MULTIPLE_CHOICE_GRID,
    QuestionType.CHECKBOX_GRID,
  ].includes(type);
};
