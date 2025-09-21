import { Router } from "express";
import { 
    createApplication, 
    getApplicationById, 
    updateApplication, 
    getAllApplications, 
    deleteApplication,
    getApplicationsByType
} from "../controllers/applicationsController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/create-application", verifyToken, createApplication);
router.post("/get-application-by-id", verifyToken, getApplicationById);
router.post("/update", verifyToken, updateApplication);
router.post("/get-all-applications", verifyToken, getAllApplications);
router.post("/delete", verifyToken, deleteApplication);

// Graphs
router.post("/get-applications-by-type", verifyToken, getApplicationsByType);

export default router;