import { Response } from "express";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../types";

export const getUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await User.find().select("-password -refreshToken");
  res.status(200).json({ success: true, users });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?.id,
    { ...(name && { name }), ...(avatar && { avatar }) },
    { new: true, runValidators: true }
  );
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json({ success: true, user });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user?.id).select("+password");
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: "Password updated successfully" });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json({ success: true, message: "User deleted successfully" });
});
