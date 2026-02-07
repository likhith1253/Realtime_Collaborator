"use strict";
/**
 * Project Controller
 * Request handlers for project endpoints
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
exports.createProject = createProject;
exports.listProjects = listProjects;
exports.getProjectById = getProjectById;
exports.deleteProject = deleteProject;
const projectService = __importStar(require("../services/project.service"));
const errors_1 = require("../utils/errors");
/**
 * POST /projects
 * Create a new project
 */
async function createProject(req, res) {
    const { name, description, organization_id } = req.body;
    const userId = req.user.userId;
    // Use provided organization_id or fall back to user's organizationId from token
    const targetOrgId = organization_id || req.user.organizationId;
    // Validate required fields
    if (!name || typeof name !== 'string') {
        throw new errors_1.ValidationError('Name is required');
    }
    if (!targetOrgId) {
        throw new errors_1.ValidationError('Organization ID is required');
    }
    const project = await projectService.createProject(name, description, targetOrgId, userId);
    res.status(201).json(project);
}
/**
 * GET /projects
 * List projects for the authenticated user
 */
async function listProjects(req, res) {
    const userId = req.user.userId;
    const result = await projectService.listProjects(userId);
    res.status(200).json(result);
}
/**
 * GET /projects/:id
 * Get a specific project
 */
async function getProjectById(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    if (!id) {
        throw new errors_1.ValidationError('Project ID is required');
    }
    if (!id || id === 'undefined') {
        throw new errors_1.ValidationError('Valid Project ID is required');
    }
    const result = await projectService.getProjectById(id, userId);
    res.status(200).json(result);
}
/**
 * DELETE /projects/:id
 * Delete a project
 */
async function deleteProject(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    if (!id) {
        throw new errors_1.ValidationError('Project ID is required');
    }
    const result = await projectService.deleteProject(id, userId);
    res.status(200).json(result);
}
