export enum PermissionType {
    Viewer = 'viewer',
    Editor = 'editor',
}
export interface IPermission {
    pollId: string;
    access: boolean;
    owner: string;
    newOwner: string;
    publish: boolean;
    respondable: boolean;
    accessHierarchy: {
        groupHierarchy: string[];
        groupId: string;
    }[];
    accessUsers: {
        userId: string;
        permission: PermissionType;
    }[];
}

export interface PermissionDocument extends IPermission {
    _id: string;
}
