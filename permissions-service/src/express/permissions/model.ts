import mongoose from 'mongoose';
import { config } from '../../config';
import { PermissionDocument } from './interface';

const PermissionSchema = new mongoose.Schema<PermissionDocument>(
    {
        pollId: { type: String, required: true },
        access: { type: Boolean, default: true },
        owner: { type: String, required: true },
        newOwner: { type: String, required: false },
        publish: { type: Boolean, default: false },
        respondable: { type: Boolean, default: true },
        accessHierarchy: {
            type: [
                {
                    groupHierarchy: { type: [String], required: true },
                    groupId: { type: String,  required: true },
                },
            ],
            default: [],
        },

        accessUsers: {
            type: [
                {
                    userId: { type: String, required: true },
                    permission: {
                        type: String,
                        enum: ['viewer', 'editor'],
                        default: 'viewer',
                    },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const PermissionsModel = mongoose.model<PermissionDocument>(config.mongo.permissionsCollectionName, PermissionSchema);
