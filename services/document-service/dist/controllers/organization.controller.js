"use strict";
/**
 * Organization Controller
 * Request handlers for organization endpoints
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
exports.createOrganization = createOrganization;
exports.listOrganizations = listOrganizations;
const organizationService = __importStar(require("../services/organization.service"));
const errors_1 = require("../utils/errors");
/**
 * POST /organizations
 * Create a new organization
 */
async function createOrganization(req, res) {
    const { name, slug } = req.body;
    const userId = req.user.userId;
    // Validate required fields
    if (!name || typeof name !== 'string') {
        throw new errors_1.ValidationError('Name is required');
    }
    if (!slug || typeof slug !== 'string') {
        throw new errors_1.ValidationError('Slug is required');
    }
    // Validate slug format (lowercase, alphanumeric, hyphens)
    if (!/^[a-z0-9-]+$/.test(slug)) {
        throw new errors_1.ValidationError('Slug must be lowercase alphanumeric with hyphens only');
    }
    const organization = await organizationService.createOrganization(name, slug, userId);
    res.status(201).json(organization);
}
/**
 * GET /organizations
 * List user's organizations
 */
async function listOrganizations(req, res) {
    const userId = req.user.userId;
    const result = await organizationService.listOrganizations(userId);
    res.status(200).json(result);
}
