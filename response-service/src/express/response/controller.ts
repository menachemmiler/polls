import { Request, Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { ResponseManager } from './manager';
import {
    createOneRequestSchema,
    deleteByQuestionRequestSchema,
    deleteOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getHasRespondedRequestSchema,
} from './validations.js';
import { logger } from '../../utils/logger';

export class ResponseController {
    static getByQuery = async (req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) => {
        const { step, limit, ...query } = req.query;

        res.json(await ResponseManager.getByQuery(query, step, limit));
    };

    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await ResponseManager.createOne(req.body));
    };

    static deleteMany = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await ResponseManager.deleteMany(req.params.id));
    };
    static hasUserResponded = async (req: TypedRequest<typeof getHasRespondedRequestSchema>, res: Response) => {
        const hasResponded = await ResponseManager.hasUserResponded(req.params.pollId, req.params.genesisId);
        res.json({ hasResponded });
    };
    static getAnswersByQuestionId = async (req: Request, res: Response) => {
        const { questionId } = req.params;
        const result = await ResponseManager.getAnswersByQuestionId(questionId);
        res.json(result);
    };
    static async deleteByQuestion(req: TypedRequest<typeof deleteByQuestionRequestSchema>, res: Response) {
        const { pollId, questionId } = req.params;
        const result = await ResponseManager.deleteByQuestion(pollId, questionId);
        res.json(result);
    }
    static async hasResponses(req: TypedRequest<typeof getByIdRequestSchema>, res: Response) {
        const has = await ResponseManager.hasResponses(req.params.pollId);
        res.json({ has });
    }
    static async getRespondentsByPollId(req: TypedRequest<typeof getByIdRequestSchema>, res: Response) {
    const respondentIds = await ResponseManager.getRespondentsByPollId(req.params.pollId);
    logger.info('Fetched respondents for poll', req.params.pollId, ':', respondentIds);
    res.json({ respondentIds });
}

}
