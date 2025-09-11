import { User } from "@prisma/client";
import userService from "./user.service";
import JWTService from "./jwt.service";

import { hash, compare } from "bcrypt";
import { ApiError } from "../middleware/errorHandler";

class AuthService {
  private saltRounds = 10;
  async register(userData: Omit<User, "id" | "createdAt" | "updatedAt">) {
    const { email } = userData;

    const dbUser = await userService.getUserByEmail(email);

    if (dbUser) {
      throw new ApiError(400, "User already exist!");
    }

    const hashedPassword = await hash(userData.password, this.saltRounds);

    const newUser = await userService.createUser({
      ...userData,
      password: hashedPassword,
    });

    return { user: newUser, message: "Registration successful" };
  }

  async login(userData: Pick<User, "email" | "password">) {
    const { email, password } = userData;

    const dbUser = await userService.getUserByEmail(email);

    if (!dbUser) {
      throw new ApiError(404, "User not found, please register!");
    }

    if (await compare(password, dbUser.password)) {
      return { user: dbUser, message: "Login successful" };
    }

    throw new ApiError(400, "Incorrect password");
  }
}

export default new AuthService();
