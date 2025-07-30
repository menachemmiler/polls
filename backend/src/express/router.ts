import { Router } from 'express';
import passport from 'passport';
import { config } from '../config';
import { authenticationRouter } from './authentication/router';
import { permissionsRouter } from './permissions/router';
import { surveyRouter } from './polls/router';
import { questionsRouter } from './questions/router';
import { responseRouter } from './response/router';
import { statisticsRouter } from './statistics/router';
import { usersRouter } from './users/router';
import { kartoffelRouter } from './kartoffel/ruoter';
import { minioRouter } from './minio/router';

export const appRouter = Router();
appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => res.status(200).send('alive'));
appRouter.use(config.authentication.baseRoute, authenticationRouter);
appRouter.use(passport.authenticate('jwt', { session: false }));
appRouter.use(config.permissions.baseRoute, permissionsRouter);

appRouter.use(config.questions.baseRoute, questionsRouter);

appRouter.use(config.statistics.baseRoute, statisticsRouter);

appRouter.use(config.polls.baseRoute, surveyRouter);

appRouter.use(config.users.baseRoute, usersRouter);

appRouter.use(config.response.baseRoute, responseRouter);

appRouter.use(config.kartoffel.baseRoute, kartoffelRouter);

appRouter.use('/api/upload', minioRouter);


appRouter.use('*', (_req, res) => res.status(404).send('Invalid Route'));
