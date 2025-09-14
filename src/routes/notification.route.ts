import { Router } from "express";

import { NotificationController } from "../controllers/notification.controller";

const router = Router();

router.post("/", NotificationController.createNotification);
router.get("/", NotificationController.getAllNotifications);
router.get("/user/:userId", NotificationController.getUserNotifications);

export default router;
