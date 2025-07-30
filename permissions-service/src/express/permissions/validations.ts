import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';
import { PermissionType } from './interface';

const userId = z
    .object({
        userId: zodMongoObjectId,
    })
    .required()
    .strict();

const pollId = z
    .object({
        pollId: zodMongoObjectId,
    })
    .required()
    .strict();

const pollIdAndUserId = z.object({}).merge(userId).merge(pollId).required().strict();

// POST /api/permissions/:pollId/:userId
export const createOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: pollIdAndUserId,
});

// GET /api/permissions/polls/:userId'
export const getAllPollsByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
            owner: z.coerce.boolean().optional().default(false),
            editor: z.coerce.boolean().optional().default(false),
        })
        .optional(),
    params: userId,
});

// GET /api/permissions/:pollId
export const getPollPermissionsRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: pollId,
});

// GET /api/permissions/:pollId/:userId
export const getPollUserPermissionRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        level: z.nativeEnum(PermissionType),
    }),
    params: pollIdAndUserId,
});

// GET /api/permissions/:pollId/hierarchy
export const getPollHierarchyPermissionRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        hierarchyId: zodMongoObjectId,
    }),
    params: pollId,
});

// PUT /api/permissions/:pollId/ {filter: for all/restrect access/editor}
export const updatePermissionRequestSchema = z.object({
    body: z.object({ permission: z.coerce.boolean().default(false) }),
    query: z.object({}),
    params: pollId,
});

// PUT /api/permissions/:pollId/:userId {filter: add/rmove access/editor}
export const updateOneUserRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        level: z.nativeEnum(PermissionType),
    }),
    params: pollIdAndUserId,
});

// PUT /api/permissions/:pollId/users {filter: add/rmove access/editor}
export const updateManyUsersRequestSchema = z.object({
    body: z.object({ users: z.array(zodMongoObjectId), action: z.coerce.boolean() }),
    query: z.object({}),
    params: z.object({
        pollId: zodMongoObjectId,
    }),
});

// PUT /api/permissions/owner/accept/:pollId
export const acceptOwnerRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: pollId,
});

// PUT /api/permissions/owner/:pollId {filter: Accept / Reject / Remove}
export const rejectOwnerRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: pollId,
});

// PUT /api/permissions/owner/:pollId/:userId
export const updateNewOwnerRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: pollIdAndUserId,
});

// PUT /api/permissions/publish/:pollId
export const updatePublishRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: pollId,
});

// GET /api/permissions/publish/:pollId
export const getPublishRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: pollId,
});

// DELETE /api/permissions/:pollId
export const deleteOnePermissionRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: pollId,
});

// PUT /api/permissions/respondable/:pollId
export const updateRespondableSchema = z.object({
    body: z.object({
        respondable: z.boolean(),
    }),
    query: z.object({}).optional(),

    params: pollId,
});

// PUT /api/permissions/hierarchy/:pollId
export const updateHierarchyRequestSchema = z.object({
    body: z.object({
        groupId: zodMongoObjectId,
        groupHierarchy: z.string(),
        action: z.coerce.boolean(),
    }),
    query: z.object({}),
    params: z.object({
        pollId: zodMongoObjectId,
    }),
});
