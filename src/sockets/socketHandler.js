// server/src/sockets/socketHandler.js

import { Server } from "socket.io";

let ioInstance = null;

/**
 * @desc Initialize Socket.io
 */
export const initSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "https://fan-battle.vercel.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {

    socket.on("joinRoom", (room) => {
      socket.join(room);
    });

    socket.on("disconnect", () => {
    });
  });

  return ioInstance;
};

/**
 * @desc Get IO instance
 */
export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }
  return ioInstance;
};

/**
 * @desc Emit like update
 */
export const emitLikeUpdate = (data) => {
  if (ioInstance) {
    ioInstance.emit("likeUpdated", data);
  }
};

/**
 * @desc Emit subscriber update
 */
export const emitSubscriberUpdate = (data) => {
  if (ioInstance) {
    ioInstance.emit("subscriberUpdated", data);
  }
};
