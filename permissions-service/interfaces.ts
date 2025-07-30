// export interface IpermissionPoll {
//   pollId: string;
//   access?: string[];
//   editorIds?: string[];
//   ownedBy: string;
//   newOner: {
//     _id: string;
//     status: string;
//   };
// }
// //למחוק console.log
// // // PUT /api/polls/access/:id/:userId
// // PollsRouter.put('/:id/:userId', validateRequest(updateOneRequestSchema), wrapController(PollsController.updateOne));

// // PUT /api/polls/owned/:id/:userId
// PollsRouter.put(
//   "/:id/:userId",
//   validateRequest(updateOwnedByIdRequestSchema),
//   wrapController(PollsController.updateOwnedById)
// );

// //למחוק console.log
// // // PUT /api/polls/access/:id/:userId
// // export const updateAccessRequestSchema = z.object({
// //     body: z.object({
// //         access: z.array(zodMongoObjectId).optional(),
// //         editorIds: z.array(zodMongoObjectId).optional(),
// //     }),
// //     query: z.object({}),
// //     params: z.object({
// //         id: zodMongoObjectId,
// //         userId: zodMongoObjectId,
// //     }),
// // });

// // PUT /api/polls/owned/:id/:userId
// export const updateOwnedByIdRequestSchema = z.object({
//   body: z.object({}),
//   query: z.object({
//     ownedBy: zodMongoObjectId,
//   }),
//   params: z.object({
//     id: zodMongoObjectId,
//     userId: zodMongoObjectId,
//   }),
// });




// import { Router } from 'express';
// import { validateRequest, wrapController } from '../../utils/express/wrappers';
// import { PermissionsController } from './controller';
// import { createOneRequestSchema, deleteOneRequestSchema, getAllByQueryRequestSchema, getAllRequestSchema, getOneByIdRequestSchema, updateOneRequestSchema } from './validations';

// export const PermissionsRouter = Router();

// // POST /api/permissions
// //pollId , ownedBy
// PermissionsRouter.post('/', validateRequest(createOneRequestSchema), wrapController(PermissionsController.createOne));

// //get all polls for user 
// // GET /api/permissions/polls/:userId 
// PermissionsRouter.get('/polls/:userId', validateRequest(getOneByIdRequestSchema), wrapController(PermissionsController.getOneById));

// //get all polls for user 
// // GET /api/permissions/polls/:userId/editor
// PermissionsRouter.get('/polls/:userId/editor', validateRequest(getOneByIdRequestSchema), wrapController(PermissionsController.getOneById));

// //get all polls for user 
// // GET /api/permissions/polls/:userId/owner
// PermissionsRouter.get('/polls/:userId/owner', validateRequest(getOneByIdRequestSchema), wrapController(PermissionsController.getOneById));

// //get all poll permissions by pollIds
// // GET /api/permissions/:pollId/users
// PermissionsRouter.get('/:pollId/users', validateRequest(getAllByQueryRequestSchema), wrapController(PermissionsController.getAllByQuery));

// //get userPoll permissions by pollId and userId
// // GET /api/permissions/:pollId/:userId/owner
// PermissionsRouter.get('/:pollId/:userId/owner', validateRequest(getAllRequestSchema), wrapController(PermissionsController.getAll));

// //get userPoll permissions by pollId and userId
// // GET /api/permissions/:pollId/:userId/editor
// PermissionsRouter.get('/:pollId/:userId/editor', validateRequest(getAllRequestSchema), wrapController(PermissionsController.getAll));

// //get userPoll permissions by pollId and userId
// // GET /api/permissions/:pollId/:userId
// PermissionsRouter.get('/:pollId/:userId', validateRequest(getAllRequestSchema), wrapController(PermissionsController.getAll));

// //get userPoll is owner by pollId and userId
// // GET /api/permissions/owner/:pollId/:userId
// PermissionsRouter.get('/owner/:pollId/:userId', validateRequest(getAllRequestSchema), wrapController(PermissionsController.getAll));

// // PUT /api/permissions/:pollId/ {filter: for / /editor}
// PermissionsRouter.put('/editor/all/:pollId:', validateRequest(updateOneRequestSchema), wrapController(PermissionsController.updateOne));

// // PUT /api/permissions/:pollId/ {filter: for all/restrect access/}
// PermissionsRouter.put('/editor/restricted/:pollId:', validateRequest(updateOneRequestSchema), wrapController(PermissionsController.updateOne));

// // PUT /api/permissions/:pollId/ {filter: for all/restrect access/editor}
// PermissionsRouter.put('/access/all/:pollId:', validateRequest(updateOneRequestSchema), wrapController(PermissionsController.updateOne));

// // PUT /api/permissions/:pollId/ {filter: for all/restrect access/editor}
// PermissionsRouter.put('/access/restricted/:pollId:', validateRequest(updateOneRequestSchema), wrapController(PermissionsController.updateOne));

// // PUT /api/permissions/:pollId/:userId {filter: add/rmove access/editor}
// PermissionsRouter.put('/:pollId/:userId', validateRequest(updateOneRequestSchema), wrapController(PermissionsController.updateOne));

// // PUT /api/permissions/owner/:pollId {filter: Accept / Reject / Remove}
// PermissionsRouter.put('/owner/:pollId', validateRequest(updateOneRequestSchema), wrapController(PermissionsController.updateOne));

// // PUT /api/permissions/owner/:pollId/:userId {filter: add/rmove access/editor}
// PermissionsRouter.put('/owner/:pollId/:userId', validateRequest(updateOneRequestSchema), wrapController(PermissionsController.updateOne));

// // PUT /api/permissions/publish/:pollId
// PermissionsRouter.put('/publish/:pollId', validateRequest(updateOneRequestSchema), wrapController(PermissionsController.updateOne));

// // GET /api/permissions/publish/:pollId
// PermissionsRouter.get('/publish/:pollId', validateRequest(updateOneRequestSchema), wrapController(PermissionsController.updateOne));

// // DELETE /api/permissions/:id
// PermissionsRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(PermissionsController.deleteOne));
