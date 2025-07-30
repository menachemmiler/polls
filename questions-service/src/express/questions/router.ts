import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers.js';
import { QuestionsController } from './controller.js';
import {
    createOneRequestSchema,
    deleteManyRequestSchema,
    deleteOneRequestSchema,
    getAllRequestSchema,
    getByIdsRequestSchema,
    updateOneRequestSchema,
} from './validations.js';

export const questionsRouter = Router();

questionsRouter.get('/', validateRequest(getAllRequestSchema), wrapController(QuestionsController.getAll));
questionsRouter.get('/byIds', validateRequest(getByIdsRequestSchema), wrapController(QuestionsController.getByIds));

questionsRouter.post('/', validateRequest(createOneRequestSchema), wrapController(QuestionsController.createOne));

questionsRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(QuestionsController.updateOne));

questionsRouter.delete('/many', validateRequest(deleteManyRequestSchema), wrapController(QuestionsController.deleteManyByIds));

questionsRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(QuestionsController.deleteOne));
