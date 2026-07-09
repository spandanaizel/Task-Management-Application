import { Router } from "express";
import { z } from "zod";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
} from "../controllers/taskController";
import { validate } from "../middleware/validate";
import { protect } from "../middleware/auth";

const router = Router();

const taskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["todo", "in-progress", "completed"]).default("todo"),
  dueDate: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  assignedTo: z.string().optional(),
});

router.use(protect);
router.get("/stats", getDashboardStats);
router.route("/").get(getTasks).post(validate(taskSchema), createTask);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
