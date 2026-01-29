"use strict";
/**
 * Document Controller
 * Request handlers for document and version endpoints
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocument = createDocument;
exports.listDocuments = listDocuments;
exports.getDocument = getDocument;
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;
exports.createVersion = createVersion;
exports.listVersions = listVersions;
const documentService = __importStar(require("../services/document.service"));
const errors_1 = require("../utils/errors");
/**
 * POST /documents
 * Create a new document
 */
async function createDocument(req, res) {
    const { title, project_id } = req.body;
    const userId = req.user.userId;
    // Validate required fields
    if (!title || typeof title !== 'string') {
        throw new errors_1.ValidationError('Title is required');
    }
    if (!project_id || typeof project_id !== 'string') {
        throw new errors_1.ValidationError('Project ID is required');
    }
    const document = await documentService.createDocument(title, project_id, userId);
    res.status(201).json(document);
}
/**
 * GET /documents
 * List documents in a project
 */
async function listDocuments(req, res) {
    const { project_id } = req.query;
    const userId = req.user.userId;
    // Validate required query parameter
    if (!project_id || typeof project_id !== 'string') {
        throw new errors_1.ValidationError('project_id query parameter is required');
    }
    const result = await documentService.listDocuments(project_id, userId);
    res.status(200).json(result);
}
/**
 * GET /documents/:id
 * Get a single document
 */
async function getDocument(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    if (!id) {
        throw new errors_1.ValidationError('Document ID is required');
    }
    const document = await documentService.getDocument(id, userId);
    res.status(200).json(document);
}
/**
 * PATCH /documents/:id
 * Update a document
 */
async function updateDocument(req, res) {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;
    if (!id) {
        throw new errors_1.ValidationError('Document ID is required');
    }
    if (!title || typeof title !== 'string') {
        throw new errors_1.ValidationError('Title is required');
    }
    const document = await documentService.updateDocument(id, title, userId);
    res.status(200).json(document);
}
/**
 * DELETE /documents/:id
 * Delete a document
 */
async function deleteDocument(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    if (!id) {
        throw new errors_1.ValidationError('Document ID is required');
    }
    const result = await documentService.deleteDocument(id, userId);
    res.status(200).json(result);
}
/**
 * POST /documents/:id/versions
 * Create a version snapshot
 */
async function createVersion(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.userId;
    if (!id) {
        throw new errors_1.ValidationError('Document ID is required');
    }
    const version = await documentService.createVersion(id, name || '', userId);
    res.status(201).json(version);
}
/**
 * GET /documents/:id/versions
 * List version history
 */
async function listVersions(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    if (!id) {
        throw new errors_1.ValidationError('Document ID is required');
    }
    const result = await documentService.listVersions(id, userId);
    res.status(200).json(result);
}
