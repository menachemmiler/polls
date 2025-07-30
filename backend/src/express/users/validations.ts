import { z } from 'zod';
import { UsersRoles } from './interface';
import { zodMongoObjectId } from '../../utils/zod';

const requiredFields = z
    .object({
        username: z.string(),
        genesisId: z.string(),
        role: z.nativeEnum(UsersRoles).default(UsersRoles.USER),
    })
    .required();

// GET /api/users
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        genesisId: z.string(),
    }),
});
// PUT /api/users/:id
export const updateOneRequestSchema = z.object({
    body: requiredFields.partial(),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
