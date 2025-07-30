import { once } from 'events';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import { appRouter } from './router';
import { initPassport } from '../utils/express/passport';
import { config } from '../config';
import { loggerMiddleware } from '../utils/logger/middleware';
import { errorMiddleware } from '../utils/express/error';

export class Server {
    private app: express.Application;
    private http?: http.Server;
    constructor(private port: number) {
        this.app = Server.createExpressApp();
    }
    static createExpressApp() {
        const app = express();
        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(
            cors({
                origin: ['http://localhost:5173', 'http://localhost:8000'],
                credentials: true,
            }),
        );
        app.use(loggerMiddleware);
        app.use(cookieParser());
        app.use(
            session({
                secret: config.authentication.sessionSecret,
                resave: false,
                saveUninitialized: false,
            }),
        );
        app.use(passport.initialize());
        app.use(passport.session());
        initPassport();
        app.use(appRouter);
        app.use(errorMiddleware);
        return app;
    }

    async start() {
        this.http = this.app.listen(this.port);
        await once(this.http, 'listening');
    }
}
