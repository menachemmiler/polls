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
export interface IStatistics {
    pollId: string;
    questionStats: IQuestionStatistics[];
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
