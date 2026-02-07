"use strict";
/**
 * Project Routes
 * Wire project endpoints with auth middleware
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
const express_1 = require("express");
const error_middleware_1 = require("../middleware/error.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const projectController = __importStar(require("../controllers/project.controller"));
const documentController = __importStar(require("../controllers/document.controller"));
const teamController = __importStar(require("../controllers/team.controller"));
const messageController = __importStar(require("../controllers/message.controller"));
const router = (0, express_1.Router)();
// POST /projects - Create project (requires project:write scope)
router.post('/', (0, auth_middleware_1.auth)('project:write'), (0, error_middleware_1.asyncHandler)(projectController.createProject));
// GET /projects - List projects (requires project:read scope)
router.get('/', (0, auth_middleware_1.auth)('project:read'), (0, error_middleware_1.asyncHandler)(projectController.listProjects));
// GET /projects/:id - Get project (requires project:read scope)
router.get('/:id', (0, auth_middleware_1.auth)('project:read'), (0, error_middleware_1.asyncHandler)(projectController.getProjectById));
// DELETE /projects/:id - Delete project (requires project:delete scope)
router.delete('/:id', (0, auth_middleware_1.auth)('project:delete'), (0, error_middleware_1.asyncHandler)(projectController.deleteProject));
// POST /projects/:projectId/documents - Create document in project
router.post('/:projectId/documents', (0, auth_middleware_1.auth)('doc:write'), (0, error_middleware_1.asyncHandler)(documentController.createProjectDocument));
// GET /projects/:projectId/documents - List documents in project
router.get('/:projectId/documents', (0, auth_middleware_1.auth)('doc:read'), (0, error_middleware_1.asyncHandler)(documentController.listProjectDocuments));
// POST /projects/:projectId/team - Add team member (requires project:write scope)
router.post('/:projectId/team', (0, auth_middleware_1.auth)('project:write'), (0, error_middleware_1.asyncHandler)(teamController.addTeamMember));
// GET /projects/:projectId/team - List team members (requires project:read scope)
router.get('/:projectId/team', (0, auth_middleware_1.auth)('project:read'), (0, error_middleware_1.asyncHandler)(teamController.getProjectTeam));
// DELETE /projects/:projectId/team/:userId - Remove team member (requires project:write scope)
// Note: 'project:delete' might be too strong, usually 'project:write' covers membership management,
// but owner check is enforced in service.
router.delete('/:projectId/team/:userId', (0, auth_middleware_1.auth)('project:write'), (0, error_middleware_1.asyncHandler)(teamController.removeTeamMember));
// ============================================================================
// Message Routes (Chat)
// ============================================================================
// GET /projects/:projectId/messages - List messages (requires project:read scope)
router.get('/:projectId/messages', (0, auth_middleware_1.auth)('project:read'), (0, error_middleware_1.asyncHandler)(messageController.getProjectMessages));
// POST /projects/:projectId/messages - Create message (requires project:write scope)
router.post('/:projectId/messages', (0, auth_middleware_1.auth)('project:write'), (0, error_middleware_1.asyncHandler)(messageController.createMessage));
exports.default = router;
