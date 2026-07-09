import { Router } from "express";
import { addComment, getCommentsByTask, updateComment, deleteComment } from "../controllers/commentController";
import { protect } from "../middleware/auth";

const router = Router();
router.use(protect);

router.post("/", addComment);
router.get("/:taskId", getCommentsByTask);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
