import { Router } from 'express';
import { PollsRouter } from './polls/router';

export const appRouter = Router();

appRouter.use('/api/polls', PollsRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
