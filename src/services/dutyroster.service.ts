import { DutyRoster } from "@prisma/client";
import prisma from "../utils/prisma";

class DutyRosterService {
  async getAllRosters() {
    return await prisma.dutyRoster.findMany();
  }

  async getRosterById(id: DutyRoster["id"]) {
    return await prisma.dutyRoster.findUnique({ where: { id } });
  }

  async createRoster(data: Omit<DutyRoster, "id" | "createdAt" | "updatedAt">) {
    return await prisma.dutyRoster.create({ data });
  }

  async updateRoster(id: DutyRoster["id"], data: Partial<DutyRoster>) {
    return await prisma.dutyRoster.update({
      where: { id },
      data,
    });
  }

  async deleteRoster(id: DutyRoster["id"]) {
    return await prisma.dutyRoster.delete({ where: { id } });
  }
}

export default new DutyRosterService();
