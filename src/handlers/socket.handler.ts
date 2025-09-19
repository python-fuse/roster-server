import type { Server } from "socket.io";
import userService from "../services/user.service";
import { NotificationService } from "../services/notification.service";

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

    socket.on("markAsRead", async (notificationId) => {
      const updated = await NotificationService.updateNotification(
        notificationId,
        { read: true }
      );

      io.to(`user:${updated.userId}`).emit("readNotification", updated);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
