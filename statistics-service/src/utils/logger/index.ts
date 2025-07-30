import * as winston from 'winston';

export const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`),
    ),
});
