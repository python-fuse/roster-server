import authService from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import { Role, User } from "@prisma/client";

class AuthController {
  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    if (req.session.userId) {
      res.status(200).json({ user: req.session.user });
      return;
    } else {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const loginData = await authService.login({ email, password });
      req.session.userId = loginData.user.id;
      req.session.user = { ...loginData.user, password: "" };

      res.status(200).json(loginData);
      return;
    } catch (e) {
      next(e);
      return;
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
      return;
    } catch (e) {
      next(e);
      return;
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    if (req.session.userId) {
      req.session.destroy((err) => {
        if (err) {
          next(new Error("Failed to logout"));
          return;
        }

        res.status(200).json({ message: "Logout Successful" });
        return;
      });
      return;
    }

    res.status(400).json({ message: "Your not logged in, Please login!" });
    return;
  }
}

export default new AuthController();
