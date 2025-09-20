import { DutyRoster } from "@prisma/client";
import prisma from "../utils/prisma";

class DutyRosterService {
  async getAllRosters() {
    return await prisma.dutyRoster.findMany({
      include: { assignment: true, createdBy: true },
    });
  }

  async getRosterById(id: DutyRoster["id"]) {
    return await prisma.dutyRoster.findUnique({
      where: { id },
      include: { assignment: true, createdBy: true },
    });
  }

  async getRostersByUserId(userId: DutyRoster["addedById"]) {
    return await prisma.dutyRoster.findMany({
      where: { addedById: userId },
      include: { assignment: true, createdBy: true },
    });
  }

  async getRostersByDate(date: DutyRoster["date"]) {
    return await prisma.dutyRoster.findMany({
      where: { date },
      include: { assignment: true, createdBy: true },
    });
  }

  async createRoster(data: Omit<DutyRoster, "id" | "createdAt" | "updatedAt">) {
    return await prisma.dutyRoster.create({ data });
  }

  async updateRoster(id: DutyRoster["id"], data: Partial<DutyRoster>) {
    return await prisma.dutyRoster.update({
      where: { id },
      data: { ...data },
    });
  }

  async deleteRoster(id: DutyRoster["id"]) {
    return await prisma.dutyRoster.delete({ where: { id } });
  }
}

export default new DutyRosterService();
