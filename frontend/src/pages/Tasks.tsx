import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { taskService } from "@/services/taskService";
import { Task, TaskStatus, TaskPriority } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import TaskFormModal from "@/components/task/TaskFormModal";

const priorityVariant: Record<string, "default" | "warning" | "destructive"> = {
  low: "default", medium: "warning", high: "destructive",
};
const statusVariant: Record<string, "secondary" | "default" | "success"> = {
  todo: "secondary", "in-progress": "default", completed: "success",
};

export default function Tasks() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", { search, status, priority, page }],
    queryFn: () => taskService.getTasks({ search, status: status || undefined, priority: priority || undefined, page, limit: 8 }),
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDeleteId(null);
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-500">Manage and track all your tasks</p>
        </div>
        <Button onClick={() => { setEditingTask(null); setModalOpen(true); }}>
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Search tasks..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select className="w-40" value={status} onChange={(e) => { setStatus(e.target.value as TaskStatus); setPage(1); }}>
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
        <Select className="w-40" value={priority} onChange={(e) => { setPriority(e.target.value as TaskPriority); setPage(1); }}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Due Date</th>
              <th className="px-5 py-3">Assigned To</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><Skeleton className="h-5 w-full" /></td></tr>
              ))
            ) : data?.tasks?.length ? (
              data.tasks.map((task: Task) => (
                <tr key={task._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900">{task.title}</td>
                  <td className="px-5 py-3"><Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge></td>
                  <td className="px-5 py-3"><Badge variant={statusVariant[task.status]}>{task.status}</Badge></td>
                  <td className="px-5 py-3 text-slate-500">{task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{task.assignedTo?.name || "Unassigned"}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingTask(task); setModalOpen(true); }} className="rounded-lg p-1.5 hover:bg-slate-100">
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </button>
                      <button onClick={() => setDeleteId(task._id)} className="rounded-lg p-1.5 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No tasks found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.pagination.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-8 w-8 rounded-lg text-sm ${page === i + 1 ? "bg-primary text-white" : "bg-white text-slate-600"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <TaskFormModal open={modalOpen} onOpenChange={setModalOpen} task={editingTask} />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold">Delete task?</h3>
            <p className="mb-5 text-sm text-slate-500">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => deleteMutation.mutate(deleteId)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
