import { Response } from 'express';
import { createOneRequestSchema, getAllRequestSchema, getByGenesisIdRequestSchema, getByIdRequestSchema, updateOneRequestSchema } from './validations.js';
import { TypedRequest } from '../../utils/zod.js';
import { UserManager } from './manager.js';

export class UsersController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await UserManager.createOne(req.body));
    };
    static getById = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await UserManager.getById(req.params.id));
    };
    static deleteOne = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await UserManager.deleteOne(req.params.id));
    };
    static updateOne = async (req: TypedRequest<typeof updateOneRequestSchema>, res: Response) => {
        res.json(await UserManager.updateOne(req.params.id, req.body));
    };
    static getAll = async (req: TypedRequest<typeof getAllRequestSchema>, res: Response) => {
        res.json(await UserManager.getAll(req.query));
    };
    static getByGenesisId = async (req: TypedRequest<typeof getByGenesisIdRequestSchema>, res: Response) => {
        res.json(await UserManager.getByGenesisId(req.params.genesisId));
    };
}
