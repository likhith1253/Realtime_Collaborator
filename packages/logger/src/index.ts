import winston from 'winston';

export const createLogger = (serviceName: string) => {
    const formats = [
        winston.format.timestamp(),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] })
    ];

    if (process.env.NODE_ENV === 'production') {
        formats.push(winston.format.json());
    } else {
        formats.push(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, metadata }) => {
                const meta = metadata as any;
                const metaStr = (meta && Object.keys(meta).length) ? ` ${JSON.stringify(meta)}` : '';
                return `${timestamp} [${serviceName}] ${level}: ${message}${metaStr}`;
            })
        );
    }

    const loggerInstance = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        defaultMeta: { service: serviceName },
        format: winston.format.combine(...formats),
        transports: [
            new winston.transports.Console({
                stderrLevels: ['error', 'warn'],
            }),
        ],
        exitOnError: false,
    });

    // Helper to process legacy meta arguments into an object
    const processMeta = (meta: any[]) => {
        if (meta.length === 0) return undefined;
        const result: any = {};
        meta.forEach((m, index) => {
            if (m && typeof m === 'object' && !Array.isArray(m)) {
                Object.assign(result, m);
            } else {
                result[`arg${index}`] = m;
            }
        });
        return result;
    };

    return {
        info: (message: string, ...meta: any[]) => {
            const extra = processMeta(meta);
            loggerInstance.info(message, extra);
        },
        warn: (message: string, ...meta: any[]) => {
            const extra = processMeta(meta);
            loggerInstance.warn(message, extra);
        },
        error: (message: string, ...meta: any[]) => {
            const extra = processMeta(meta);
            loggerInstance.error(message, extra);
        },
        debug: (message: string, ...meta: any[]) => {
            const extra = processMeta(meta);
            loggerInstance.debug(message, extra);
        },
        winston: loggerInstance
    };
};
