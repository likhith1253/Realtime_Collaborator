/**
 * Simplified Collaboration Service for Canvas Testing
 * Basic WebSocket server without authentication or database
 */

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// ============================================================================
// Socket.io Server Setup
// ============================================================================

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// ============================================================================
// Middleware
// ============================================================================

app.use(cors());
app.use(express.json());

// ============================================================================
// Routes
// ============================================================================

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'collab-service-simple' });
});

// ============================================================================
// Socket.io Connection Handler
// ============================================================================

// Simple room management
const socketRooms: Map<string, string> = new Map();

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join document room
    socket.on('join-document', (payload: { documentId: string }) => {
        const { documentId } = payload;
        
        if (!documentId) {
            socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'documentId is required' });
            return;
        }

        // Leave any previous room
        const previousRoom = socketRooms.get(socket.id);
        if (previousRoom) {
            socket.leave(previousRoom);
        }

        // Join new room
        const roomName = `document:${documentId}`;
        socket.join(roomName);
        socketRooms.set(socket.id, roomName);

        console.log(`Client ${socket.id} joined document ${documentId}`);
        socket.emit('joined-document', { documentId, roomName });
    });

    // Document content update
    socket.on('document-update', (payload: { documentId: string; content: string }) => {
        const { documentId, content } = payload;
        
        if (!documentId) {
            socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'documentId is required' });
            return;
        }

        const roomName = `document:${documentId}`;
        const currentRoom = socketRooms.get(socket.id);

        if (currentRoom !== roomName) {
            socket.emit('error', { code: 'NOT_IN_ROOM', message: 'Join the document first' });
            return;
        }

        console.log(`Client ${socket.id} sent update to document ${documentId}`);
        socket.to(roomName).emit('document-update', { content });
    });

    // Canvas update
    socket.on('canvas-update', (payload: { documentId: string; canvasData: string }) => {
        const { documentId, canvasData } = payload;
        
        if (!documentId) {
            socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'documentId is required' });
            return;
        }

        const roomName = `document:${documentId}`;
        const currentRoom = socketRooms.get(socket.id);

        if (currentRoom !== roomName) {
            socket.emit('error', { code: 'NOT_IN_ROOM', message: 'Join the document first' });
            return;
        }

        console.log(`Client ${socket.id} sent canvas update to document ${documentId}`);
        socket.to(roomName).emit('canvas-update', { canvasData });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const roomName = socketRooms.get(socket.id);
        if (roomName) {
            console.log(`Client ${socket.id} left room ${roomName}`);
        }
        socketRooms.delete(socket.id);
        console.log(`Client ${socket.id} disconnected`);
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error(`Socket error (${socket.id}):`, error);
    });
});

// ============================================================================
// Server Startup
// ============================================================================

const startServer = async () => {
    try {
        server.listen(3003, () => {
            console.log('Simple Collab Service running on port 3003');
            console.log('WebSocket path: /socket.io');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
