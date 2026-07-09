import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { taskService } from "@/services/taskService";
import { Task, TaskStatus } from "@/types";
import TaskCard from "@/components/task/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "bg-slate-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-50" },
  { id: "completed", title: "Completed", color: "bg-green-50" },
];

export default function KanbanBoard() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", "kanban"],
    queryFn: () => taskService.getTasks({ limit: 100 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.updateTask(id, { status }),
    onError: () => toast.error("Failed to move task"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const tasks: Task[] = data?.tasks || [];

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    updateMutation.mutate({ id: draggableId, status: destination.droppableId as TaskStatus });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((c) => (
          <Skeleton key={c.id} className="h-96" />
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          return (
            <div key={column.id} className={`rounded-2xl p-3 ${column.color}`}>
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-slate-700">{column.title}</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                  {columnTasks.length}
                </span>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[200px] space-y-2">
                    {columnTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            style={dragProvided.draggableProps.style as React.CSSProperties}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
