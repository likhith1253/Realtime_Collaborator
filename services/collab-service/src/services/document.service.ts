/**
 * Document Service for Collab Service
 * Handles Yjs state persistence to PostgreSQL
 * 
 * Uses the documents.yjs_binary_state field as the single source of truth
 * for collaborative document state.
 */

import { PrismaClient } from '@collab/database';
import { logger } from '../logger';

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Load Yjs binary state from database
 * @param docId - Document UUID
 * @returns Binary state as Uint8Array, or null if not found
 */
export async function loadYjsState(docId: string): Promise<Uint8Array | null> {
    try {
        const document = await prisma.document.findUnique({
            where: { id: docId },
            select: { yjs_binary_state: true }
        });

        if (!document) {
            return null;
        }

        // Convert Buffer to Uint8Array
        // Prisma returns Bytes as Buffer in Node.js
        const buffer = document.yjs_binary_state;
        if (!buffer || buffer.length === 0) {
            return null;
        }

        return new Uint8Array(buffer);
    } catch (error) {
        logger.error(`Failed to load Yjs state for document ${docId}:`, error);
        throw error;
    }
}

/**
 * Save Yjs binary state to database
 * Updates the document's yjs_binary_state and updated_at fields
 * @param docId - Document UUID
 * @param state - Encoded Yjs document state
 */
export async function saveYjsState(docId: string, state: Uint8Array): Promise<void> {
    try {
        await prisma.document.update({
            where: { id: docId },
            data: {
                yjs_binary_state: Buffer.from(state),
                updated_at: new Date()
            }
        });
        logger.debug(`Saved Yjs state for document ${docId} (${state.length} bytes)`);
    } catch (error) {
        logger.error(`Failed to save Yjs state for document ${docId}:`, error);
        throw error;
    }
}

/**
 * Check if a document exists in the database
 * @param docId - Document UUID
 * @returns True if document exists
 */
export async function documentExists(docId: string): Promise<boolean> {
    try {
        const count = await prisma.document.count({
            where: { id: docId }
        });
        return count > 0;
    } catch (error) {
        logger.error(`Failed to check document existence for ${docId}:`, error);
        throw error;
    }
}

/**
 * Gracefully disconnect Prisma client
 * Call during service shutdown
 */
export async function disconnect(): Promise<void> {
    await prisma.$disconnect();
}
