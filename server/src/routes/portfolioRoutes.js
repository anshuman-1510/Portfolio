import { Router } from "express";
import {
  createExperience,
  createProject,
  createSkill,
  deleteExperience,
  deleteProject,
  deleteSkill,
  getMyPortfolio,
  getPublicPortfolio,
  updateContact,
  updateExperience,
  updateProfile,
  updateProject,
  updateSkill
} from "../controllers/portfolioController.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/public/:username", getPublicPortfolio);

router.use(requireAuth);

router.get("/me", getMyPortfolio);
router.patch(
  "/profile",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateProfile
);
router.patch("/contact", updateContact);

router.post("/projects", upload.single("image"), createProject);
router.patch("/projects/:projectId", upload.single("image"), updateProject);
router.delete("/projects/:projectId", deleteProject);

router.post("/skills", createSkill);
router.patch("/skills/:skillId", updateSkill);
router.delete("/skills/:skillId", deleteSkill);

router.post("/experiences", createExperience);
router.patch("/experiences/:experienceId", updateExperience);
router.delete("/experiences/:experienceId", deleteExperience);

export default router;
