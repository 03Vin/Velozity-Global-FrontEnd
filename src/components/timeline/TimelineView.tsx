import { useTaskStore } from "../../store/useTaskStore";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, differenceInDays } from "date-fns";
import { cn } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";

const DAY_WIDTH = 48;

export function TimelineView() {
  const { filteredTasks } = useTaskStore();
  const now = new Date();
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500/20 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
      case 'High': return 'bg-amber-500/20 border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      case 'Medium': return 'bg-sky-500/20 border-sky-500/30 text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.15)]';
      case 'Low': return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
      default: return 'bg-slate-500/20 border-slate-500/30 text-slate-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden px-6 pb-6">
      <div className="glass-header flex sticky top-0 z-20 overflow-x-auto custom-scrollbar rounded-t-2xl mt-6">
        <div className="w-64 min-w-[16rem] border-r border-white/5 p-5 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">TASK TIMELINE</div>
        <div className="flex">
          {days.map((day) => (
            <div 
              key={day.toISOString()} 
              className={cn(
                "flex flex-col items-center justify-center border-r border-white/[0.03] text-[10px] font-black uppercase tracking-tighter w-[48px] py-3",
                isSameDay(day, now) ? "bg-primary/20 text-white border-primary/30" : "text-slate-500"
              )}
            >
              <span>{format(day, 'EEE')}</span>
              <span className="text-xs">{format(day, 'd')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar border-x border-b border-white/5 rounded-b-2xl bg-white/[0.01]">
        <div className="relative min-w-max">
          {/* Today vertical line */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-primary/40 z-10 pointer-events-none shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            style={{ left: `calc(16rem + ${differenceInDays(now, startDate) * DAY_WIDTH}px + ${DAY_WIDTH / 2}px)` }}
          />

          {filteredTasks.map((task) => {
            const taskStart = task.startDate || task.dueDate;
            const taskEnd = task.dueDate;
            const startOffset = Math.max(0, differenceInDays(taskStart, startDate));
            const duration = Math.max(1, differenceInDays(taskEnd, taskStart) + 1);
            
            if (taskEnd < startDate || taskStart > endDate) return null;

            return (
              <div key={task.id} className="flex border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group h-14">
                <div className="w-64 min-w-[16rem] border-r border-white/5 p-3 flex items-center gap-3 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors">
                  <Avatar initials={task.assignee.initials} color={task.assignee.color} size="xs" className="ring-1 ring-white/10" />
                  <span className="text-xs font-bold truncate text-slate-400 group-hover:text-white transition-colors">{task.title}</span>
                </div>
                <div className="flex relative items-center">
                  {days.map((day) => (
                    <div key={day.toISOString()} className="border-r border-white/[0.02] h-full" style={{ width: DAY_WIDTH }} />
                  ))}
                  
                  <div
                    className={cn(
                      "absolute h-9 rounded-xl border flex items-center px-4 text-[10px] font-black uppercase tracking-wider truncate z-10 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:z-20 cursor-pointer backdrop-blur-sm",
                      getPriorityColor(task.priority)
                    )}
                    style={{
                      left: `${startOffset * DAY_WIDTH + 6}px`,
                      width: `${duration * DAY_WIDTH - 12}px`,
                    }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-current mr-2 shadow-[0_0_8px_currentColor]" />
                    {task.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
