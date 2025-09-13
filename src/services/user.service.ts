import { User } from "@prisma/client";
import prisma from "../utils/prisma";

class UserService {
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">) {
    return prisma.user.create({ data: user });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UserService();
