import { io } from "../index";

import { Notification, NotificationType, Role } from "@prisma/client";

export class NotificationEmitter {
  static emitToUser(userId: string, notification: Notification) {
    io.to(`user:${userId}`).emit("notification", notification);
  }

  static emitToAll(notification: Notification) {
    io.emit("notification", notification);
  }

  static emitToRole(role: Role, notification: Notification) {
    io.to(`role:${role}`).emit("notification", notification);
  }
}
