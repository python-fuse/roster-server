import { Router } from "express";
import assignmentController from "../controllers/assignment.controller";

const router = Router();

router.get("/", assignmentController.getAllAssignments);
router.get("/:id", assignmentController.getAssignmentById);
router.get("/user/:userId", assignmentController.getUserAssignments);
router.get(
  "/assigner/:assignedById",
  assignmentController.getAssignerAssignments
);
router.post("/", assignmentController.createAssignment);
router.put("/:id", assignmentController.updateAssignment);
router.delete("/:id", assignmentController.deleteAssignment);

router.get("/all", assignmentController.getAllAssignments);

export default router;
