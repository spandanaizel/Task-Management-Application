import { Response } from "express";
import Task from "../models/Task";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../types";

export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.create({ ...req.body, createdBy: req.user?.id });
  const populated = await task.populate(["assignedTo", "createdBy"]);
  res.status(201).json({ success: true, task: populated });
});

export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search, status, priority, category, sort = "-createdAt", page = "1", limit = "10" } = req.query;

  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search as string };

  const pageNum = Math.max(parseInt(page as string, 10), 1);
  const limitNum = Math.max(parseInt(limit as string, 10), 1);
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    tasks,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar");
  if (!task) throw new ApiError(404, "Task not found");
  res.status(200).json({ success: true, task });
});

export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar");
  if (!task) throw new ApiError(404, "Task not found");
  res.status(200).json({ success: true, task });
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");
  res.status(200).json({ success: true, message: "Task deleted successfully" });
});

export const getDashboardStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [total, completed, pending, inProgress, highPriority, statusAgg, priorityAgg] = await Promise.all([
    Task.countDocuments(),
    Task.countDocuments({ status: "completed" }),
    Task.countDocuments({ status: "todo" }),
    Task.countDocuments({ status: "in-progress" }),
    Task.countDocuments({ priority: "high" }),
    Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyAgg = await Task.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: { total, completed, pending, inProgress, highPriority },
    statusDistribution: statusAgg,
    priorityDistribution: priorityAgg,
    weeklyCreated: weeklyAgg,
  });
});
