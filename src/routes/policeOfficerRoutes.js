import { Router } from "express";
import { 
    createPoliceOfficer, 
    getPoliceOfficerById, 
    updatePoliceOfficer, 
    deletePoliceOfficerById, 
    login, 
    logout, 
    getOfficerSessionsByOfficerId,
    getAllPoliceOfficers,
    getOfficerByIdAndStation
} from "../controllers/policeOfficerController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// Officer Management
router.post("/login", login);
router.post("/logout", logout);
router.post("/create-officer", createPoliceOfficer);
router.get("/get-officer-profile", verifyToken, getPoliceOfficerById);
router.post("/get-all-officers", verifyToken, getAllPoliceOfficers);
router.post("/get-officer-by-id-and-station", verifyToken, getOfficerByIdAndStation);
router.post("/update", verifyToken, updatePoliceOfficer);
router.post("/delete", verifyToken, deletePoliceOfficerById);

// Session Management
router.post("/get-officer-sessions", verifyToken, getOfficerSessionsByOfficerId);

export default router;