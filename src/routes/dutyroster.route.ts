import { Router } from "express";

import dutyRosterController from "../controllers/dutyroster.controller";

const router = Router();

router.get("/", dutyRosterController.getAllRosters);
router.get("/:id", dutyRosterController.getRosterById);
router.post("/", dutyRosterController.createRoster);
router.put("/:id", dutyRosterController.updateRoster);
router.delete("/:id", dutyRosterController.deleteRoster);

export default router;
