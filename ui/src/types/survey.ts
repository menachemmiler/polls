export const QuestionType = {
  HEADER: "HEADER",
  SHORT_ANSWER: "SHORT_ANSWER",
  PARAGRAPH: "PARAGRAPH",
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  CHECKBOXES: "CHECKBOXES",
  DROPDOWN: "DROPDOWN",
  LINEAR_SCALE: "LINEAR_SCALE",
  FILE_UPLOAD: "FILE_UPLOAD",
  RATING: "RATING",
  MULTIPLE_CHOICE_GRID: "MULTIPLE_CHOICE_GRID",
  CHECKBOX_GRID: "CHECKBOX_GRID",
  DATE: "DATE",
  TIME: "TIME",
};

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface SurveySection {
  title: string;
  description?: string;
  _id: string;
  questions: Question[];
}

export interface Question {
  _id: string;
  title?: string;
  description?: string;
  type: QuestionType;
  options?: {
    _id?: string;
    option: string;
  }[];
  isRequired: boolean;
  scale?: number;
  index?: number;
  relatedSectionIds?: number[];
}

export interface IPoll {
  _id: string;
  name?: string;
  title?: string;
  description?: string;
  isAnonymous?: boolean;
  startAt?: Date;
  endAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  sections: SurveySection[];
  design?: {
    header?: {
      fontSize?: number;
      fontFamily?: string;
    };
    questions?: {
      fontSize?: number;
      fontFamily?: string;
    };
    text?: {
      fontSize?: number;
      fontFamily?: string;
    };
    color?: string;
    backgroundColor?: string;
  };
}

export interface IPollsResponse {
  owner: IPoll[];
  editor: IPoll[];
}

export type NewPollDTO = Omit<IPoll, "_id" | "sections">;

export interface NewResponseDTO {
  data: {
    answers: IAnswer[];
    pollId: string;
  };
}
export interface IAnswer {
  questionId: string;
  questionType: QuestionType;
  answer: string[];
}

export interface IResponse {
  answers: IAnswer[];
  respondentId: string;
  pollId: string;
  submittedAt?: Date;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const OPTIONS_QUESTION_TYPES: QuestionType[] = [
  QuestionType.MULTIPLE_CHOICE,
  QuestionType.CHECKBOXES,
  QuestionType.DROPDOWN,
  QuestionType.MULTIPLE_CHOICE_GRID,
  QuestionType.CHECKBOX_GRID,
];

export const TabType = {
  QUESTIONS: "QUESTIONS",
  RESPONSES: "RESPONSES",
  SETTINGS: "SETTINGS",
} as const;

export type TabType = (typeof TabType)[keyof typeof TabType];

export interface IFullName {
  firstName: string;
  lastName: string;
}

export interface IShragaUser {
  _id: string;
  id: string;
  adfsId: string;
  genesisId: string;
  name: IFullName;
  email: string;
  displayName: string;
  upn: string;
  provider: string;
  personalNumber: string;
  entityType: string;
  job: string;
  phoneNumbers: string[];
  photo: string;
  identityCard: string;
}

export interface UpdateQuestionDTO {
  questionId: string;
  data: {
    title?: string;
    type: QuestionType;
    options?: {
      _id?: string;
      option: string;
    }[];
    isRequired?: boolean;
    relatedSectionIds?: string[];
    pollId: string;
    index?: number;
  };
}

export interface UpdatePollDTO {
  pollId: string;
  data: {
    title?: string;
    name?: string;
    description?: string;
    design?: {
      header?: {
        fontSize?: number;
        fontFamily?: string;
      };
      questions?: {
        fontSize?: number;
        fontFamily?: string;
      };
      text?: {
        fontSize?: number;
        fontFamily?: string;
      };
      color?: string;
    };
  };
}


export interface CreateQuestionDTO {
  data: {
    title?: string;
    description?: string;
    type: QuestionType;
    options?: {
      _id?: string;
      option: string;
    }[];
    isRequired?: boolean;
    relatedSectionIds?: string[];
    pollId: string;
    sectionId: string;
    scale?: number;
    index: number;
  };
}

export interface DeleteQuestionDTO {
  data: {
    pollId: string;
    sectionId: string;
    questionId: string;
  };
}

export interface PollRef {
  pollId: string;
}

export type CreateSectionDTO = PollRef;
export type DeletePollDTO = PollRef;
export type PublishPollDTO = PollRef;

export interface CanResponsePoll {
  hasAccess: boolean;
  hasResponded: boolean;
}

export interface UpdateRespondableDTO {
  pollId: string;
  data: {
    respondable: boolean;
  };
}

export interface SelectedItem {
  type: "SurveySection" | "Question";
  id: string;
}



// -------------------- סוג חדש שכולל את כל הפונקציות --------------------
export interface PollContextType {
  poll: IPoll;
  setPoll: (poll: IPoll) => void;
  updatePoll: (poll: IPoll) => void;
  undo: () => void;
  redo: () => void;
  pushToHistory: (poll: IPoll) => void;
}