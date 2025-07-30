import { NotFoundError } from '../../utils/errors';
import { IQuestionStatistics, IStatistics, IStatisticsCreateForm, IStatisticsDocument, IStatisticsUpdateForm, QuestionType } from './interface';
import { StatisticsModel } from './model';
import { config } from '../../config/index';

const { defaultLimit } = config.service;

export class StatisticsManager {
    static getStatisticsByQuery = async (query: Partial<IStatistics>, step: number, limit?: number): Promise<IStatisticsDocument[]> => {
        const limitvalue: number = limit ?? defaultLimit!;
        return StatisticsModel.find(query)
            .lean()
            .limit(limitvalue)
            .skip(step * limitvalue)
            .exec();
    };

    static getStatisticsBypollId = async (pollId: string): Promise<IStatisticsDocument[]> => {
        return StatisticsModel.find({ pollId })
            .orFail(new NotFoundError(`poll ${pollId}`))
            .lean()
            .exec();
    };

    static createStatistics = async (statistics: IStatisticsCreateForm): Promise<IStatisticsDocument> => {
        return await StatisticsModel.create(statistics);
    };

    static updateStatistics = async (pollId: string, answers: { questionId: string; selectedOption: string[] }[]): Promise<IStatisticsDocument> => {
        const statistics = await StatisticsModel.findOne({ pollId }).orFail(new NotFoundError(`poll ${pollId}`));

        const questionMap = new Map(statistics.questionStats.map((q) => [q.questionId, q]));

        answers.forEach((answer) => StatisticsManager.processAnswer(questionMap, answer));

        await statistics.save();
        return statistics.toObject() as IStatisticsDocument;
    };

    private static processAnswer = (
        questionMap: Map<string, IQuestionStatistics>,
        { questionId, selectedOption }: { questionId: string; selectedOption: string[] },
    ) => {
        const question = questionMap.get(questionId);
        if (!question) throw new NotFoundError(`Question ${questionId}`);

        if (question.questionType !== QuestionType.CHECKBOXES && selectedOption.length > 1) {
            throw new Error(`Only CHECKBOXES questions can have multiple answers. Question ${questionId} received: ${selectedOption}`);
        }

        if (selectedOption && selectedOption.length > 0) {
            question.totalAnswers++;
        }

        if (StatisticsManager.isSelectableQuestion(question.questionType)) {
            selectedOption.forEach((optionValue) => {
                const option = question.optionAnswerCounts.find((o) => o.option === optionValue);
                if (option) {
                    option.count++;
                } else {
                    throw new NotFoundError(`Option ${optionValue} for question ${questionId}`);
                }
            });
        } else {
            selectedOption.forEach((value) => {
                const option = question.optionAnswerCounts.find((o) => o.option === value);
                if (option) {
                    option.count++;
                } else {
                    question.optionAnswerCounts.push({ option: value, count: 1 });
                }
            });
        }
    };

    private static isSelectableQuestion = (type: QuestionType): boolean => {
        return [QuestionType.MULTIPLE_CHOICE, QuestionType.CHECKBOXES, QuestionType.DROPDOWN, QuestionType.LINEAR_SCALE].includes(type);
    };

    static updateStatisticsQuestionForm = async (pollId: string, question: IStatisticsUpdateForm): Promise<IStatisticsDocument> => {
        const { questionId, questionType, options = [] } = question;
        const statistics = await StatisticsModel.findOne({ pollId }).orFail(new NotFoundError(`poll ${pollId}`));

        let questionStat = statistics.questionStats.find((q) => q.questionId === questionId);

        if (!questionStat) {
            statistics.questionStats.push({
                questionId,
                questionType,
                totalAnswers: 0,
                optionAnswerCounts: options.map((opt) => ({
                    _id: opt._id,
                    option: opt.option,
                    count: 0,
                })),
            });
        } else {
            questionStat.questionType = questionType;

            const existingOptions = new Map(questionStat.optionAnswerCounts.map((o) => [o._id?.toString() ?? o.option, o]));

            options.forEach((opt) => {
                const key = opt._id ?? opt.option;
                const found = existingOptions.get(key);

                if (found) {
                    found.option = opt.option;
                } else {
                    questionStat.optionAnswerCounts.push({
                        _id: opt._id,
                        option: opt.option,
                        count: 0,
                    });
                }
            });
        }

        await statistics.save();
        return statistics.toObject() as IStatisticsDocument;
    };

    static async deleteQuestion(pollId: string, questionId: string): Promise<IStatisticsDocument> {
        const statistics = await StatisticsModel.findOne({ pollId }).orFail(new NotFoundError(`poll ${pollId}`));
        const before = statistics.questionStats.length;
        statistics.questionStats = statistics.questionStats.filter((q) => q.questionId !== questionId);
        if (statistics.questionStats.length === before) {
            throw new NotFoundError(`Question ${questionId} in poll ${pollId}`);
        }
        await statistics.save();
        return statistics.toObject() as IStatisticsDocument;
    }

    static deleteStatistics = async (pollId: string): Promise<IStatisticsDocument> => {
        return await StatisticsModel.findOneAndDelete({ pollId }).orFail(new NotFoundError(`poll ${pollId}`));
    };
}
