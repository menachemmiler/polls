import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';

export const createStatisticsRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        pollId: zodMongoObjectId,
    }),
});

export const getByIdRequestSchema = z.object({
    params: z.object({
        pollId: zodMongoObjectId,
    }),
});
