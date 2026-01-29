"use strict";
/**
 * Routes Index
 * Central router that mounts all sub-routers
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organization_routes_1 = __importDefault(require("./organization.routes"));
const project_routes_1 = __importDefault(require("./project.routes"));
const document_routes_1 = __importDefault(require("./document.routes"));
const router = (0, express_1.Router)();
// Mount sub-routers
router.use('/organizations', organization_routes_1.default);
router.use('/projects', project_routes_1.default);
router.use('/documents', document_routes_1.default);
exports.default = router;
