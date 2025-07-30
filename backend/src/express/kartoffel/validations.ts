import { z } from 'zod';

// GET /api/kartoffel/search?fullName=
export const searchUsersRequestSchema = z.object({
    params: z.object({ name: z.string() }),
    query: z.object({}),
    body: z.object({}),
});

export const searchGroupsRequestSchema = z.object({
    params: z.object({ name: z.string() }),
    query: z.object({}),
    body: z.object({}),
});

// Zod
export const getGroupByIdRequestSchema = z.object({
    params: z.object({
        groupId: z.string(),
    }),
    query: z.object({
        numPage: z.coerce.number(),
        pageSize: z.coerce.number(),
    }),
    body: z.object({}),
});
