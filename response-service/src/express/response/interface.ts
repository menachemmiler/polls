import { QuestionType } from '../../enums/questionType';

export interface IAnswer {
    questionId: string;
    questionType: QuestionType;
    answer: string[];
}

export interface IAnswerDocument extends IAnswer {
    _id: string;
}

export interface IResponse {
    answers?: IAnswer[];
    respondentId: string;
    pollId: string;
    submittedAt?: Date;
}

export interface IResponseDocument extends IResponse {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
declare global {
    namespace Express {
        interface Request {
            response?: IResponseDocument;
        }
    }
}
