import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { QuestionsManager } from './manager';
import { createOneRequestSchema, deleteQuestionRequestSchema } from './validations';

export class QuestionsController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await QuestionsManager.createOne(req.body));
    };

    static deleteOne = async (req: TypedRequest<typeof deleteQuestionRequestSchema>, res: Response) => {
        const { questionId } = req.params;
        res.json(await QuestionsManager.deleteOne({ ...req.body, questionId }));
    };
    static updateOne = async (req: TypedRequest<any>, res: Response) => {
        res.json(await QuestionsManager.updateQuestion(req.params.id, req.body));
    };
}
