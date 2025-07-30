import { Response } from 'express';
import { TypedRequest } from '../../utils/zod.js';
import { QuestionsManager } from './manager.js';
import {
    createOneRequestSchema,
    deleteManyRequestSchema,
    deleteOneRequestSchema,
    getByIdsRequestSchema,
    updateOneRequestSchema,
} from './validations.js';

export class QuestionsController {
    static getAll = async (_req: TypedRequest<typeof getByIdsRequestSchema>, res: Response) => {
        res.json(await QuestionsManager.getAll());
    };
    static getByIds = async (req: TypedRequest<typeof getByIdsRequestSchema>, res: Response) => {
        const { questionsIds } = req.query;
        res.json(await QuestionsManager.getByIds(questionsIds));
    };
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await QuestionsManager.createOne(req.body));
    };

    static updateOne = async (req: TypedRequest<typeof updateOneRequestSchema>, res: Response) => {
        res.json(await QuestionsManager.updateOne(req.params.id, req.body));
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await QuestionsManager.deleteOne(req.params.id));
    };

    static deleteManyByIds = async (req: TypedRequest<typeof deleteManyRequestSchema>, res: Response) => {
        res.json(await QuestionsManager.deleteManyByIds(req.query.questionsIds));
    };
}
