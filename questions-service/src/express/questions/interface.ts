export enum QuestionType {
    HEADER = 'HEADER',
    SHORT_ANSWER = 'SHORT_ANSWER',
    PARAGRAPH = 'PARAGRAPH',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    CHECKBOXES = 'CHECKBOXES',
    DROPDOWN = 'DROPDOWN',
    LINEAR_SCALE = 'LINEAR_SCALE',
    RATING = 'RATING',
    MULTIPLE_CHOICE_GRID = 'MULTIPLE_CHOICE_GRID',
    CHECKBOX_GRID = 'CHECKBOX_GRID',
    DATE = 'DATE',
    TIME = 'TIME',
}
export interface Question {
    title?: string;
    description?: string;
    type: QuestionType;
    options?: {
        _id?: string;
        option: string;
    }[];
    isRequired?: boolean;
    scale?: number;
    relatedSectionIds?: string[];
}

export interface QuestionDocument extends Question {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
