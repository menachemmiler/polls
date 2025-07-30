import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { KartoffelController } from './controller';
import { getGroupByIdRequestSchema, searchGroupsRequestSchema, searchUsersRequestSchema } from './validations';

export const kartoffelRouter = Router();

kartoffelRouter.get('/searchUser/:name', validateRequest(searchUsersRequestSchema), wrapController(KartoffelController.searchUsers));
kartoffelRouter.get('/searchGroups/:name', validateRequest(searchGroupsRequestSchema), wrapController(KartoffelController.searchGroups));
kartoffelRouter.get('/getGroupById/:groupId', validateRequest(getGroupByIdRequestSchema), wrapController(KartoffelController.getGroupById));
