import { z } from 'zod';
import { QuestionType } from './interface.js';

export const zodMongoObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const optionSchema = z.object({
    option: z.string(),
    _id: zodMongoObjectId.optional(),
});

const requiredFields = z.object({
    type: z.nativeEnum(QuestionType),
});

const optionalFields = z.object({
    _id: zodMongoObjectId.optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    options: z.array(optionSchema).optional(),
    isRequired: z.boolean().optional(),
    scale: z.number().optional(),
    relatedSectionIds: z.array(z.string()).optional(),
});

const questionIdsField = z.object({
    questionsIds: z.union([z.string(), z.array(z.string())]).transform((val) => {
        const ids = Array.isArray(val) ? val : val.split(',');
        return ids.map((id) => zodMongoObjectId.parse(id));
    }),
});

export const getAllRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({}),
});


export const getByIdsRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        questionsIds: z.union([z.string(), z.array(z.string())]).transform((val) => {
            const ids = Array.isArray(val) ? val : val.split(',');
            return ids.map((id) => zodMongoObjectId.parse(id));
        }),
    }),
    params: z.object({}),
});


export const createOneRequestSchema = z.object({
    body: requiredFields.merge(optionalFields),
    query: z.object({}),
    params: z.object({}),
});

export const updateOneRequestSchema = z.object({
    body: requiredFields.merge(optionalFields).partial(),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

export const deleteManyRequestSchema = z.object({
    body: z.object({}),
    query: questionIdsField,
    params: z.object({}),
});
