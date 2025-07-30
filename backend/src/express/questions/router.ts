import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

import { config } from '../../config';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { createOneRequestSchema, deleteQuestionRequestSchema, updateOneRequestSchema } from './validations';
import { QuestionsController } from './controller';
import { checkPermission } from '../../utils/express/middleware/permissions';
import { PermissionType } from '../permissions/interface';

const {
    questions: { uri },
    service,
} = config;
export const questionsRouter = Router();
questionsRouter.delete(
    '/:questionId',
    checkPermission(PermissionType.Editor),
    validateRequest(deleteQuestionRequestSchema),
    wrapController(QuestionsController.deleteOne),
);
questionsRouter.post(
    '/',
    checkPermission(PermissionType.Editor),
    validateRequest(createOneRequestSchema),
    wrapController(QuestionsController.createOne),
);
questionsRouter.put(
    '/:id',
    checkPermission(PermissionType.Editor),
    validateRequest(updateOneRequestSchema),
    wrapController(QuestionsController.updateOne),
);

questionsRouter.all('*', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }));
