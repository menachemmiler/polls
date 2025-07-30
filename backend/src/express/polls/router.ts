import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

import { config } from '../../config';
import {
    addSectionRequestSchema,
    createOneRequestSchema,
    deleteOneRequestSchema,
    deleteSectionRequestSchema,
    getAllPollsRequestSchema,
    getFullPollRequestSchema,
    updateOneRequestSchema,
} from './validations';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { pollsController } from './controller';
import { checkPermission } from '../../utils/express/middleware/permissions';
import { PermissionType } from '../permissions/interface';

const {
    polls: { uri },
    service,
} = config;

export const surveyRouter = Router();

surveyRouter.get('/getMyPolls', validateRequest(getAllPollsRequestSchema), wrapController(pollsController.getAll));

surveyRouter.get(
    '/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(getFullPollRequestSchema),
    wrapController(pollsController.getFull),
);
surveyRouter.delete(
    '/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(deleteOneRequestSchema),
    wrapController(pollsController.deleteOne),
);
surveyRouter.post('/', validateRequest(createOneRequestSchema), wrapController(pollsController.createOne));
surveyRouter.post(
    '/addsection/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(addSectionRequestSchema),
    wrapController(pollsController.addSection),
);

surveyRouter.put(
    '/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(updateOneRequestSchema),
    wrapController(pollsController.updateOne),
);
surveyRouter.delete(
    '/section/:pollId/:sectionId',
    checkPermission(PermissionType.Editor),
    validateRequest(deleteSectionRequestSchema),
    wrapController(pollsController.deleteSection),
);

surveyRouter.all('*', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }));
