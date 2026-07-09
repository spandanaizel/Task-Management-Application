import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const priorityVariant: Record<string, "default" | "warning" | "destructive"> = {
  low: "default",
  medium: "warning",
  high: "destructive",
};

export default function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  return (
    <Card onClick={onClick} className="cursor-pointer p-4 transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-900">{task.title}</h4>
        <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
      </div>
      {task.description && <p className="mb-3 line-clamp-2 text-xs text-slate-500">{task.description}</p>}
      <div className="flex items-center justify-between text-xs text-slate-400">
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
        {task.assignedTo && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
            {task.assignedTo.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </Card>
  );
}
