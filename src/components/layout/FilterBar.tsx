import { useTaskStore } from "../../store/useTaskStore";
import { MultiSelect } from "../ui/MultiSelect";
import { Button } from "../ui/Button";
import { STATUSES, PRIORITIES, USERS } from "../../types";
import { Calendar } from "lucide-react";

export function FilterBar() {
  const { filters, setFilters, clearFilters, filteredTasks, tasks } = useTaskStore();

  const statusOptions = STATUSES.map(s => ({ label: s, value: s }));
  const priorityOptions = PRIORITIES.map(p => ({ label: p, value: p }));
  const assigneeOptions = USERS.map(u => ({ label: u.name, value: u.id }));

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.assignee.length > 0 || 
    !!filters.dateRange.from || 
    !!filters.dateRange.to;

  return (
    <div className="flex flex-col gap-6 p-6 bg-white/[0.02] border-b border-white/5 transition-all duration-500">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full md:w-52">
          <MultiSelect
            label="Status"
            placeholder="All Statuses"
            options={statusOptions}
            value={filters.status}
            onChange={(val) => setFilters({ status: val as any })}
          />
        </div>
        <div className="w-full md:w-52">
          <MultiSelect
            label="Priority"
            placeholder="All Priorities"
            options={priorityOptions}
            value={filters.priority}
            onChange={(val) => setFilters({ priority: val as any })}
          />
        </div>
        <div className="w-full md:w-60">
          <MultiSelect
            label="Assignee"
            placeholder="All Assignees"
            options={assigneeOptions}
            value={filters.assignee}
            onChange={(val) => setFilters({ assignee: val })}
          />
        </div>
        
        <div className="flex flex-col gap-1.5 flex-1 min-w-[300px]">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Timeline Range</label>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 h-11 transition-all hover:bg-white/[0.08] focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
            <Calendar className="h-4 w-4 text-primary/60" />
            <input
              type="date"
              className="bg-transparent border-none text-xs font-bold text-white outline-none w-32 tracking-tight transition-opacity hover:opacity-100 opacity-70 focus:opacity-100"
              value={filters.dateRange.from ? filters.dateRange.from.toISOString().split('T')[0] : ''}
              onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, from: e.target.value ? new Date(e.target.value) : undefined } })}
            />
            <div className="h-4 w-[1px] bg-white/10 mx-1" />
            <input
              type="date"
              className="bg-transparent border-none text-xs font-bold text-white outline-none w-32 tracking-tight transition-opacity hover:opacity-100 opacity-70 focus:opacity-100"
              value={filters.dateRange.to ? filters.dateRange.to.toISOString().split('T')[0] : ''}
              onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, to: e.target.value ? new Date(e.target.value) : undefined } })}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={clearFilters}
            className="h-11 px-6 font-black text-[10px] uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-300 rounded-xl"
          >
            Reset Filters
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000" 
                style={{ width: `${(filteredTasks.length / tasks.length) * 100}%` }} 
              />
           </div>
           <span className="text-[10px] font-bold text-slate-500 tracking-wider">
             MATCHING <strong className="text-white">{filteredTasks.length}</strong> OF {tasks.length} TASKS
           </span>
        </div>
      </div>
    </div>
  );
}
