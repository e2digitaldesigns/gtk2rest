import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

let io: SocketServer | null = null;

export const initializeSocket = (server: HttpServer) => {
  if (io) {
    console.error("Socket.io is already initialized.");
    return;
  }

  try {
    io = new SocketServer(server, {
      cors: { origin: "*", methods: ["GET"] }
    });

    console.log("Socket.io initialized successfully");
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
