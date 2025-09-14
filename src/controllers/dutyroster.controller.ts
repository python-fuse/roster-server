import { Request, Response, NextFunction } from "express";
import dutyrosterService from "../services/dutyroster.service";
import { DutyRoster, Shift } from "@prisma/client";
import { ApiError } from "../middleware/errorHandler";

class DutyRosterController {
  async getAllRosters(req: Request, res: Response, next: NextFunction) {
    try {
      const rosters = await dutyrosterService.getAllRosters();
      res.json({ message: "Rosters retrieved successfully", data: rosters });
    } catch (error) {
      next(error);
    }
  }

  async getRosterById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const roster = await dutyrosterService.getRosterById(id);
      if (!roster) {
        return res.status(404).json({ message: "Roster not found" });
      }
      res.json({ message: "Roster retrieved successfully", data: roster });
    } catch (error) {
      next(error);
    }
  }

  async getUserRosters(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const rosters = await dutyrosterService.getRostersByUserId(userId);
      res.json({
        message: "User rosters retrieved successfully",
        data: rosters,
      });
    } catch (error) {
      next(error);
    }
  }

  async createRoster(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        addedById,
        date,
        shift,
      }: Omit<DutyRoster, "id" | "createdAt" | "updatedAt"> = req.body;

      await dutyrosterService.createRoster({
        addedById,
        date,
        shift: shift.toUpperCase() as Shift,
      });
      res.status(201).json({ message: "Roster created successfully" });
    } catch (e) {
      next(e);
    }
  }

  async updateRoster(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        addedById,
        date,
        shift,
      }: Omit<DutyRoster, "id" | "createdAt" | "updatedAt"> = req.body;

      await dutyrosterService.updateRoster(id, {
        addedById,
        date,
        shift: shift.toUpperCase() as Shift,
      });
      res.json({ message: "Roster updated successfully" });
    } catch (e) {
      next(e);
    }
  }

  async deleteRoster(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const dbRoster = await dutyrosterService.getRosterById(id);

      if (!dbRoster) {
        throw new ApiError(404, "Roster not found");
      }

      await dutyrosterService.deleteRoster(id);
      res.json({ message: "Roster deleted successfully" });
    } catch (e) {
      next(e);
    }
  }
}

export default new DutyRosterController();
