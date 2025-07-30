import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';
import { QuestionType } from './interface';

const answerSchema = z.object({
    questionId: z.string(),
    questionType: z.nativeEnum(QuestionType),
    answer: z.array(z.string()),
});

const responseSchema = z.object({
    answers: z.array(answerSchema),
    pollId: z.string(),
    submittedAt: z.coerce.date().optional(),
});
// POST /api/responses
export const createOneRequestSchema = z.object({
    body: responseSchema,
    query: z.object({}),
    params: z.object({}),
});

export const getPollByIdRequestSchema = z.object({
    params: z.object({
        pollId: zodMongoObjectId,
    }),
    query: z.object({}),
    body: z.object({}),
});

// GET /api/responses
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        step: z.coerce.number().min(0).default(0),
        limit: z.coerce.number().optional(),
        pollId: z.string().optional(),
        respondentId: z.string().optional(),
    }),
    params: z.object({}),
});

// PUT /api/responses/:id
export const updateOneRequestSchema = z.object({
    body: responseSchema.partial(),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// DELETE /api/responses/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

export const getHasRespondedRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        pollId: zodMongoObjectId,
        respondentId: z.string().optional(),
    }),
});
