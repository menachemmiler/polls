import { Router } from "express";
import { validateRequest, wrapController } from "../../utils/express/wrappers";
import { createStatisticsRequestSchema, deleteQuestionRequestSchema, getByIdRequestSchema, getByQueryRequestSchema, updateStatisticsFormRequestSchema, updateStatisticsRequestSchema } from "./validations";
import { StatisticsController } from "./controller";

export const statisticsRouter = Router();

statisticsRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(StatisticsController.getByQuery));

statisticsRouter.get('/:pollId', validateRequest(getByIdRequestSchema), wrapController(StatisticsController.getBypollId));

statisticsRouter.post('/', validateRequest(createStatisticsRequestSchema), wrapController(StatisticsController.createOne));

statisticsRouter.put('/:pollId/statistics', validateRequest(updateStatisticsRequestSchema), wrapController(StatisticsController.updateOne));

statisticsRouter.patch('/:pollId/form', validateRequest(updateStatisticsFormRequestSchema), wrapController(StatisticsController.updateForm));

statisticsRouter.delete('/:pollId/questions/:questionId', validateRequest(deleteQuestionRequestSchema), wrapController(StatisticsController.deleteQuestion));

statisticsRouter.delete('/:pollId', validateRequest(getByIdRequestSchema), wrapController(StatisticsController.deleteOne));
