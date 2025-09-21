import { Router } from "express";
import {
    //crime part
    createCrimePart, 
    getCrimePartById, 
    updateCrimePart, 
    getAllCrimeParts, 
    deleteCrimePart,
    //crime type
    createCrimeType, 
    getCrimeTypeById, 
    updateCrimeType, 
    getAllCrimeTypes, 
    deleteCrimeType, 
    //crime subtype
    createCrimeSubType, 
    getCrimeSubTypeById, 
    updateCrimeSubType, 
    getAllCrimeSubTypes, 
    deleteCrimeSubType 
} from "../controllers/crimeDataRules.js";
import { verifyToken } from "../middlewares/auth.js";
const router = Router();

//crime part
router.post("/create-crime-part", verifyToken, createCrimePart);
router.post("/get-crime-part-by-id", verifyToken, getCrimePartById);
router.post("/update-crime-part", verifyToken, updateCrimePart);
router.post("/get-all-crime-parts", verifyToken, getAllCrimeParts);
router.post("/delete-crime-part", verifyToken, deleteCrimePart);

//crime type
router.post("/create-crime-type", verifyToken, createCrimeType);
router.post("/get-crime-type-by-id", verifyToken, getCrimeTypeById);
router.post("/update-crime-type", verifyToken, updateCrimeType);
router.post("/get-all-crime-types", verifyToken, getAllCrimeTypes);
router.post("/delete-crime-type", verifyToken, deleteCrimeType);

//crime subtype
router.post("/create-crime-subtype", verifyToken, createCrimeSubType);
router.post("/get-crime-subtype-by-id", verifyToken, getCrimeSubTypeById);
router.post("/update-crime-subtype", verifyToken, updateCrimeSubType);
router.post("/get-all-crime-subtypes", verifyToken, getAllCrimeSubTypes);
router.post("/delete-crime-subtype", verifyToken, deleteCrimeSubType);

export default router;