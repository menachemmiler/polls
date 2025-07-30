import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import {
    addSectionRequestSchema,
    createOneRequestSchema,
    deleteOneRequestSchema,
    getAllPollsRequestSchema,
    getFullPollRequestSchema,
} from './validations';
import { pollsManager } from './manager';

export class pollsController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        const pollData = {
            ...req.body,
            createdBy: req.user!.genesisId,
        };

        res.json(await pollsManager.createOne(pollData));
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await pollsManager.deleteOne(req.params.pollId));
    };
    static getFull = async (req: TypedRequest<typeof getFullPollRequestSchema>, res: Response) => {
        res.json(await pollsManager.getFull(req.params.pollId));
    };
    static addSection = async (req: TypedRequest<typeof addSectionRequestSchema>, res: Response) => {
        res.json(await pollsManager.addSection(req.params.pollId));
    };

    static getAll = async (req: TypedRequest<typeof getAllPollsRequestSchema>, res: Response) => {
        res.json(await pollsManager.getAll(req.user!.genesisId));
    };

    static updateOne = async (req: TypedRequest<any>, res: Response) => {
        res.json(await pollsManager.updateOne(req.params.pollId, req.body));
    };
    static deleteSection = async (req: TypedRequest<any>, res: Response) => {
        res.json(await pollsManager.deleteSection(req.params.pollId, req.params.sectionId));
    };
}
