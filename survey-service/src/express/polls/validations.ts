import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';

const createRequiredFields = z
    .object({
        name: z.string().nonempty("Name cannot be empty"),
        createdBy: zodMongoObjectId,
    })
    .required();

const optionalFields = z
    .object({
        name: z.string().nonempty("Name cannot be empty").optional(),
        title: z.string().nonempty("Title cannot be empty").optional(),
        description: z.string().optional(),
        isAnonymous: z.boolean().optional(),
        startAt: z.coerce.date().optional(),
        endAt: z.coerce.date().optional(),
        sections: z
            .array(
                z.object({
                    _id: zodMongoObjectId.optional(),
                    title: z.string().nonempty("Section title cannot be empty"),
                    description: z.string().optional(),
                    questions: z.array(zodMongoObjectId),
                })
            ).min(1, "sections cannot be empty").optional(),
          design: z.object({
            header: z.object({
                fontSize: z.number().optional(),
                fontFamily: z.string().optional(),
            }).optional(),
            questions: z.object({
                fontSize: z.number().optional(),
                fontFamily: z.string().optional(),
            }).optional(),
            text: z.object({
                fontSize: z.number().optional(),
                fontFamily: z.string().optional(),
            }).optional(),
            color: z.string().optional(),
            backgroundColor: z.string().optional(),
        }).optional(),

    }).strict();


// GET /api/polls
export const getAllByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
            pollIds: z.array(zodMongoObjectId).optional(),
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
        popolate: z.string().optional()
            .transform((val) => val === "true"),
    }),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /api/polls
export const createOneRequestSchema = z.object({
    body: createRequiredFields.merge(z.object({ _id: zodMongoObjectId.optional() })).merge(optionalFields),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/polls/:id
export const updateOneRequestSchema = z.object({
    body: optionalFields.refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field must be provided" }
    ),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// DELETE /api/polls/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// PUT /api/polls/question
export const addQuestionRequestSchema = z.object({
    body: z.object({
        pollId: zodMongoObjectId,
        sectionId: zodMongoObjectId,
        questionId: zodMongoObjectId,
        index: z.number()
    }),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/polls/:id/section/:sectionId
export const updateSectionRequestSchema = z.object({
    body: z.object({
        title: z.string().nonempty("Section title cannot be empty").optional(),
        description: z.string().optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field must be provided" }
    ),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,         
        sectionId: zodMongoObjectId,  
    }),
});

// PUT /api/polls/question/:pollId/reorder-questions
export const reorderQuestionRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        sectionId: zodMongoObjectId,
        questionId: zodMongoObjectId,
        index: z.string().regex(/^\d+$/).transform(val => parseInt(val, 10))
    }),
    params: z.object({
        pollId: zodMongoObjectId
    }),
});

// PUT /api/polls/section/:pollId/reorder-sections
export const reorderSectionsRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        sectionId: zodMongoObjectId,
        index: z.string().regex(/^\d+$/).transform(val => parseInt(val, 10))
    }),
    params: z.object({
        pollId: zodMongoObjectId
    }),
});

// DELETE /api/polls/question
export const deleteQuestionRequestSchema = z.object({
    body: z.object({
        pollId: zodMongoObjectId,
        sectionId: zodMongoObjectId,
        questionId: zodMongoObjectId,
    }),
    query: z.object({}),
    params: z.object({}),
});

// POST /api/polls/addsection/:pollId
export const addSectionRequestSchema = z.object({
    params: z.object({
        pollId: zodMongoObjectId,
    }),
    query: z.object({}),
    body: z.object({}),
});

// POST /api/polls/copysection/:pollId/:sectionId
export const copySectionRequestSchema = z.object({
  params: z.object({
    pollId: zodMongoObjectId,
    sectionId: zodMongoObjectId
  })
});

// DELETE /api/polls/section/:pollId/:sectionId
export const deleteSectionRequestSchema = z.object({
    params: z.object({
        pollId: z.string(),
        sectionId: z.string(),
    }),
    query: z.object({}),
    body: z.object({}),
});
