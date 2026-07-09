import { api } from "./api";
import { Task, TaskStatus, TaskPriority } from "@/types";

export interface TaskQuery {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const taskService = {
  getTasks: (params: TaskQuery) => api.get("/tasks", { params }).then((res) => res.data),
  getTask: (id: string) => api.get(`/tasks/${id}`).then((res) => res.data),
  createTask: (data: Partial<Task>) => api.post("/tasks", data).then((res) => res.data),
  updateTask: (id: string, data: Partial<Task>) => api.put(`/tasks/${id}`, data).then((res) => res.data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`).then((res) => res.data),
  getStats: () => api.get("/tasks/stats").then((res) => res.data),
};
