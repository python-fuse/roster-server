import { NotificationEmitter } from "../emitters/notification.emitter";
import prisma from "../utils/prisma";
import { Notification, Role } from "@prisma/client";

export class NotificationService {
  static async createNotification(
    data: Omit<Notification, "id" | "createdAt" | "updatedAt">
  ) {
    const notification = await prisma.notification.create({
      data,
      include: { user: true },
    });

    NotificationEmitter.emitToUser(notification.userId, notification);

    return notification;
  }

  static async createAndEmitToRole(
    role: Role,
    data: Omit<Notification, "id" | "role">
  ) {
    const users = await prisma.user.findMany({ where: { role } });

    const notifications = await Promise.all(
      users.map((user) => {
        return this.createNotification({ ...data, userId: user.id });
      })
    );

    notifications.forEach((notification) => {
      NotificationEmitter.emitToUser(notification.userId, notification);
    });
    return notifications;
  }

  static async getNotificationById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  }

  static async getAllNotifications() {
    return prisma.notification.findMany();
  }

  static async getNotificationsByUserId(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateNotification(id: string, data: Partial<Notification>) {
    return prisma.notification.update({ where: { id }, data });
  }

  static async deleteNotification(id: string) {
    return prisma.notification.delete({ where: { id } });
  }
}
