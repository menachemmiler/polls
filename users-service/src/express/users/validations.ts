import { z } from 'zod';
import { UsersRoles } from './interface.js';
import { zodMongoObjectId } from '../../utils/zod.js';

const userSchemaFields = z
    .object({
        fullName: z.string(),
        email: z.string().email(),
        role: z.nativeEnum(UsersRoles),
    })
    .strict()
    
const optionalUserSchemaFields = z
    .object({
        genesisId: z.string(),   
}).strict();

// GET /api/users/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
// GET /api/users/by-genesis/:genesisId
export const getByGenesisIdRequestSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    genesisId: zodMongoObjectId,
  }),
});


// POST /api/users
export const createOneRequestSchema = z.object({
    body: userSchemaFields.merge(optionalUserSchemaFields),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/users/:id
export const updateOneRequestSchema = z.object({
    body: userSchemaFields.partial(),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
//GET /api/users
export const getAllRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}).passthrough(),
    params: z.object({}),
  });
  
  

