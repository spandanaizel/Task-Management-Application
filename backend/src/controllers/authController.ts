import { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens";
import { AuthRequest } from "../types";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(201).json({
    success: true,
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(200).json({
    success: true,
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { $unset: { refreshToken: 1 } });
  }
  res.clearCookie("refreshToken", cookieOptions);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, "No refresh token provided");

  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) throw new ApiError(401, "Refresh token mismatch");

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  res.status(200).json({ success: true, accessToken });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});
