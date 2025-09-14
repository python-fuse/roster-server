import { Request, Response, NextFunction } from "express";
import { Assignment, DutyRoster, Shift } from "@prisma/client";
import assignmentService from "../services/assignment.service";

class AssignmentController {
  async getAllAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const assignments: Assignment[] =
        await assignmentService.getAllAssignments();
      res
        .status(200)
        .json({ message: "Assignments retrieved successfully", assignments });
    } catch (error) {
      next(error);
    }
  }

  async getAssignmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assignment: Assignment | null =
        await assignmentService.getAssignmentById(id);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.status(200).json(assignment);
    } catch (error) {
      next(error);
    }
  }

  async getUserAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const assignments: Assignment[] =
        await assignmentService.getAssignmentsByUserId(userId);
      res.status(200).json({
        message: "User assignments retrieved successfully",
        assignments,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAssignerAssignments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { assignedById } = req.params;
      const assignments: Assignment[] =
        await assignmentService.getAssignmentsByAssignerId(assignedById);
      res.status(200).json({
        message: "Assigner assignments retrieved successfully",
        assignments,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        userId,
        assignedById,
        dutyRosterId,
      }: Omit<Assignment, "id" | "createdAt" | "updatedAt"> = req.body;
      const newAssignment: Assignment =
        await assignmentService.createAssignment({
          userId,
          assignedById,
          dutyRosterId,
        });
      res
        .status(201)
        .json({ message: "Assignment created successfully", newAssignment });
    } catch (error) {
      throw error;
    }
  }

  async updateAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: Partial<Assignment> = req.body;
      const updatedAssignment: Assignment =
        await assignmentService.updateAssignment(id, data);
      res.status(200).json({
        message: "Assignment updated successfully",
        updatedAssignment,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedAssignment: Assignment =
        await assignmentService.deleteAssignment(id);
      res.status(200).json({
        message: "Assignment deleted successfully",
        deletedAssignment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AssignmentController();
