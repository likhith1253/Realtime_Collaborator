export interface PrismaConfig {
    schema: string;
    migrations: {
        path: string;
    };
    db: {
        adapter: "postgresql" | "mysql" | "sqlite";
        url: string;
    };
}

export function defineConfig(config: PrismaConfig): PrismaConfig {
    return config;
}
