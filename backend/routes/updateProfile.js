import express from "express";
import { updateUserProfile } from "../controllers/updateProfileController.js";
import { verifyToken, authorize } from "../middleware/auth.js";

const router = express.Router();

router.put("/:id",verifyToken,authorize("buyer","admin"),updateUserProfile);

export default router;
