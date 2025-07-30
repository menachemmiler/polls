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

export type AnswerType = string[] | string | Date;

export interface IQuestionResponse {
    questionId: string;
    questionType: QuestionType;
}

export interface IQuestionResponseDocument extends IQuestionResponse {
    _id: string;
}

export interface IResponse {
    respondentId: string;
    pollId: string;
    answers: IQuestionResponse[];
    submittedAt?: Date;
}

export interface IResponseDocument extends Response {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
declare global {
    export interface ExpressRequest extends Request {
        response: IResponseDocument;
    }
}
