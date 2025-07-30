import { Router } from 'express';
import { PermissionsRouter } from './permissions/router';

export const appRouter = Router();

appRouter.use('/api/permissions', PermissionsRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
