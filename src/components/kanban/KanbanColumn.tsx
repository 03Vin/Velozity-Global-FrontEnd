import type { Task, Status } from "../../types";
import { TaskCard } from "./TaskCard";
import { Badge } from "../ui/Badge";
import { useCustomDnD } from "../../hooks/useCustomDnD";
import { cn } from "../../lib/utils";

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onDrop: (status: Status, taskId: string) => void;
}

export function KanbanColumn({ status, tasks, onDrop }: KanbanColumnProps) {
  const { onDragOver, onDragLeave, onDrop: handleDrop, overStatus } = useCustomDnD();
  const isOver = overStatus === status;

  return (
    <div 
      className={cn(
        "flex flex-col w-80 min-w-[20rem] h-full rounded-2xl glass transition-all duration-500",
        isOver && "bg-primary/5 ring-2 ring-primary/20 scale-[1.01] shadow-[0_0_40px_rgba(59,130,246,0.1)]"
      )}
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={onDragLeave}
      onDrop={(e) => handleDrop(e, status, onDrop as any)}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm tracking-tight">{status}</h3>
          <Badge variant="secondary" className="h-5 px-1.5 min-w-[20px] justify-center text-[10px] font-bold">
            {tasks.length}
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-800/50 rounded-lg text-muted-foreground text-xs p-4 text-center">
            <p className="font-medium">No tasks</p>
            <p className="opacity-50">Drag tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
