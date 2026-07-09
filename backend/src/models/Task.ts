import { Schema, model } from "mongoose";
import { ITask } from "../types";

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
    dueDate: { type: Date },
    category: { type: String, default: "General" },
    tags: [{ type: String }],
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

taskSchema.index({ title: "text", description: "text" });

export default model<ITask>("Task", taskSchema);
