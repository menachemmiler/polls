import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { PollsController } from './controller';
import { addQuestionRequestSchema, addSectionRequestSchema, copySectionRequestSchema, createOneRequestSchema, deleteOneRequestSchema, deleteQuestionRequestSchema, deleteSectionRequestSchema, getAllByQueryRequestSchema, getAllRequestSchema, getOneByIdRequestSchema, reorderQuestionRequestSchema, reorderSectionsRequestSchema, updateOneRequestSchema, updateSectionRequestSchema } from './validations';

export const PollsRouter = Router();


// GET /api/polls (id[])
PollsRouter.get('/', validateRequest(getAllByQueryRequestSchema), wrapController(PollsController.getAllByQuery));

// GET /api/polls/all/
PollsRouter.get('/all/', validateRequest(getAllRequestSchema), wrapController(PollsController.getAll));

// GET /api/polls/:id
PollsRouter.get('/:id', validateRequest(getOneByIdRequestSchema), wrapController(PollsController.getOneById));

// POST /api/polls
PollsRouter.post('/', validateRequest(createOneRequestSchema), wrapController(PollsController.createOne));

// PUT /api/polls/question
PollsRouter.put('/question', validateRequest(addQuestionRequestSchema), wrapController(PollsController.updateAddQuestion));

// PUT /api/polls/:id
PollsRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(PollsController.updateOne));

PollsRouter.put('/:id/section/:sectionId', validateRequest(updateSectionRequestSchema), wrapController(PollsController.updateSections));

// DELETE /api/polls/question
PollsRouter.delete('/question', validateRequest(deleteQuestionRequestSchema), wrapController(PollsController.deleteQuestion));

// DELETE /api/polls/:id
PollsRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(PollsController.deleteOne));

// POST /api/polls/addsection/:pollId
PollsRouter.post('/addsection/:pollId', validateRequest(addSectionRequestSchema), wrapController(PollsController.addSection));


// PUT /api/polls/question/:pollId/reorder-questions
PollsRouter.put('/question/:pollId/reorder-questions', validateRequest(reorderQuestionRequestSchema), wrapController(PollsController.reorderQuestion));

// PUT /api/polls/section/:pollId/reorder-sections
PollsRouter.put('/section/:pollId/reorder-sections', validateRequest(reorderSectionsRequestSchema), wrapController(PollsController.reorderSection));


PollsRouter.post('/section/:pollId/copy/:sectionId', validateRequest(copySectionRequestSchema),wrapController(PollsController.copySection));


// DELETE /api/polls/section/:pollId/:sectionId
PollsRouter.delete('/section/:pollId/:sectionId', validateRequest(deleteSectionRequestSchema), wrapController(PollsController.deleteSection));
