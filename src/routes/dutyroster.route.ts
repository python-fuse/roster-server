import { Router } from "express";

import dutyRosterController from "../controllers/dutyroster.controller";
import { authorize } from "../middleware/authenticate";

const router = Router();

router.get("/", dutyRosterController.getAllRosters);
router.get("/:id", dutyRosterController.getRosterById);
router.get("/user/:userId", dutyRosterController.getUserRosters);
router.post("/", authorize, dutyRosterController.createRoster);
router.put("/:id", authorize, dutyRosterController.updateRoster);
router.delete("/:id", authorize, dutyRosterController.deleteRoster);

export default router;
