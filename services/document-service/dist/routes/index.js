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
const slide_routes_1 = __importDefault(require("./slide.routes"));
const presentation_routes_1 = __importDefault(require("./presentation.routes"));
const canvas_routes_1 = __importDefault(require("./canvas.routes"));
const router = (0, express_1.Router)();
// Mount sub-routers
router.use('/', presentation_routes_1.default);
router.use('/', slide_routes_1.default); // Mount slide routes first to handle specific /projects paths
router.use('/', canvas_routes_1.default); // Mount canvas routes
router.use('/organizations', organization_routes_1.default);
router.use('/projects', project_routes_1.default);
router.use('/documents', document_routes_1.default);
exports.default = router;
