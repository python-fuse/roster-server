import authService from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import { Role, User } from "@prisma/client";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const loginData = await authService.login({ email, password });
      res.status(200).json(loginData);
      req.session.user = loginData.user;

      req.session.userId = loginData.user.id;
    } catch (e) {
      next(e);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password, role }: User = req.body;

    try {
      const newUser = await authService.register({
        name,
        email,
        password,
        role: role || Role.STAFF,
      });

      res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
