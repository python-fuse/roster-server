import { Router } from "express";
import assignmentController from "../controllers/assignment.controller";
import { authorize } from "../middleware/authenticate";

const router = Router();

router.get("/", assignmentController.getAllAssignments);
router.get("/:id", assignmentController.getAssignmentById);
router.get("/user/:userId", assignmentController.getUserAssignments);
router.get(
  "/assigner/:assignedById",
  assignmentController.getAssignerAssignments
);
router.post("/", authorize, assignmentController.createAssignment);
router.put("/:id", authorize, assignmentController.updateAssignment);
router.delete("/:id", authorize, assignmentController.deleteAssignment);

router.get("/all", assignmentController.getAllAssignments);

export default router;
