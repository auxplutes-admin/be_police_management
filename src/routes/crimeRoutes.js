import { Router } from "express";
import { createCrime, getCrimeById, updateCrime, deleteCrime, getAllCrimes, getLatestSrNo } from "../controllers/crimeController.js";
import { verifyToken } from "../middlewares/auth.js";
const router = Router();

router.post("/create-crime", verifyToken, createCrime);
router.post("/get-crime-by-id", verifyToken, getCrimeById);
router.put("/update-crime", verifyToken, updateCrime);
router.delete("/delete-crime", verifyToken, deleteCrime);
router.post("/get-all-crimes", verifyToken, getAllCrimes);
router.post("/get-latest-sr-no", verifyToken, getLatestSrNo);

export default router;