import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

import { config } from '../../config';
import { getByIdRequestSchema } from './validations';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { StatisticsController } from './controller';
import { checkPermission } from '../../utils/express/middleware/permissions';
import { PermissionType } from '../permissions/interface';

const {
    statistics: { uri },
    service,
} = config;

export const statisticsRouter = Router();

statisticsRouter.get(
    '/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(getByIdRequestSchema),
    wrapController(StatisticsController.getStatistics),
);
statisticsRouter.all('*', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }));
