import { useTaskStore } from "../../store/useTaskStore";
import type { Status } from "../../types";
import { STATUSES } from "../../types";
import { KanbanColumn } from "./KanbanColumn";

export function KanbanBoard() {
  const { filteredTasks, updateTaskStatus } = useTaskStore();

  const handleDrop = (status: Status, taskId: string) => {
    updateTaskStatus(taskId, status);
  };

  return (
    <div className="flex h-full overflow-x-auto overflow-y-hidden p-6 gap-6 bg-background/50 custom-scrollbar">
      {STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={filteredTasks.filter((t) => t.status === status)}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
