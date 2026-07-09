import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import commentRoutes from "./routes/commentRoutes";
import userRoutes from "./routes/userRoutes";
import { notFound, errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true },
});

app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api", limiter);

app.get("/api/health", (_req, res) => res.json({ success: true, message: "API is healthy" }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("join", (userId: string) => socket.join(userId));
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

export { app, io };
