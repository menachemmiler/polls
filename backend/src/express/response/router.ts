import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

import { config } from '../../config';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { createOneRequestSchema, getHasRespondedRequestSchema, getPollByIdRequestSchema } from './validations';
import { ResponsesController } from './controller';
import { checkPermission } from '../../utils/express/middleware/permissions';
import { PermissionType } from '../permissions/interface';

const {
    response: { uri },
    service,
} = config;

export const responseRouter = Router();

responseRouter.post('/', validateRequest(createOneRequestSchema), wrapController(ResponsesController.createOne));
responseRouter.get(
    '/respondents/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(getHasRespondedRequestSchema),
    wrapController(ResponsesController.getRespondentsByPollId),
);
responseRouter.get('/:pollId', validateRequest(getPollByIdRequestSchema), wrapController(ResponsesController.getByPollId));
responseRouter.all('*', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }));
