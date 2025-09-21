import { Router } from "express";
import { createPoliceStation, getPoliceStationById, updatePoliceStation, deletePoliceStationById } from "../controllers/policeStationController.js";
import { verifyToken } from "../middlewares/auth.js";  

const router = Router();

router.post("/create", createPoliceStation);
router.post("/get-station-by-id",verifyToken, getPoliceStationById);
router.post("/update", verifyToken, updatePoliceStation);
router.post("/delete", verifyToken, deletePoliceStationById);

export default router;