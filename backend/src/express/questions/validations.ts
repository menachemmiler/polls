import { z } from 'zod';
import { QuestionType } from './interface';

export const zodMongoObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId' });

const requiredFields = z.object({
    type: z.nativeEnum(QuestionType),
});
const optionSchema = z.object({
    option: z.string(),
    _id: zodMongoObjectId.optional(),
});

const optionalFields = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    options: z.array(optionSchema).optional(),
    isRequired: z.boolean().optional(),
    scale: z.number().optional(),
    relatedSectionIds: z.array(z.number()).optional(),
    pollId: zodMongoObjectId,
    sectionId: zodMongoObjectId,
    index: z.number().min(0).optional(),
});

// GET /api/questions/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /api/questions
export const createOneRequestSchema = z.object({
    params: z.object({}),
    query: z.object({}),
    body: requiredFields.merge(optionalFields),
});
// DELETE /api/polls/question
export const deleteQuestionRequestSchema = z.object({
    body: z.object({
        pollId: zodMongoObjectId,
        sectionId: zodMongoObjectId,
    }),
    query: z.object({}),
    params: z.object({
        questionId: zodMongoObjectId,
    }),
});
export const updateOneRequestSchema = z.object({
    body: requiredFields.merge(optionalFields).partial(),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
