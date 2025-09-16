import { Router } from "express";
import { createPoliceOfficer, getPoliceOfficerById, updatePoliceOfficer, deletePoliceOfficerById, login, logout } from "../controllers/policeOfficerController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/create-officer", createPoliceOfficer);
router.get("/get-officer-profile", verifyToken, getPoliceOfficerById);
router.post("/update", verifyToken, updatePoliceOfficer);
router.post("/delete", verifyToken, deletePoliceOfficerById);

export default router;