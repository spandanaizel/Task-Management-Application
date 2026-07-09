import { Schema, model } from "mongoose";
import { IComment } from "../types";

const commentSchema = new Schema<IComment>(
  {
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default model<IComment>("Comment", commentSchema);
