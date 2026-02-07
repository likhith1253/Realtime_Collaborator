
import { io } from "socket.io-client";
import jwt from "jsonwebtoken";

const SECRET = "dev-jwt-secret-change-in-production";
const URL = "http://localhost:3003";

console.log("Starting verification...");

async function verify() {
    console.log("\n1. Testing connection without token...");
    await new Promise<void>((resolve, reject) => {
        const socket = io(URL, {
            transports: ['websocket'],
            autoConnect: false,
            reconnection: false
        });

        socket.on("connect_error", (err: any) => {
            console.log("   ✔ Passed: Connection rejected as expected:", err.message);
            socket.close();
            resolve();
        });

        socket.on("connect", () => {
            console.error("   ❌ Failed: Connected without token!");
            socket.close();
            reject(new Error("Should have been rejected"));
        });

        socket.connect();
    });

    console.log("\n2. Testing connection with valid token...");
    const token = jwt.sign(
        { userId: "test-user-id", email: "test@example.com" },
        SECRET,
        { expiresIn: "1h" }
    );

    await new Promise<void>((resolve, reject) => {
        const socket = io(URL, {
            transports: ['websocket'],
            auth: { token },
            reconnection: false
        });

        socket.on("connect", () => {
            console.log("   ✔ Passed: Connected successfully");

            // Test join document
            console.log("\n3. Testing join-document (expecting error for non-existent doc)...");
            socket.emit("join-document", { docId: "00000000-0000-0000-0000-000000000000" });
        });

        // We might get sync-step-1 if I messed up the logic, or error if correct
        socket.on("sync-step-1", () => {
            console.log("   ❓ Received sync-step-1 (Unexpected for non-existent doc)");
            socket.close();
            // This technically means the room was created despite not executing.
            // But my code throws DocumentNotFoundError.
            // However, checking the code:
            /*
               try {
                   const room = await getOrCreateRoom(docId);
                   ...
               } catch (error) {
                   if (error instanceof DocumentNotFoundError) {
                       socket.emit('error', error.toJSON());
                   } ...
               }
            */
            // So we expect an 'error' event.
            reject(new Error("Should have received DocumentNotFoundError"));
        });

        socket.on("error", (err: any) => {
            if (err.error?.code === 'DOCUMENT_NOT_FOUND') {
                console.log("   ✔ Passed: Received expected DocumentNotFoundError");
                socket.close();
                resolve();
            } else {
                console.error("   ❌ Failed: Unexpected error:", err);
                socket.close();
                reject(err);
            }
        });

        socket.on("connect_error", (err: any) => {
            console.error("   ❌ Failed: Connection error:", err.message);
            reject(err);
        });
    });
}

verify().then(() => {
    console.log("\n✨ Verification Complete!");
    process.exit(0);
}).catch((err) => {
    console.error("\n💀 Verification Failed:", err);
    process.exit(1);
});
