import { Response, Request, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";

export class NotificationController {
  static async getAllNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const notifications = await NotificationService.getAllNotifications();
      res.status(200).json({
        message: "Notifications retrieved successfully",
        notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const notification = await NotificationService.createNotification(
        req.body
      );

      //   TODO: Emit real-time notification via WebSocket or other means here
      res.status(201).json({ message: "", notification });
    } catch (error) {
      next(error);
    }
  }

  static async getUserNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const notifications = await NotificationService.getNotificationsByUserId(
        req.params.userId
      );
      res.status(200).json({
        message: "User notifications retrieved successfully",
        notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await NotificationService.updateNotification(
        req.params.id,
        { read: true }
      );
      res.status(200).json({
        message: "Notification marked as read successfully",
        notification,
      });
    } catch (error) {
      next(error);
    }
  }
}
