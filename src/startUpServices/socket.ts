import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

let io: SocketServer | null = null;

export const initializeSocket = (server: HttpServer): SocketServer => {
  if (io) {
    console.log("Socket.io is already initialized.");
    throw new Error("Socket.io is already initialized.");
  }

  try {
    io = new SocketServer(server, {
      cors: { origin: "*", methods: ["GET"] }
    });

    console.log("Socket.io initialized successfully");

    return io;
  } catch (error) {
    console.error("Socket initialization failed:", error);
    process.exit(1);
  }
};

export const getSocketServer = (): SocketServer => {
  if (!io) {
    throw new Error("Socket.io has not been initialized yet.");
  }
  return io;
};
