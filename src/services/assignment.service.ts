import prisma from "../utils/prisma";
import { Assignment } from "@prisma/client";

class AssignmentService {
  async getAllAssignments(): Promise<Assignment[]> {
    return prisma.assignment.findMany({
      include: { dutyRoster: true, assignedBy: true, user: true },
    });
  }

  async getAssignmentById(id: string): Promise<Assignment | null> {
    return prisma.assignment.findUnique({
      where: { id },
      include: { dutyRoster: true, assignedBy: true, user: true },
    });
  }

  async getAssignmentsByUserId(userId: string): Promise<Assignment[]> {
    return prisma.assignment.findMany({
      where: { userId },
      include: {
        dutyRoster: true,
        assignedBy: {
          select: { name: true, id: true, email: true, role: true },
        },
      },
    });
  }

  async getAssignmentsByAssignerId(
    assignById: Assignment["assignedById"]
  ): Promise<Assignment[]> {
    return prisma.assignment.findMany({
      where: { assignedById: assignById },
      include: {
        dutyRoster: true,
        assignedBy: {
          select: {
            name: true,
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async createAssignment(
    data: Omit<Assignment, "id" | "createdAt" | "updatedAt">
  ): Promise<Assignment> {
    return prisma.assignment.create({ data });
  }

  async updateAssignment(
    id: Assignment["id"],
    data: Partial<Assignment>
  ): Promise<Assignment> {
    return prisma.assignment.update({
      where: { id },
      data: { ...data },
    });
  }

  async deleteAssignment(id: Assignment["id"]): Promise<Assignment> {
    return prisma.assignment.delete({ where: { id } });
  }
}
export default new AssignmentService();
