import { DocumentNotFoundError, DuplicateDocumentError } from '../../utils/errors';
import { PermissionDocument, PermissionType } from './interface';
import { PermissionsModel } from './model';

export class PermissionsManager {
   static createOne = async (pollId: string, userId: string): Promise<PermissionDocument> => {
    if (await PermissionsModel.exists({ pollId })) {
        throw new DuplicateDocumentError(pollId);
    }

    try {
        return await PermissionsModel.create({ pollId, owner: userId });
    } catch (error: any) {
        console.log('שגיאה בזמן יצירת הרשאה במסד:', {
            message: error.message,
            name: error.name,
            code: (error as any).code,
            stack: error.stack,
            error,
        });
        throw error;
    }
};


    static getAllPolls = async (userId: string, query: any) => {
        const { step = 0, limit = 100, owner, editor } = query;

        const conditions = [];

        if (owner) conditions.push({ owner: userId });
        // if (editor) conditions.push({ accessUsers: { userId, permissions: 'editor' } });
                if (editor) conditions.push({ accessUsers: { $elemMatch: { userId, permission: 'editor' } } });


        const permissions = conditions.length ? await PermissionsModel.find({ $or: conditions }).skip(step).limit(limit).lean().exec() : [];

        return permissions.reduce(
            (aggregated, item) => {
                if (item.owner.toString() === userId) {
                    aggregated.owner.push(item.pollId.toString());
                } else {
                    aggregated.editor.push(item.pollId.toString());
                }
                return aggregated;
            },
            { owner: [] as string[], editor: [] as string[] },
        );
    };

    static getPollPermissions = async (pollId: string): Promise<PermissionDocument> => {
        return PermissionsModel.findOne({ pollId: pollId }).orFail(new DocumentNotFoundError(pollId.toString())).lean().exec();
    };

    static getAllAllPermissions = async (): Promise<PermissionDocument[]> => {
        return PermissionsModel.find().lean().exec();
    };

    static getPollUserPermission = async (pollId: string, userId: string, level: PermissionType): Promise<boolean> => {
        const poll = await PermissionsModel.findOne({
            pollId: pollId,
        })
            .orFail(new DocumentNotFoundError(pollId))
            .lean()
            .exec();

        return poll.accessUsers.some((p) => p.userId === userId && p.permission === level)
            || poll.owner.toString() === userId || poll.newOwner?.toString() === userId;
    };

    static getPollHierarchyPermission = async (pollId: string, hierarchyId: string): Promise<boolean> => {
        const poll = await PermissionsModel.findOne({
            pollId: pollId,
        })
            .orFail(new DocumentNotFoundError(pollId))
            .lean()
            .exec();
        return poll.accessHierarchy.filter((item) => item.groupId === hierarchyId).length > 0;
    };

    static updatePermission = async (pollId: string, permission: boolean): Promise<PermissionDocument> => {
        return PermissionsModel.findOneAndUpdate({ pollId: pollId }, { access: permission }, { new: true })
            .orFail(new DocumentNotFoundError(pollId))
            .lean()
            .exec();
    };

    static updateOwnedById = async (
        pollId: string,
        userId: string,
        level: PermissionType
    ): Promise<PermissionDocument> => {
        const doc = await PermissionsModel.findOne({ pollId }).orFail(new DocumentNotFoundError(pollId));

        doc.accessUsers = doc.accessUsers.filter((u) => u.userId !== userId);

        doc.accessUsers.push({ userId, permission: level });

        await doc.save();
        return doc.toObject();
    };
    static updateManyUsers = async (
        pollId: string,
        userIds: string[],
        action: boolean
    ): Promise<PermissionDocument> => {
        const usersToUpdate = userIds.map((userId) => ({
            userId,
            permission: 'viewer',
        }));

        const update = action
            ? { $addToSet: { accessUsers: { $each: usersToUpdate } } }
            : { $pull: { accessUsers: { userId: { $in: userIds } } } };

        return PermissionsModel.findOneAndUpdate(
            { pollId },
            update,
            { new: true }
        ).orFail(new DocumentNotFoundError(pollId)).lean().exec();
    };


    static updateNewOwner = async (pollId: string, newOwner: string): Promise<PermissionDocument> => {
        const update = {
            $pull: { accessUsers: { userId: newOwner } },
            $set: { newOwner: newOwner },
        };
        return PermissionsModel.findOneAndUpdate({ pollId: pollId }, update, { new: true }).orFail(new DocumentNotFoundError(pollId)).lean().exec();
    };

    static rejectOwner = async (pollId: string): Promise<PermissionDocument> => {
        const permission = await PermissionsModel.findOne({ pollId: pollId }).orFail(new DocumentNotFoundError(pollId))
        permission.accessUsers.push({ userId: permission.newOwner, permission: PermissionType.Editor })
        permission.newOwner = ""
        await permission.save();
        return permission.toObject();

    };

    static acceptOwner = async (pollId: string): Promise<PermissionDocument> => {
        const permission = await PermissionsModel.findOne({ pollId: pollId }).orFail(new DocumentNotFoundError(pollId))
        permission.accessUsers.push({ userId: permission.owner, permission: PermissionType.Editor })
        permission.owner = permission.newOwner
        permission.newOwner = ""
        await permission.save();
        return permission.toObject();
    };

    static updatePublishRequestSchema = async (pollId: string): Promise<PermissionDocument> => {
        return PermissionsModel.findOneAndUpdate({ pollId: pollId }, [{ $set: { publish: true, respondable: true } }], { new: true })
            .orFail(new DocumentNotFoundError(pollId))
            .lean()
            .exec();
    };

    static getPublishRequestSchema = async (pollId: string): Promise<boolean> => {
        const permission = await PermissionsModel.findOne({ pollId: pollId }).orFail(new DocumentNotFoundError(pollId)).lean().exec();
        return permission.publish;
    };

    static deleteOne = async (pollId: string): Promise<PermissionDocument> => {
        return PermissionsModel.findOneAndDelete({ pollId: pollId }).orFail(new DocumentNotFoundError(pollId)).lean().exec();
    };
    static updateRespondable = async (pollId: string, respondable: boolean): Promise<PermissionDocument> => {
        return PermissionsModel.findOneAndUpdate({ pollId }, { respondable }, { new: true }).orFail(new DocumentNotFoundError(pollId)).lean().exec();
    };
    static updateHierarchy = async (pollId: string, groupHierarchy: string, groupId: string, action: boolean): Promise<PermissionDocument> => {
        const updateOperation = action
            ? { $push: { accessHierarchy: { groupId, groupHierarchy } } }
            : { $pull: { accessHierarchy: { groupId, groupHierarchy } } };

        return PermissionsModel.findOneAndUpdate({ pollId }, updateOperation, { new: true }).orFail(new DocumentNotFoundError(pollId)).lean().exec();
    };
}
