import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { KartoffelManager } from './manager';
import { getGroupByIdRequestSchema, searchGroupsRequestSchema, searchUsersRequestSchema } from './validations';

export class KartoffelController {
    static async searchUsers(req: TypedRequest<typeof searchUsersRequestSchema>, res: Response) {
        res.json(await KartoffelManager.searchUsers(req.params.name));
    }
    static async searchGroups(req: TypedRequest<typeof searchGroupsRequestSchema>, res: Response) {
        res.json(await KartoffelManager.searchGroups(req.params.name));
    }
    static async getGroupById(req: TypedRequest<typeof getGroupByIdRequestSchema>, res: Response) {
        const { numPage, pageSize } = req.query;
        res.json(await KartoffelManager.getGroupById(req.params.groupId, numPage, pageSize));
    }
}
