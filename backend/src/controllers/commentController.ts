import { Response } from "express";
import Comment from "../models/Comment";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../types";

export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { task, content } = req.body;
  const comment = await Comment.create({ task, content, author: req.user?.id });
  const populated = await comment.populate("author", "name avatar");
  res.status(201).json({ success: true, comment: populated });
});

export const getCommentsByTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate("author", "name avatar")
    .sort("createdAt");
  res.status(200).json({ success: true, comments });
});

export const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.author.toString() !== req.user?.id && req.user?.role !== "admin") {
    throw new ApiError(403, "You can only edit your own comments");
  }
  comment.content = req.body.content;
  await comment.save();
  res.status(200).json({ success: true, comment });
});

export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.author.toString() !== req.user?.id && req.user?.role !== "admin") {
    throw new ApiError(403, "You can only delete your own comments");
  }
  await comment.deleteOne();
  res.status(200).json({ success: true, message: "Comment deleted" });
});
