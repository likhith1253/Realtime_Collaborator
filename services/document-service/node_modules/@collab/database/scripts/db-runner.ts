import { execSync } from "child_process";
import path from "path";
import config from "../prisma.config";

// Set environment variable from config
process.env.DATABASE_URL = config.db.url;

// Construct the Prisma command
const args = process.argv.slice(2);
const command = `npx prisma ${args.join(" ")}`;

console.log(`Running: ${command}`);
console.log(`With DATABASE_URL: ${process.env.DATABASE_URL}`); // Be careful logging secrets in prod!

try {
    execSync(command, { stdio: "inherit", cwd: path.join(__dirname, "..") });
} catch (error) {
    process.exit(1);
}
