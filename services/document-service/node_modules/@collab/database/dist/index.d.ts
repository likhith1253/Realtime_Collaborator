/**
 * Database Package Entry Point
 * Re-exports Prisma Client for use by services
 */
import { PrismaClient } from '@prisma/client';
export { PrismaClient };
export * from '@prisma/client';
/**
 * Get a singleton PrismaClient instance
 * Useful for avoiding multiple client instances in development
 */
export declare function getPrismaClient(): PrismaClient;
/**
 * Disconnect the singleton PrismaClient
 * Call this during graceful shutdown
 */
export declare function disconnectPrisma(): Promise<void>;
//# sourceMappingURL=index.d.ts.map