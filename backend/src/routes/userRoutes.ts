import { Router } from "express";
import { getUsers, updateProfile, changePassword, deleteUser } from "../controllers/userController";
import { protect, authorize } from "../middleware/auth";

const router = Router();
router.use(protect);

router.get("/", getUsers);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
