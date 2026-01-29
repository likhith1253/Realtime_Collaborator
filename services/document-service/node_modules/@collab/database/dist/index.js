"use strict";
/**
 * Database Package Entry Point
 * Re-exports Prisma Client for use by services
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClient = void 0;
exports.getPrismaClient = getPrismaClient;
exports.disconnectPrisma = disconnectPrisma;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return client_1.PrismaClient; } });
// Export all generated types
__exportStar(require("@prisma/client"), exports);
// Singleton instance for development/testing
let prisma;
/**
 * Get a singleton PrismaClient instance
 * Useful for avoiding multiple client instances in development
 */
function getPrismaClient() {
    if (!prisma) {
        prisma = new client_1.PrismaClient();
    }
    return prisma;
}
/**
 * Disconnect the singleton PrismaClient
 * Call this during graceful shutdown
 */
async function disconnectPrisma() {
    if (prisma) {
        await prisma.$disconnect();
        prisma = undefined;
    }
}
//# sourceMappingURL=index.js.map