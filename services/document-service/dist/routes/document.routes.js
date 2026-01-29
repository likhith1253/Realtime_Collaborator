"use strict";
/**
 * Document Routes
 * Wire document endpoints with auth middleware
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
const documentController = __importStar(require("../controllers/document.controller"));
const router = (0, express_1.Router)();
// POST /documents - Create document (requires doc:write scope)
router.post('/', (0, auth_middleware_1.auth)('doc:write'), (0, error_middleware_1.asyncHandler)(documentController.createDocument));
// GET /documents - List documents (requires doc:read scope)
router.get('/', (0, auth_middleware_1.auth)('doc:read'), (0, error_middleware_1.asyncHandler)(documentController.listDocuments));
// GET /documents/:id - Get single document (requires doc:read scope)
router.get('/:id', (0, auth_middleware_1.auth)('doc:read'), (0, error_middleware_1.asyncHandler)(documentController.getDocument));
// PATCH /documents/:id - Update document (requires doc:write scope)
router.patch('/:id', (0, auth_middleware_1.auth)('doc:write'), (0, error_middleware_1.asyncHandler)(documentController.updateDocument));
// DELETE /documents/:id - Delete document (requires doc:delete scope)
router.delete('/:id', (0, auth_middleware_1.auth)('doc:delete'), (0, error_middleware_1.asyncHandler)(documentController.deleteDocument));
// POST /documents/:id/versions - Create version (requires doc:write scope)
router.post('/:id/versions', (0, auth_middleware_1.auth)('doc:write'), (0, error_middleware_1.asyncHandler)(documentController.createVersion));
// GET /documents/:id/versions - List versions (requires doc:read scope)
router.get('/:id/versions', (0, auth_middleware_1.auth)('doc:read'), (0, error_middleware_1.asyncHandler)(documentController.listVersions));
exports.default = router;
