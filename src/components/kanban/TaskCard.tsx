import { useState } from "react";
import type { Task } from "../../types";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Calendar, MessageSquare } from "lucide-react";
import { format, isToday, isPast, differenceInDays } from "date-fns";
import { cn } from "../../lib/utils";
import { useTaskStore } from "../../store/useTaskStore";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { presence } = useTaskStore();
  const [isDragging, setIsDragging] = useState(false);
  
  const activeUsers = presence.filter(p => p.taskId === task.id);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Set a custom drag image if needed, or just let the browser handle the ghost
    // We add a class to the original element to show the placeholder effect
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical': return <Badge variant="destructive" className="h-5 text-[10px] uppercase">{priority}</Badge>;
      case 'High': return <Badge variant="warning" className="h-5 text-[10px] uppercase">{priority}</Badge>;
      case 'Medium': return <Badge variant="info" className="h-5 text-[10px] uppercase">{priority}</Badge>;
      case 'Low': return <Badge variant="secondary" className="h-5 text-[10px] uppercase">{priority}</Badge>;
      default: return null;
    }
  };

  const getDueDateLabel = (date: Date) => {
    if (isToday(date)) return 'Due Today';
    if (isPast(date)) {
      const days = differenceInDays(new Date(), date);
      if (days > 7) return `${days} days overdue`;
      return format(date, 'MMM d');
    }
    return format(date, 'MMM d');
  };

  const isOverdue = isPast(task.dueDate) && !isToday(task.dueDate);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "group relative glass p-4 rounded-xl transition-all duration-300",
        "hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:-translate-y-1",
        "cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-30 scale-95" : "opacity-100",
        "animate-in fade-in slide-in-from-bottom-2 duration-500"
      )}
    >
      {/* Presence Indicators */}
      <div className="absolute -top-2 -right-2 flex -space-x-2 z-20">
        {activeUsers.length > 0 && activeUsers.slice(0, 3).map((user) => (
          <div 
             key={user.userId}
             className="h-6 w-6 rounded-full border-2 border-[#0a0c10] ring-1 ring-primary/20 shadow-lg transition-transform duration-300 group-hover:scale-110"
             style={{ backgroundColor: user.color }}
             title={`${user.name} is viewing this`}
          />
        ))}
        {activeUsers.length > 3 && (
          <div className="h-6 w-6 rounded-full bg-secondary border-2 border-[#0a0c10] flex items-center justify-center text-[9px] font-bold shadow-lg">
            +{activeUsers.length - 3}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          {getPriorityBadge(task.priority)}
          <Avatar initials={task.assignee.initials} color={task.assignee.color} size="xs" />
        </div>

        <div>
          <h4 className="font-bold text-sm tracking-tight text-white/90 group-hover:text-white transition-colors line-clamp-2">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed font-medium">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className={cn(
            "flex items-center gap-2 text-[10px] font-semibold tracking-wide uppercase transition-colors",
            isOverdue ? "text-rose-400" : "text-slate-400"
          )}>
            <Calendar className="h-3 w-3" />
            <span>{getDueDateLabel(task.dueDate)}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
             <div className="flex items-center gap-1 group/icon">
                <MessageSquare className="h-3.5 w-3.5 transition-colors group-hover/icon:text-primary" />
                <span className="text-[10px] font-bold">4</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
