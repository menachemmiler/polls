import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';
import { QuestionType } from '../../enums/questionType';

const answerSchema = z.object({
    questionId: z.string(),
    questionType: z.nativeEnum(QuestionType),
    answer: z.array(z.string()),
});

const responseSchema = z.object({
    answers: z.array(answerSchema).optional(),
    respondentId: z.string(),
    pollId: zodMongoObjectId,
    submittedAt: z.coerce.date().optional(),
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

// POST /api/responses
export const createOneRequestSchema = z.object({
    body: responseSchema,
    query: z.object({}),
    params: z.object({}),
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
  params: z.object({
    pollId: zodMongoObjectId,
    genesisId: zodMongoObjectId,
  }),
  query: z.object({}),
  body: z.object({}),
});
export const getByQuestionIdSchema = z.object({
  params: z.object({
    questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  }),
  query: z.object({}),
  body: z.object({}),
});
export const deleteByQuestionRequestSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    pollId: zodMongoObjectId,
    questionId: zodMongoObjectId,
  }),
});
export const getByIdRequestSchema = z.object({
  params: z.object({
    pollId: zodMongoObjectId,
  }),
  query: z.object({}),
  body: z.object({}),
});

