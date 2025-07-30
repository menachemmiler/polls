export const QuestionType = {
  HEADER: "HEADER",
  SHORT_ANSWER: "SHORT_ANSWER",
  PARAGRAPH: "PARAGRAPH",
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  CHECKBOXES: "CHECKBOXES",
  DROPDOWN: "DROPDOWN",
  LINEAR_SCALE: "LINEAR_SCALE",
  CHECKBOX_GRID: "CHECKBOX_GRID",
  DATE: "DATE",
  TIME: "TIME",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface IStatistics {
  pollId: string;
  questionStats: IQuestionStatistics[];
}

export interface IQuestionStatistics {
  questionId: string;
  questionType: QuestionType;
  totalAnswers: number;
  optionAnswerCounts: {
    _id?: string;
    option: string;
    count: number;
  }[];
}

export interface IStatisticsCreateForm {
  pollId: string;
  questionStats: {
    questionId: string;
    questionType: QuestionType;
    optionAnswerCounts: {
      _id: string;
      option: string;
    }[];
  }[];
}

export type UserSubmission = {
  pollId: string;
  answers: {
    questionId: string;
    selectedOption: string;
  }[];
};

export interface IStatisticsUpdateForm {
  questionId: string;
  questionType: QuestionType;
  options: { _id: string; option: string }[];
}

export interface IStatisticsDocument extends IStatistics {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
