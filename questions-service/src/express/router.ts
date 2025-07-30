import { Router } from 'express';
import { questionsRouter } from './questions/router.js';

export const appRouter = Router();

appRouter.use('/api/questions', questionsRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
