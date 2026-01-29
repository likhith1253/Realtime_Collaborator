import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { logger } from './logger';
import { healthCheck } from './health';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', healthCheck);

io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});

const startServer = async () => {
    try {
        server.listen(config.port, () => {
            logger.info(`Collab Service (Socket.io) running on port ${config.port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
