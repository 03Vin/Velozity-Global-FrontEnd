import { useTaskStore } from "../../store/useTaskStore";
import { useVirtualScroll } from "../../hooks/useVirtualScroll";
import type { Status, Priority } from "../../types";
import { STATUSES } from "../../types";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Dropdown } from "../ui/Dropdown";
import { ArrowUp, ArrowDown, ArrowUpDown, Calendar } from "lucide-react";
import { format } from "date-fns";

const ROW_HEIGHT = 56;

export function ListView() {
  const { filteredTasks, sortBy, setSortBy, updateTaskStatus } = useTaskStore();
  const { virtualItems, totalHeight, onScroll, containerRef } = useVirtualScroll({
    items: filteredTasks,
    itemHeight: ROW_HEIGHT,
  });

  const handleSort = (column: string) => {
    if (sortBy?.column === column) {
      setSortBy({
        column,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortBy({ column, direction: 'asc' });
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy?.column !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />;
    return sortBy.direction === 'asc' ? <ArrowUp className="ml-2 h-3 w-3" /> : <ArrowDown className="ml-2 h-3 w-3" />;
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'Critical': return <Badge variant="destructive" className="h-5 text-[10px] uppercase">{priority}</Badge>;
      case 'High': return <Badge variant="warning" className="h-5 text-[10px] uppercase">{priority}</Badge>;
      case 'Medium': return <Badge variant="info" className="h-5 text-[10px] uppercase">{priority}</Badge>;
      case 'Low': return <Badge variant="secondary" className="h-5 text-[10px] uppercase">{priority}</Badge>;
    }
  };

  const statusOptions = STATUSES.map(s => ({ label: s, value: s }));

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 animate-in fade-in duration-500">
        <div className="bg-muted/20 p-6 rounded-full mb-4">
          <Calendar className="h-12 w-12 opacity-20" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No tasks found</h3>
        <p className="max-w-xs text-center mb-6">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="glass-header sticky top-0 z-20 overflow-x-auto rounded-t-2xl mx-6 mt-6">
        <table className="w-full text-left table-fixed min-w-[800px]">
          <thead>
            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <th className="px-6 py-5 w-1/3 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-2">Title {getSortIcon('title')}</div>
              </th>
              <th className="px-6 py-5 w-40 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-2">Status {getSortIcon('status')}</div>
              </th>
              <th className="px-6 py-5 w-32 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('priority')}>
                <div className="flex items-center gap-2">Priority {getSortIcon('priority')}</div>
              </th>
              <th className="px-6 py-5 w-48 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('assignee.name')}>
                <div className="flex items-center gap-2">Assignee {getSortIcon('assignee.name')}</div>
              </th>
              <th className="px-6 py-5 w-40 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('dueDate')}>
                <div className="flex items-center gap-2">Due Date {getSortIcon('dueDate')}</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div 
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-auto custom-scrollbar px-6 pb-6"
      >
        <div className="relative w-full min-w-[800px]" style={{ height: `${totalHeight}px` }}>
          {virtualItems.map(({ item, top }) => (
            <div
              key={item.id}
              className="absolute left-0 w-full border-b border-white/[0.03] hover:bg-white/[0.02] hover:translate-x-1 transition-all duration-300 flex items-center h-[56px] group"
              style={{ top: `${top}px` }}
            >
              <div className="px-6 w-1/3 truncate font-bold text-sm text-white/80 group-hover:text-white transition-colors tracking-tight">
                {item.title}
              </div>
              <div className="px-6 w-40">
                <Dropdown
                  options={statusOptions}
                  value={item.status}
                  onChange={(val) => updateTaskStatus(item.id, val as Status)}
                  className="h-8 py-0 [&>button]:h-8 [&>button]:text-[10px] [&>button]:font-bold [&>button]:uppercase"
                />
              </div>
              <div className="px-6 w-32">{getPriorityBadge(item.priority)}</div>
              <div className="px-6 w-48 flex items-center gap-3">
                <Avatar initials={item.assignee.initials} color={item.assignee.color} size="xs" className="ring-1 ring-white/10" />
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{item.assignee.name}</span>
              </div>
              <div className="px-6 w-40 text-xs font-black text-slate-500 tracking-tighter uppercase">
                 <Calendar className="h-3 w-3 inline mr-1.5 opacity-50 text-primary" />
                 {format(item.dueDate, 'MMM d, yyyy')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
