export enum QuestionType {
    HEADER = 'HEADER',
    SHORT_ANSWER = 'SHORT_ANSWER',
    PARAGRAPH = 'PARAGRAPH',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    CHECKBOXES = 'CHECKBOXES',
    DROPDOWN = 'DROPDOWN',
    LINEAR_SCALE = 'LINEAR_SCALE',
    DATE = 'DATE',
    TIME = 'TIME',
}

export interface Question {
    title?: string;
    description?: string;
    type: QuestionType;
    options?: { option: string; _id?: string }[];
    isRequired?: boolean;
    scale?: number;
    relatedSectionIds?: number[];
    pollId: string;
    sectionId: string;
}

export interface QuestionDocument extends Question {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
