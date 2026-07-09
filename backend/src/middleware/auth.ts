import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, UserRole } from "../types";
import { ApiError } from "../utils/ApiError";

export const protect = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;
    const token = header && header.startsWith("Bearer ") ? header.split(" ")[1] : undefined;

    if (!token) {
      throw new ApiError(401, "Not authorized, no token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: UserRole };
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    next(new ApiError(401, "Not authorized, token invalid or expired"));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    next();
  };
};
