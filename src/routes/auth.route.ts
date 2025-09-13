import authController from "../controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

export default authRouter;
