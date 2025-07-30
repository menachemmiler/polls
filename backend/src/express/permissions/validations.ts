import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';
import { PermissionType } from './interface';

const pollId = z
    .object({
        pollId: zodMongoObjectId,
    })
    .required()
    .strict();

export const updatePublishRequestSchema = z.object({
    params: z.object({
        pollId: z.string().min(1),
    }),
    body: z.object({}),
    query: z.object({}),
});
export const updateAccessSchema = z.object({
    body: z.object({
        pollId: zodMongoObjectId,
        users: z.array(zodMongoObjectId),
        action: z.coerce.boolean().default(true),
    }),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/permissions/respondable/:pollId
export const updateRespondableSchema = z.object({
    body: z.object({
        respondable: z.boolean(),
    }),
    query: z.object({}).optional(),

    params: z.object({
        pollId: z.string().min(1),
    }),
});

// GET /api/permissions/:pollId
export const getPollKartoffelPermissionsRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: pollId,
});
// PUT /api/permissions/hierarchy/:pollId
export const updateHierarchyRequestSchema = z.object({
    body: z.object({
        groupId: zodMongoObjectId,
        groupHierarchy: z.string(),
        pollId: zodMongoObjectId,
        action: z.coerce.boolean(),
    }),
    query: z.object({}),
    params: z.object({}),
});
// PUT /api/permissions/:pollId/:userId
export const updateOneUserRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        level: z.nativeEnum(PermissionType).default(PermissionType.Viewer),
    }),
    params: z.object({ pollId: zodMongoObjectId, userId: zodMongoObjectId }),
});

export const updateAccessLevelRequestSchema = z.object({
    body: z.object({ permission: z.coerce.boolean() }),
    query: z.object({}),
    params: z.object({ pollId: zodMongoObjectId }),
});
