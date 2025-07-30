import { Router } from 'express';
import { statisticsRouter } from './statistics-service/router'; 

export const appRouter = Router();

appRouter.use('/api/statistics', statisticsRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
