import { IUser, UserDocument } from './interface.js';
import { UsersModel } from './model.js';

export class UserManager {
    static createOne = async (users: IUser): Promise<UserDocument> => {
        return UsersModel.create(users);
    };
    static getById = async (id: string): Promise<UserDocument | null> => {
        return UsersModel.findById(id);
    };
    static deleteOne = async (id: string): Promise<UserDocument | null> => {
        return UsersModel.findByIdAndDelete(id);
    };
    static updateOne = async (id: string, users: Partial<IUser>): Promise<UserDocument | null> => {
        return UsersModel.findByIdAndUpdate(id, users, { new: true });
    };
    static getAll = async (filters: Partial<IUser>): Promise<UserDocument[]> => {
        return UsersModel.find(filters);
    };
    static getByGenesisId = async (genesisId: string): Promise<UserDocument | null> => {
        return UsersModel.findOne({ genesisId });
    };
    
    
      
}
