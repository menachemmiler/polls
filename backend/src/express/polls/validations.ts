import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';

const optionalFields = z
    .object({
        name: z.string().nonempty('Name cannot be empty').optional(),
        title: z.string().nonempty('Title cannot be empty').optional(),
        description: z.string().optional(),
        isAnonymous: z.boolean().optional(),
        startAt: z.coerce.date().optional(),
        endAt: z.coerce.date().optional(),
        sections: z
            .array(
                z.object({
                    _id: zodMongoObjectId.optional(),
                    title: z.string().nonempty('Section title cannot be empty').optional(),
                    description: z.string().optional(),
                    questions: z.array(zodMongoObjectId),
                }),
            )
            .min(1, 'sections cannot be empty')
            .optional(),
        design: z
            .object({
                header: z
                    .object({
                        fontSize: z.number().optional(),
                        fontFamily: z.string().optional(),
                    })
                    .optional(),
                questions: z
                    .object({
                        fontSize: z.number().optional(),
                        fontFamily: z.string().optional(),
                    })
                    .optional(),
                text: z
                    .object({
                        fontSize: z.number().optional(),
                        fontFamily: z.string().optional(),
                    })
                    .optional(),
                color: z.string().optional(),
                backgroundColor: z.string().optional(),
            })
            .optional(),
    })
    .strict();
// POST /api/polls
export const createOneRequestSchema = z.object({
    body: optionalFields
        .extend({
            _id: z.string().optional(),
        })
        .refine((data) => !data.startAt || !data.endAt || data.endAt > data.startAt, { message: 'endAt must be after startAt', path: ['endAt'] }),
    query: z.object({}),
    params: z.object({}),
});
// PUT /api/polls/:id
export const updateOneRequestSchema = z.object({
    body: optionalFields.refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' }),
    query: z.object({}),
    params: z.object({
        pollId: zodMongoObjectId,
    }),
});

// GET /api/polls
export const getAllByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        step: z.coerce.number().min(0).default(0),
        limit: z.coerce.number().optional(),
        pollIds: z.array(zodMongoObjectId),
    }),
    params: z.object({}),
});

export const getAllRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({}),
});

// GET /api/polls/:id
export const getOneByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        popolate: z
            .string()
            .optional()
            .transform((val) => val === 'true'),
    }),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// DELETE /api/polls/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        pollId: zodMongoObjectId,
    }),
});
export const getFullPollRequestSchema = z.object({
    params: z.object({
        pollId: zodMongoObjectId,
    }),
    query: z.object({}),
    body: z.object({}),
});

export const addSectionRequestSchema = z.object({
    params: z.object({
        pollId: zodMongoObjectId,
    }),
    query: z.object({}),
    body: z.object({}),
});

export const getAllPollsRequestSchema = z.object({
    query: z.object({}),
    body: z.object({}),
    params: z.object({}),
});
export const deleteSectionRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        pollId: zodMongoObjectId,
        sectionId: zodMongoObjectId,
    }),
});
