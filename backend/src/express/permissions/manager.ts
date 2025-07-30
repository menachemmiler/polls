import { ServiceError } from '../../utils/errors';
import { KartoffelService } from '../kartoffel/service';
import { pollservice } from '../polls/service';
import { StatisticsManager } from '../statistics/manager';
import { PermissionType } from './interface';
import { PermissionsService } from './service';

export class PermissionsManager {
    static async updatePublish(pollId: string) {
        if (await this.isPublished(pollId)) throw ServiceError.alreadyPublished();
        await StatisticsManager.createOne(pollId);
        return PermissionsService.updatePublish(pollId);
    }

    static async isPublished(pollId: string) {
        const poll = await pollservice.getById(pollId);
        if (!poll) throw ServiceError.pollNotFound();
        return PermissionsService.getPublishRequest(pollId);
    }
    static async isRespondable(pollId: string) {
        const permission = await PermissionsService.getPollPermissions(pollId);
        if (!permission) throw ServiceError.permissionNotFound();
        const { respondable } = permission;
        return respondable;
    }
    static async updateAccessPermission(pollId: string, userIds: string[], action: boolean) {
        return PermissionsService.updateManyUsers(pollId, userIds, 'access', action);
    }

    static async updateRespondable(pollId: string, respondable: boolean) {
        return PermissionsService.updateRespondable(pollId, respondable);
    }

    static async getPollKartoffelPermissions(pollId: string) {
        const permissions = await PermissionsService.getPollPermissions(pollId);
        if (!permissions) throw ServiceError.pollNotFound();
        const populatedAccessIds = KartoffelService.getUsersByIds(permissions.accessIds);
        const populatedEditorIds = KartoffelService.getUsersByIds(permissions.editorIds);
        const populatedOwner = KartoffelService.getUserById(permissions.owner);
        const populatedNewOwner = KartoffelService.getUserById(permissions.newOwner);
        // not: Wait for all promises to resolve
        const populatedPermissions = {
            ...permissions,
            accessUsers: populatedAccessIds,
            editorUsers: populatedEditorIds,
            ownerUser: populatedOwner,
            newOwnerUser: populatedNewOwner,
        };
        return populatedPermissions;
    }
    static async updateHierarchy(pollId: string, groupHierarchy: string, groupId: string, action: boolean) {
        const data = await PermissionsService.updateHierarchy(pollId, groupHierarchy, groupId, action);
        return data;
    }

    static async getPollPermission(pollId: string) {
        const permission = await PermissionsService.getPollPermissions(pollId);
        if (!permission) throw ServiceError.permissionNotFound();
        return permission;
    }
    static async updateOneUser(pollId: string, userId: string, level: PermissionType) {
        return PermissionsService.updateOneUser(pollId, userId, level);
    }
    static async updateAccessLevel(pollId: string, permission: boolean) {
        return PermissionsService.updateAccessLevel(pollId, permission);
    }
}
