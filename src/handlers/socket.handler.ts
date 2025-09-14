import type { Server } from "socket.io";
import userService from "../services/user.service";

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // Add user to their personal room based on userId
    socket.on("join", async (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their personal room`);

      const user = await userService.getUserById(userId);
      if (user) {
        socket.join(`role:${user.role}`);
      }

      console.log(`User ${userId} joined their personal room and role room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
