import mongoose from 'mongoose';
import { config } from '../../config.js';
import { UserDocument, UsersRoles } from './interface.js';

const UsersSchema = new mongoose.Schema<UserDocument>(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        genesisId: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(UsersRoles),
            default: UsersRoles.USER,
        },
    },
    {
        timestamps: true,
    },
);

export const UsersModel = mongoose.model<UserDocument>(config.mongo.usersCollectionName, UsersSchema);
