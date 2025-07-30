import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { createStatisticsRequestSchema, getByIdRequestSchema } from './validations';
import { StatisticsManager } from './manager';

export class StatisticsController {
    static getStatistics = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await StatisticsManager.getStatistics(req.params.pollId));
    };
    static createOne = async (req: TypedRequest<typeof createStatisticsRequestSchema>, res: Response) => {
        res.json(await StatisticsManager.createOne(req.params.pollId));
    };
}
