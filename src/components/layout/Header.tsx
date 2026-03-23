import { useTaskStore } from "../../store/useTaskStore";
import { Avatar } from "../ui/Avatar";
import { LayoutGrid, List, CalendarDays } from "lucide-react";
import { cn } from "../../lib/utils";

export function Header() {
  const { activeView, setActiveView, presence } = useTaskStore();

  const views = [
    { id: 'kanban', icon: LayoutGrid, label: 'Kanban' },
    { id: 'list', icon: List, label: 'List' },
    { id: 'timeline', icon: CalendarDays, label: 'Timeline' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 glass-header px-6 h-18 flex items-center justify-between backdrop-blur-2xl">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2.5 bg-primary rounded-xl rotate-3 transition-transform duration-500 group-hover:rotate-0 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
             <LayoutGrid className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
            Velozity <span className="text-primary not-italic">Tracker</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300",
                activeView === view.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <view.icon className="h-3.5 w-3.5" />
              <span>{view.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center -space-x-3">
          {presence.slice(0, 4).map((u) => (
            <Avatar key={u.userId} initials={u.initials} color={u.color} size="sm" className="ring-2 ring-[#0a0c10] shadow-xl" />
          ))}
          {presence.length > 4 && (
             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary border-2 border-[#0a0c10] text-[9px] font-black shadow-xl">
               +{presence.length - 4}
             </div>
          )}
        </div>
        <div className="hidden lg:block">
           <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{presence.length} active</span>
           </div>
        </div>
      </div>
    </header>
  );
}
