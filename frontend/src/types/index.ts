export type UserRole = "admin" | "user";
export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  category?: string;
  tags: string[];
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  task: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface DashboardStats {
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    highPriority: number;
  };
  statusDistribution: { _id: string; count: number }[];
  priorityDistribution: { _id: string; count: number }[];
  weeklyCreated: { _id: string; count: number }[];
}

export interface PaginatedTasks {
  tasks: Task[];
  pagination: { page: number; limit: number; total: number; pages: number };
}
