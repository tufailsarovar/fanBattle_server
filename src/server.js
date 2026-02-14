import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { initSocket } from "./sockets/socketHandler.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Connect Redis
    await connectRedis();

    // Create HTTP Server
    const server = http.createServer(app);

    // Initialize Socket.io
    initSocket(server);

    // Start Server
    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });

  } catch (error) {
    console.error("❌ Server Startup Failed:", error.message);
    process.exit(1);
  }
};

startServer();
