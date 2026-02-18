import { Server } from "socket.io";
import { verifyTokenUtil } from "../middleware/auth.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const decoded = verifyTokenUtil(token);
      socket.user = decoded; // attach user info to socket
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.role})`);

    // Role-based rooms
    if (socket.user.role === "admin") {
      socket.join("admins");       // Admin-only notifications
    } else if (socket.user.role === "buyer") {
      socket.join("buyers");        // Buyer users
    }

    // Personal room for private notifications
    socket.join(socket.user.id);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
