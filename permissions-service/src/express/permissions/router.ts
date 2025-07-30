import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { PermissionsController } from './controller';
import {
    acceptOwnerRequestSchema,
    createOneRequestSchema,
    deleteOnePermissionRequestSchema,
    getPollPermissionsRequestSchema,
    getAllPollsByQueryRequestSchema,
    getPollUserPermissionRequestSchema,
    getPublishRequestSchema,
    rejectOwnerRequestSchema,
    updateHierarchyRequestSchema,
    updateNewOwnerRequestSchema,
    updateOneUserRequestSchema,
    updatePermissionRequestSchema,
    updatePublishRequestSchema,
    updateRespondableSchema,
    updateManyUsersRequestSchema,
    getPollHierarchyPermissionRequestSchema,
} from './validations';

export const PermissionsRouter = Router();

// POST /api/permissions/:pollId/:userId
PermissionsRouter.post(
    '/:pollId/:userId',
    validateRequest(createOneRequestSchema),
    wrapController(PermissionsController.createOne),
);

// GET /api/permissions/polls/:userId
PermissionsRouter.get(
    '/polls/:userId',
    validateRequest(getAllPollsByQueryRequestSchema),
    wrapController(PermissionsController.getAllPolls),
);

// GET /api/permissions/all
PermissionsRouter.get(
    '/all',
    wrapController(PermissionsController.getAllAllPermissions),
);

// GET /api/permissions/publish/:pollId
PermissionsRouter.get(
    '/publish/:pollId',
    validateRequest(getPublishRequestSchema),
    wrapController(PermissionsController.getPublishRequestSchema),
);

// GET /api/permissions/:pollId/hierarchy
PermissionsRouter.get(
    '/:pollId/hierarchy',
    validateRequest(getPollHierarchyPermissionRequestSchema),
    wrapController(PermissionsController.getPollHierarchyPermission),
);

// GET /api/permissions/:pollId
PermissionsRouter.get(
    '/:pollId',
    validateRequest(getPollPermissionsRequestSchema),
    wrapController(PermissionsController.getPollPermissions),
);

// GET /api/permissions/:pollId/:userId
PermissionsRouter.get(
    '/:pollId/:userId',
    validateRequest(getPollUserPermissionRequestSchema),
    wrapController(PermissionsController.getPollUserPermission),
);

// PUT /api/permissions/updateHierarchy/:pollId
PermissionsRouter.put(
    '/updateHierarchy/:pollId',
    validateRequest(updateHierarchyRequestSchema),
    wrapController(PermissionsController.updateHierarchy),
);

// PUT /api/permissions/:pollId/users
PermissionsRouter.put(
    '/:pollId/users',
    validateRequest(updateManyUsersRequestSchema),
    wrapController(PermissionsController.updateManyUsers),
);

// PUT /api/permissions/:pollId
PermissionsRouter.put(
    '/:pollId',
    validateRequest(updatePermissionRequestSchema),
    wrapController(PermissionsController.updatePermission),
);
// PUT /api/permissions/publish/:pollId
PermissionsRouter.put(
    '/publish/:pollId',
    validateRequest(updatePublishRequestSchema),
    wrapController(PermissionsController.updatePublishRequestSchema),
);

// PUT /api/permissions/owner/:pollId
PermissionsRouter.put(
    '/owner/:pollId',
    validateRequest(rejectOwnerRequestSchema),
    wrapController(PermissionsController.rejectOwner),
);

// PUT /api/permissions/owner/accept/:pollId
PermissionsRouter.put(
    '/owner/accept/:pollId',
    validateRequest(acceptOwnerRequestSchema),
    wrapController(PermissionsController.acceptOwner),
);

// PUT /api/permissions/owner/:pollId/:userId
PermissionsRouter.put(
    '/owner/:pollId/:userId',
    validateRequest(updateNewOwnerRequestSchema),
    wrapController(PermissionsController.updateNewOwner),
);



// PUT /api/permissions/respondable/:pollId
PermissionsRouter.put(
    '/respondable/:pollId',
    validateRequest(updateRespondableSchema),
    wrapController(PermissionsController.updateRespondable),
);

// PUT /api/permissions/:pollId/:userId
PermissionsRouter.put(
    '/:pollId/:userId',
    validateRequest(updateOneUserRequestSchema),
    wrapController(PermissionsController.updateOneUser),
);

// DELETE /api/permissions/:pollId
PermissionsRouter.delete(
    '/:pollId',
    validateRequest(deleteOnePermissionRequestSchema),
    wrapController(PermissionsController.deleteOne),
);
