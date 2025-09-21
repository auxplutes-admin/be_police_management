import { Router } from "express";
import { 
    //application type
    createApplicationType, 
    getApplicationTypeById,
    updateApplicationType, 
    getAllApplicationTypes, 
    deleteApplicationType,
   //application classification
   createApplicationClassification,
   getApplicationClassificationById,
   updateApplicationClassification,
   getAllApplicationClassifications,
   deleteApplicationClassification
} from "../controllers/applicationDataRulesController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

//application type
router.post("/create-application-type", verifyToken, createApplicationType);
router.post("/get-application-type-by-id", verifyToken, getApplicationTypeById);
router.post("/update-application-type", verifyToken, updateApplicationType);
router.post("/get-all-application-types", verifyToken, getAllApplicationTypes);
router.post("/delete-application-type", verifyToken, deleteApplicationType);

//application classification
router.post("/create-application-classification", verifyToken, createApplicationClassification);
router.post("/get-application-classification-by-id", verifyToken, getApplicationClassificationById);
router.post("/update-application-classification", verifyToken, updateApplicationClassification);
router.post("/get-all-application-classifications", verifyToken, getAllApplicationClassifications);
router.post("/delete-application-classification", verifyToken, deleteApplicationClassification);

export default router;