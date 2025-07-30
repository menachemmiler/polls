import { DeleteResult } from 'mongodb';
import { PollNotFoundError, DuplicatePollResponseError } from '../../utils/errors';
import { ResponseModel } from './model';
import { IResponse, IResponseDocument } from './interface';
import { UpdateResult } from 'mongodb';

export class ResponseManager {
    static getByQuery = async (query: Partial<IResponse>, step: number, limit?: number): Promise<IResponseDocument[]> => {
        return ResponseModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };
    static async getRespondentsByPollId(pollId: string): Promise<{ respondentId: string; timestamp: string }[]> {
        const responses = await ResponseModel.find({ pollId }, 'respondentId submittedAt').lean().exec();
        const respondents = responses
            .filter((response) => response.submittedAt != null)
            .map((response) => ({
                respondentId: response.respondentId,
                timestamp: response.submittedAt ? response.submittedAt.toISOString() : '',
            }));
        return respondents;
    }

    static createOne = async (response: IResponse): Promise<IResponseDocument> => {
        const { respondentId, pollId } = response;

        const exists = await ResponseModel.exists({
            respondentId,
            pollId,
            'answers.questionId': response.answers?.[0].questionId,
        });

        if (exists) throw new DuplicatePollResponseError(respondentId, pollId);

        return ResponseModel.create(response);
    };
    static async hasUserResponded(pollId: string, genesisId: string): Promise<boolean> {
        const exists = await ResponseModel.exists({ pollId, respondentId: genesisId });
        return !!exists;
    }

    static deleteMany = async (pollId: string): Promise<DeleteResult> => {
        return ResponseModel.deleteMany({ pollId }).orFail(new PollNotFoundError(pollId)).lean().exec();
    };
    static async getAnswersByQuestionId(questionId: string): Promise<any[]> {
        const results = await ResponseModel.aggregate([
            { $unwind: '$answers' },
            { $match: { 'answers.questionId': questionId } },
            {
                $project: {
                    _id: 0,
                    answer: '$answers.answer',
                },
            },
        ]);
        return results;
    }
    static async deleteByQuestion(pollId: string, questionId: string): Promise<UpdateResult> {
        return ResponseModel.updateMany(
            { pollId },
            {
                $pull: {
                    answers: { questionId },
                },
            },
        )
            .orFail(new PollNotFoundError(pollId))
            .exec();
    }
    static async hasResponses(pollId: string): Promise<boolean> {
        const exists = await ResponseModel.exists({ pollId });
        return !!exists;
    }
}
