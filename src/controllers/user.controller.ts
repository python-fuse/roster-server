import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { User } from "@prisma/client";

class UserController {
  async getUsers(req: Request, res: Response): Promise<void> {
    const users = await userService.getAllUsers();

    res.status(200).json({
      users,
      message: "Users fetched successfully",
    });

    return;
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      user,
      message: "User fetched successfully",
    });
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name, email, password, role }: User = req.body;

    try {
      const newUser = await userService.createUser({
        name,
        email,
        password,
        role,
      });

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;

    await userService.deleteUser(userId);

    res.status(200).json({ message: "User deleted successfully" });
  }
}

export default new UserController();
