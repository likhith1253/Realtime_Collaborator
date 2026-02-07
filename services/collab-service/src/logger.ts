import winston from 'winston';

const level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

export const logger = winston.createLogger({
    level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'collab-service' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
    ],
});
