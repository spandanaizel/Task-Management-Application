import KanbanBoard from "@/components/kanban/KanbanBoard";

export default function Kanban() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kanban Board</h1>
        <p className="text-sm text-slate-500">Drag tasks between columns to update their status</p>
      </div>
      <KanbanBoard />
    </div>
  );
}
