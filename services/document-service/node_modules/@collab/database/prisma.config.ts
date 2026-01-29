/**
 * Prisma Configuration for db-runner.ts
 * 
 * This file provides configuration that db-runner.ts uses to set the DATABASE_URL
 * environment variable before executing Prisma CLI commands.
 * 
 * FIX: This file was missing after Prisma troubleshooting.
 * The db-runner.ts expects this config to provide the database connection URL.
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the database package's .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const config = {
    // Path to the Prisma schema file (relative to database package root)
    schema: './prisma/schema.prisma',

    // Migration configuration
    migrations: {
        path: './prisma/migrations',
    },

    // Database connection configuration
    db: {
        adapter: 'postgresql' as const,
        // DATABASE_URL is loaded from .env file
        url: process.env.DATABASE_URL || '',
    },
};

export default config;
