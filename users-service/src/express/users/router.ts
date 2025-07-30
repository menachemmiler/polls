import { Router } from 'express';
import { UsersController } from './controller.js';
import { createOneRequestSchema, getAllRequestSchema, getByGenesisIdRequestSchema, getByIdRequestSchema, updateOneRequestSchema } from './validations.js';
import { validateRequest, wrapController } from '../../utils/express/wrappers.js';

export const usersRouter = Router();

usersRouter.post('/', validateRequest(createOneRequestSchema), wrapController(UsersController.createOne));
usersRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(UsersController.getById));
usersRouter.get('/', validateRequest(getAllRequestSchema), wrapController(UsersController.getAll));
usersRouter.get('/by-genesis/:genesisId',validateRequest(getByGenesisIdRequestSchema), wrapController(UsersController.getByGenesisId));
usersRouter.delete('/:id', wrapController(UsersController.deleteOne));
usersRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(UsersController.updateOne));
