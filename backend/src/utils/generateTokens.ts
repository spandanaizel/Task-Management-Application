import jwt, { SignOptions } from "jsonwebtoken";

export const generateAccessToken = (userId: string, role: string): string => {
  const options: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN || "15m") as SignOptions["expiresIn"] };
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as SignOptions["expiresIn"] };
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, options);
};
