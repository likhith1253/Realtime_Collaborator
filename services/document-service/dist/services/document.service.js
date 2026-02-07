"use strict";
/**
 * Document Service
 * Business logic for document management (non-realtime operations)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocument = createDocument;
exports.listDocuments = listDocuments;
exports.getDocument = getDocument;
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;
exports.createVersion = createVersion;
exports.listVersions = listVersions;
const database_1 = require("@collab/database");
const errors_1 = require("../utils/errors");
const prisma = new database_1.PrismaClient();
/**
 * Create a new document
 */
async function createDocument(title, projectId, userId) {
    // Verify project exists
    const project = await prisma.project.findUnique({
        where: { id: projectId }
    });
    if (!project) {
        throw new errors_1.ProjectNotFoundError();
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
async function listDocuments(projectId, userId) {
    // Verify project exists
    const project = await prisma.project.findUnique({
        where: { id: projectId }
    });
    if (!project) {
        throw new errors_1.ProjectNotFoundError();
    }
    const documents = await prisma.document.findMany({
        where: { project_id: projectId },
        orderBy: { updated_at: 'desc' }
    });
    return {
        documents: documents.map((doc) => ({
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
async function getDocument(documentId, userId) {
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });
    if (!document) {
        throw new errors_1.DocumentNotFoundError();
    }
    // Update last_accessed_at
    await prisma.document.update({
        where: { id: documentId },
        data: { last_accessed_at: new Date() }
    });
    return {
        id: document.id,
        title: document.title,
        content: document.yjs_binary_state?.toString('utf8') || '',
        projectId: document.project_id,
        updatedAt: document.updated_at.toISOString()
    };
}
/**
 * Update a document (title and/or content)
 */
async function updateDocument(documentId, userId, updates) {
    // Verify document exists
    const existing = await prisma.document.findUnique({
        where: { id: documentId }
    });
    if (!existing) {
        throw new errors_1.DocumentNotFoundError();
    }
    const data = {};
    if (updates.title !== undefined) {
        data.title = updates.title;
    }
    if (updates.content !== undefined) {
        // Store content as buffer for non-realtime operations
        data.yjs_binary_state = Buffer.from(JSON.stringify(updates.content), 'utf8');
    }
    const document = await prisma.document.update({
        where: { id: documentId },
        data
    });
    return {
        id: document.id,
        title: document.title,
        content: document.yjs_binary_state?.toString('utf8') || '',
        projectId: document.project_id,
        updatedAt: document.updated_at.toISOString()
    };
}
/**
 * Delete a document and its versions
 */
async function deleteDocument(documentId, userId) {
    // Verify document exists
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });
    if (!document) {
        throw new errors_1.DocumentNotFoundError();
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
async function createVersion(documentId, name, userId) {
    // Verify document exists
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });
    if (!document) {
        throw new errors_1.DocumentNotFoundError();
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
async function listVersions(documentId, userId) {
    // Verify document exists
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });
    if (!document) {
        throw new errors_1.DocumentNotFoundError();
    }
    const versions = await prisma.documentVersion.findMany({
        where: { document_id: documentId },
        orderBy: { created_at: 'desc' }
    });
    return {
        versions: versions.map((version) => ({
            id: version.id,
            name: version.name,
            created_at: version.created_at.toISOString(),
            created_by: version.created_by
        }))
    };
}
