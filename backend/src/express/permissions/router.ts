import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { config } from '../../config';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { checkPermission } from '../../utils/express/middleware/permissions';
import {
    updateAccessSchema,
    updatePublishRequestSchema,
    getPollKartoffelPermissionsRequestSchema,
    updateRespondableSchema,
    updateHierarchyRequestSchema,
    updateOneUserRequestSchema,
    updateAccessLevelRequestSchema,
} from './validations';
import { PermissionsController } from './controller';
import { getFullPollRequestSchema } from '../polls/validations';
import { PermissionType } from './interface';

const {
    permissions: { uri },
    service,
} = config;
export const permissionsRouter = Router();

// GET /api/permissions/:pollId
permissionsRouter.get(
    '/kartoffel/:pollId',
    validateRequest(getPollKartoffelPermissionsRequestSchema),
    wrapController(PermissionsController.getPollKartoffelPermissions),
);

permissionsRouter.put(
    '/respondable/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(updateRespondableSchema),
    wrapController(PermissionsController.updateRespondable),
);
permissionsRouter.put(
    '/publish/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(updatePublishRequestSchema),
    wrapController(PermissionsController.updatePublish),
);

permissionsRouter.get(
    '/ispublished/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(getFullPollRequestSchema),
    wrapController(PermissionsController.isPublished),
);
permissionsRouter.get(
    '/isrespondable/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(getFullPollRequestSchema),
    wrapController(PermissionsController.isRespondable),
);

permissionsRouter.put(
    '/updateAccessUsers',
    checkPermission(PermissionType.Editor),
    validateRequest(updateAccessSchema),
    wrapController(PermissionsController.updateAccess),
);
permissionsRouter.put(
    '/updateAccessHierarchy',
    checkPermission(PermissionType.Editor),
    validateRequest(updateHierarchyRequestSchema),
    wrapController(PermissionsController.updateHierarchy),
);

permissionsRouter.put(
    '/:pollId/:userId',
    checkPermission(PermissionType.Editor),
    validateRequest(updateOneUserRequestSchema),
    wrapController(PermissionsController.updateOneUser),
);
permissionsRouter.get(
    '/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(getFullPollRequestSchema),
    wrapController(PermissionsController.getPollPermission),
);
permissionsRouter.put(
    '/:pollId',
    checkPermission(PermissionType.Editor),
    validateRequest(updateAccessLevelRequestSchema),
    wrapController(PermissionsController.updateAccessLevel),
);

permissionsRouter.all('*', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }));
