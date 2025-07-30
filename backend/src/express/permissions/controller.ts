import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { getFullPollRequestSchema } from '../polls/validations';
import { PermissionsManager } from './manager';
import {
    getPollKartoffelPermissionsRequestSchema,
    updateAccessLevelRequestSchema,
    updateAccessSchema,
    updateHierarchyRequestSchema,
    updateOneUserRequestSchema,
    updatePublishRequestSchema,
} from './validations';

export class PermissionsController {
    static isPublished = async (req: TypedRequest<typeof getFullPollRequestSchema>, res: Response) => {
        res.json(await PermissionsManager.isPublished(req.params.pollId));
    };
    static isRespondable = async (req: TypedRequest<typeof getFullPollRequestSchema>, res: Response) => {
        res.json(await PermissionsManager.isRespondable(req.params.pollId));
    };
    static updatePublish = async (req: TypedRequest<typeof updatePublishRequestSchema>, res: Response) => {
        const result = await PermissionsManager.updatePublish(req.params.pollId);
        res.json(result);
    };
    static updateAccess = async (req: TypedRequest<typeof updateAccessSchema>, res: Response) => {
        const { pollId, users, action } = req.body;
        res.json(await PermissionsManager.updateAccessPermission(pollId, users, action));
    };

    static updateRespondable = async (req: TypedRequest<any>, res: Response) => {
        const { pollId } = req.params;
        const { respondable } = req.body;
        res.json(await PermissionsManager.updateRespondable(pollId, respondable));
    };

    static getPollKartoffelPermissions = async (req: TypedRequest<typeof getPollKartoffelPermissionsRequestSchema>, res: Response) => {
        const result = await PermissionsManager.getPollKartoffelPermissions(req.params.pollId);
        res.json(result);
    };
    static updateHierarchy = async (req: TypedRequest<typeof updateHierarchyRequestSchema>, res: Response) => {
        const { groupHierarchy, groupId, action, pollId } = req.body;
        const updatedPermission = await PermissionsManager.updateHierarchy(pollId, groupHierarchy, groupId, action);

        res.json(updatedPermission);
    };

    static getPollPermission = async (req: TypedRequest<typeof getFullPollRequestSchema>, res: Response) => {
        const permission = await PermissionsManager.getPollPermission(req.params.pollId);
        res.json(permission);
    };

    static updateOneUser = async (req: TypedRequest<typeof updateOneUserRequestSchema>, res: Response) => {
        const permission = await PermissionsManager.updateOneUser(req.params.pollId, req.params.userId, req.query.level);
        res.json(permission);
    };
    static updateAccessLevel = async (req: TypedRequest<typeof updateAccessLevelRequestSchema>, res: Response) => {
        const result = await PermissionsManager.updateAccessLevel(req.params.pollId, req.body.permission);
        res.json(result);
    };
}
