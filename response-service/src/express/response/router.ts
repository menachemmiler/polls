import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers.js';
import { ResponseController } from './controller.js';
import {
    createOneRequestSchema,
    deleteByQuestionRequestSchema,
    deleteOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getByQuestionIdSchema,
    getHasRespondedRequestSchema,
} from './validations.js';

export const responseRouter = Router();

responseRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(ResponseController.getByQuery));
responseRouter.get('/hasResponses/:pollId', validateRequest(getByIdRequestSchema), wrapController(ResponseController.hasResponses));
responseRouter.get('/question/:questionId', validateRequest(getByQuestionIdSchema), wrapController(ResponseController.getAnswersByQuestionId));
responseRouter.get(
  '/respondents/:pollId',
  validateRequest(getByIdRequestSchema),
  wrapController(ResponseController.getRespondentsByPollId)
);


responseRouter.get('/:pollId/:genesisId', validateRequest(getHasRespondedRequestSchema), wrapController(ResponseController.hasUserResponded));

responseRouter.post('/', validateRequest(createOneRequestSchema), wrapController(ResponseController.createOne));

responseRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(ResponseController.deleteMany));
responseRouter.delete(
    '/:pollId/question/:questionId',
    validateRequest(deleteByQuestionRequestSchema),
    wrapController(ResponseController.deleteByQuestion),
);
