/**
 * Document Service
 * Business logic for document management (non-realtime operations)
 */

import { PrismaClient, Document, DocumentVersion } from '@collab/database';
import { DocumentNotFoundError, ProjectNotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Create a new document
 */
export async function createDocument(
    title: string,
    projectId: string,
    userId: string
) {
    // Verify project exists
    const project = await prisma.project.findUnique({
        where: { id: projectId }
    });

    if (!project) {
        throw new ProjectNotFoundError();
    }

    const document = await prisma.document.create({
        data: {
            title,
            project_id: projectId,
            owner_id: userId
        }
    });

    return {
        id: document.id,
        title: document.title,
        owner_id: document.owner_id,
        created_at: document.created_at.toISOString()
    };
}

/**
 * List documents in a project
 */
export async function listDocuments(projectId: string, userId: string) {
    // Verify project exists
    const project = await prisma.project.findUnique({
        where: { id: projectId }
    });

    if (!project) {
        throw new ProjectNotFoundError();
    }

    const documents = await prisma.document.findMany({
        where: { project_id: projectId },
        orderBy: { updated_at: 'desc' }
    });

    return {
        documents: documents.map((doc: Document) => ({
            id: doc.id,
            title: doc.title,
            owner_id: doc.owner_id,
            created_at: doc.created_at.toISOString(),
            updated_at: doc.updated_at.toISOString()
        }))
    };
}

/**
 * Get a single document by ID
 */
export async function getDocument(documentId: string, userId: string) {
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });

    if (!document) {
        throw new DocumentNotFoundError();
    }

    // Update last_accessed_at
    await prisma.document.update({
        where: { id: documentId },
        data: { last_accessed_at: new Date() }
    });

    // Return document with content placeholder
    // Note: Actual Yjs content is handled by collab-service
    // For non-realtime, we return empty content object
    return {
        id: document.id,
        title: document.title,
        content: {}, // ProseMirror JSON placeholder
        updated_at: document.updated_at.toISOString()
    };
}

/**
 * Update a document (title only for non-realtime)
 */
export async function updateDocument(
    documentId: string,
    title: string,
    userId: string
) {
    // Verify document exists
    const existing = await prisma.document.findUnique({
        where: { id: documentId }
    });

    if (!existing) {
        throw new DocumentNotFoundError();
    }

    const document = await prisma.document.update({
        where: { id: documentId },
        data: { title }
    });

    return {
        id: document.id,
        title: document.title,
        updated_at: document.updated_at.toISOString()
    };
}

/**
 * Delete a document and its versions
 */
export async function deleteDocument(documentId: string, userId: string) {
    // Verify document exists
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });

    if (!document) {
        throw new DocumentNotFoundError();
    }

    // Delete versions first
    await prisma.documentVersion.deleteMany({
        where: { document_id: documentId }
    });

    // Delete document
    await prisma.document.delete({
        where: { id: documentId }
    });

    return { success: true };
}

/**
 * Create a new version snapshot
 */
export async function createVersion(
    documentId: string,
    name: string,
    userId: string
) {
    // Verify document exists
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });

    if (!document) {
        throw new DocumentNotFoundError();
    }

    // Create version with current document state
    const version = await prisma.documentVersion.create({
        data: {
            document_id: documentId,
            name: name || null,
            created_by: userId,
            snapshot_binary: document.yjs_binary_state // Copy current state
        }
    });

    return {
        id: version.id,
        name: version.name,
        created_at: version.created_at.toISOString()
    };
}

/**
 * List version history for a document
 */
export async function listVersions(documentId: string, userId: string) {
    // Verify document exists
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });

    if (!document) {
        throw new DocumentNotFoundError();
    }

    const versions = await prisma.documentVersion.findMany({
        where: { document_id: documentId },
        orderBy: { created_at: 'desc' }
    });

    return {
        versions: versions.map((version: DocumentVersion) => ({
            id: version.id,
            name: version.name,
            created_at: version.created_at.toISOString(),
            created_by: version.created_by
        }))
    };
}
