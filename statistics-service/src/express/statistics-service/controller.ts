import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { StatisticsManager } from './manager';
import { createStatisticsRequestSchema, deleteQuestionRequestSchema, getByIdRequestSchema, getByQueryRequestSchema, updateStatisticsFormRequestSchema, updateStatisticsRequestSchema } from './validations';

export class StatisticsController {
    static getByQuery = async (req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) => {
        const { step, limit, ...query } = req.query;
        res.json(await StatisticsManager.getStatisticsByQuery(query, step, limit));
    };

    static getBypollId = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await StatisticsManager.getStatisticsBypollId(req.params.pollId));
    };

    static createOne = async (req: TypedRequest<typeof createStatisticsRequestSchema>, res: Response) => {
        res.json(await StatisticsManager.createStatistics(req.body));
    }

    static updateOne = async (req: TypedRequest<typeof updateStatisticsRequestSchema>, res: Response) => {
        res.json(await StatisticsManager.updateStatistics(req.params.pollId, req.body.answers));
    };

    static updateForm = async (req: TypedRequest<typeof updateStatisticsFormRequestSchema>, res: Response) => {
        res.json(await StatisticsManager.updateStatisticsQuestionForm(req.params.pollId, req.body));
    };

    static deleteQuestion = async (req: TypedRequest<typeof deleteQuestionRequestSchema>, res: Response) => {
        res.json(await StatisticsManager.deleteQuestion(req.params.pollId, req.params.questionId));
    };

    static deleteOne = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await StatisticsManager.deleteStatistics(req.params.pollId));
    };
}
