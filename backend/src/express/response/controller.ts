import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { createOneRequestSchema, getHasRespondedRequestSchema, getPollByIdRequestSchema } from './validations';
import { ResponsesManager } from './manager';

export class ResponsesController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        const respondentId = req.user!.genesisId as string;
        res.json(
            await ResponsesManager.createOne({
                ...req.body,
                respondentId,
            }),
        );
    };

    static getRespondentsByPollId = async (req: TypedRequest<typeof getHasRespondedRequestSchema>, res: Response) => {
        res.json(await ResponsesManager.getRespondentsByPollId(req.params.pollId));
    };
    static getByPollId = async (req: TypedRequest<typeof getPollByIdRequestSchema>, res: Response) => {
        res.json(await ResponsesManager.getByPollId(req.params.pollId, req.user!.genesisId as string));
    };
}
