import { Router } from "express";
import { createCrime, getCrimeById, updateCrime, deleteCrime } from "../controllers/crimeController.js";
import { verifyToken } from "../middlewares/auth.js";
const router = Router();

router.post("/create-crime", verifyToken, createCrime);
router.post("/get-crime-by-id", verifyToken, getCrimeById);
router.put("/update-crime", verifyToken, updateCrime);
router.delete("/delete-crime", verifyToken, deleteCrime);

export default router;