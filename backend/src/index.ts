import { config } from './config/index';
import { Server } from './express/server';
import { logger } from './utils/logger/index';

const { service } = config;
const main = async () => {
    const server = new Server(service.port);
    await server.start();
    logger.info(`Server started on port: ${service.port}`);
};
main().catch(logger.error);
