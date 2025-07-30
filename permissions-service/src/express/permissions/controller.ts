import { Request, Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { PermissionsManager } from './manager';
import {
    acceptOwnerRequestSchema,
    createOneRequestSchema,
    deleteOnePermissionRequestSchema,
    getPollPermissionsRequestSchema,
    getAllPollsByQueryRequestSchema,
    getPollUserPermissionRequestSchema,
    getPublishRequestSchema,
    rejectOwnerRequestSchema,
    updateHierarchyRequestSchema,
    updateNewOwnerRequestSchema,
    updateOneUserRequestSchema,
    updatePermissionRequestSchema,
    updatePublishRequestSchema,
    updateRespondableSchema,
    updateManyUsersRequestSchema,
    getPollHierarchyPermissionRequestSchema,
} from './validations';

export class PermissionsController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        const result = await PermissionsManager.createOne(req.params.pollId, req.params.userId);
        res.json(result);
    };

    static getAllPolls = async (req: TypedRequest<typeof getAllPollsByQueryRequestSchema>, res: Response) => {
        const result = await PermissionsManager.getAllPolls(req.params.userId, req.query);
        res.json(result);
    };

    static getPollPermissions = async (req: TypedRequest<typeof getPollPermissionsRequestSchema>, res: Response) => {
        const result = await PermissionsManager.getPollPermissions(req.params.pollId);
        res.json(result);
    };

    static getAllAllPermissions = async (_req: Request, res: Response) => {
        const result = await PermissionsManager.getAllAllPermissions();
        res.json(result);
    };

    static getPollUserPermission = async (req: TypedRequest<typeof getPollUserPermissionRequestSchema>, res: Response) => {
        const result = await PermissionsManager.getPollUserPermission(req.params.pollId, req.params.userId, req.query.level);
        res.json(result);
    };

    static getPollHierarchyPermission = async (req: TypedRequest<typeof getPollHierarchyPermissionRequestSchema>, res: Response) => {
        const result = await PermissionsManager.getPollHierarchyPermission(req.params.pollId, req.query.hierarchyId);
        res.json(result);
    };

    static updatePermission = async (req: TypedRequest<typeof updatePermissionRequestSchema>, res: Response) => {
        const result = await PermissionsManager.updatePermission(req.params.pollId, req.body.permission);
        res.json(result);
    };

    static updateOneUser = async (req: TypedRequest<typeof updateOneUserRequestSchema>, res: Response) => {
        const result = await PermissionsManager.updateOwnedById(req.params.pollId, req.params.userId, req.query.level);
        res.json(result);
    };

    static updateManyUsers = async (req: TypedRequest<typeof updateManyUsersRequestSchema>, res: Response) => {
        const result = await PermissionsManager.updateManyUsers(req.params.pollId, req.body.users, req.body.action);
        res.json(result);
    };

    static updateNewOwner = async (req: TypedRequest<typeof updateNewOwnerRequestSchema>, res: Response) => {
        const result = await PermissionsManager.updateNewOwner(req.params.pollId, req.params.userId);
        res.json(result);
    };

    static rejectOwner = async (req: TypedRequest<typeof rejectOwnerRequestSchema>, res: Response) => {
        const result = await PermissionsManager.rejectOwner(req.params.pollId);
        res.json(result);
    };

    static acceptOwner = async (req: TypedRequest<typeof acceptOwnerRequestSchema>, res: Response) => {
        const result = await PermissionsManager.acceptOwner(req.params.pollId);
        res.json(result);
    };

    static updatePublishRequestSchema = async (req: TypedRequest<typeof updatePublishRequestSchema>, res: Response) => {
        const result = await PermissionsManager.updatePublishRequestSchema(req.params.pollId);
        res.json(result);
    };

    static getPublishRequestSchema = async (req: TypedRequest<typeof getPublishRequestSchema>, res: Response) => {
        const result = await PermissionsManager.getPublishRequestSchema(req.params.pollId);
        res.json(result);
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOnePermissionRequestSchema>, res: Response) => {
        const result = await PermissionsManager.deleteOne(req.params.pollId);
        res.json(result);
    };
    static updateRespondable = async (req: TypedRequest<typeof updateRespondableSchema>, res: Response) => {
        const result = await PermissionsManager.updateRespondable(req.params.pollId, req.body.respondable);
        res.json(result);
    };
    static updateHierarchy = async (req: TypedRequest<typeof updateHierarchyRequestSchema>, res: Response) => {
        const result = await PermissionsManager.updateHierarchy(req.params.pollId, req.body.groupHierarchy, req.body.groupId, req.body.action);
        res.json(result);
    };
}
