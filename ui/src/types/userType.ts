export type UsersRoles = 'ADMIN' | 'USER';

export interface IUser {
    genesisId: string;
    fullName: string;
    email: string;
    role: UsersRoles;
    updatedAt?: string;
}
export interface UserDocument extends IUser {
    _id: string;
}
