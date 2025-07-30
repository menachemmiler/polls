import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';
import { QuestionType } from './interface';

const pollId = z.object({
    pollId: zodMongoObjectId,
});

const createFields = z.object({
    pollId: zodMongoObjectId,
    questionStats: z.array(
        z.object({
            questionId: zodMongoObjectId,
            questionType: z.nativeEnum(QuestionType),
            optionAnswerCounts: z.array(
                z.object({
                    _id: zodMongoObjectId,
                    option: z.string(),
                }),
            ),
        }),
    ),
});

const updateStatisticsFields = z.object({
    answers: z.array(
        z.object({
            questionId: zodMongoObjectId,
            selectedOption: z.array(z.string()),
        }),
    ),
});

const filterFields = z.object({
    questionId: zodMongoObjectId.optional(),
    questionType: z.nativeEnum(QuestionType).optional(),
    pollId: zodMongoObjectId.optional(),
});

export const getByQueryRequestSchema = z.object({
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
        })
        .merge(filterFields),
});

export const getByIdRequestSchema = z.object({
    params: z.object({
        pollId: zodMongoObjectId,
    }),
});

export const createStatisticsRequestSchema = z.object({
    body: createFields,
});

export const updateStatisticsRequestSchema = z.object({
    params: pollId,
    body: updateStatisticsFields,
});

export const updateStatisticsFormRequestSchema = z.object({
    params: pollId,
    body: z.object({
        questionId: zodMongoObjectId,
        questionType: z.nativeEnum(QuestionType),
        options: z.array(
            z.object({
                _id: zodMongoObjectId,
                option: z.string(),
            }),
        ),
    }),
});

export const deleteQuestionRequestSchema = z.object({
    params: z.object({
        pollId: zodMongoObjectId,
        questionId: zodMongoObjectId,
    }),
});
