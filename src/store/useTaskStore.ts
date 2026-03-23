import { create } from 'zustand';
import type { Task, Status, Priority } from '../types';
import { generateTasks } from '../types';

interface FilterState {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

interface UserPresence {
  userId: string;
  name: string;
  initials: string;
  color: string;
  taskId: string | null;
}

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  filters: FilterState;
  activeView: 'kanban' | 'list' | 'timeline';
  sortBy: { column: string; direction: 'asc' | 'desc' } | null;
  presence: UserPresence[];
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setActiveView: (view: 'kanban' | 'list' | 'timeline') => void;
  setSortBy: (sort: { column: string; direction: 'asc' | 'desc' } | null) => void;
  updatePresence: (presence: UserPresence[]) => void;
  applyFilters: () => void;
}

const initialFilters: FilterState = {
  status: [],
  priority: [],
  assignee: [],
  dateRange: {},
};

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  filteredTasks: [],
  filters: initialFilters,
  activeView: 'kanban',
  sortBy: null,
  presence: [],

  setTasks: (tasks) => {
    set({ tasks });
    get().applyFilters();
  },

  updateTaskStatus: (taskId, status) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((t) => 
      t.id === taskId ? { ...t, status } : t
    );
    set({ tasks: updatedTasks });
    get().applyFilters();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  clearFilters: () => {
    set({ filters: initialFilters });
    get().applyFilters();
  },

  setActiveView: (activeView) => set({ activeView }),

  setSortBy: (sortBy) => {
    set({ sortBy });
    get().applyFilters();
  },

  updatePresence: (presence) => set({ presence }),

  applyFilters: () => {
    const { tasks, filters, sortBy } = get();
    let filtered = tasks.filter((task) => {
      const statusMatch = filters.status.length === 0 || filters.status.includes(task.status);
      const priorityMatch = filters.priority.length === 0 || filters.priority.includes(task.priority);
      const assigneeMatch = filters.assignee.length === 0 || filters.assignee.includes(task.assignee.id);
      
      let dateMatch = true;
      if (filters.dateRange.from) {
        // Use getTime() with casting to bypass missing Date type in IDE
        dateMatch = dateMatch && (task.dueDate as any).getTime() >= (filters.dateRange.from as any).getTime();
      }
      if (filters.dateRange.to) {
        dateMatch = dateMatch && (task.dueDate as any).getTime() <= (filters.dateRange.to as any).getTime();
      }
      
      return statusMatch && priorityMatch && assigneeMatch && dateMatch;
    });

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let valA: any;
        let valB: any;
        
        if (sortBy.column.includes('.')) {
          const parts = sortBy.column.split('.');
          let currA: any = a;
          let currB: any = b;
          parts.forEach(p => {
             currA = currA?.[p as keyof typeof currA];
             currB = currB?.[p as keyof typeof currB];
          });
          valA = currA;
          valB = currB;
        } else {
          valA = (a as any)[sortBy.column];
          valB = (b as any)[sortBy.column];
        }

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        // Compare using primitives to avoid missing localeCompare/getTime errors in IDE
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortBy.direction === 'asc' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
        }

        if (typeof (valA as any).getTime === 'function' && typeof (valB as any).getTime === 'function') {
           const timeA = (valA as any).getTime();
           const timeB = (valB as any).getTime();
           return sortBy.direction === 'asc' ? timeA - timeB : timeB - timeA;
        }

        if (valA < valB) return sortBy.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortBy.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    set({ filteredTasks: filtered });
  },
}));

// Helper to initialize the store
export const initializeStore = () => {
  const tasks = generateTasks(500);
  useTaskStore.getState().setTasks(tasks);
  
  // Initialize mock presence
  const mockPresence: UserPresence[] = [
    { userId: 'u1', name: 'John Doe', initials: 'JD', color: '#10b981', taskId: tasks[0]?.id || null },
    { userId: 'u2', name: 'Jane Smith', initials: 'JS', color: '#3b82f6', taskId: tasks[1]?.id || null },
    { userId: 'u3', name: 'Bob Johnson', initials: 'BJ', color: '#f59e0b', taskId: tasks[2]?.id || null },
  ];
  useTaskStore.getState().updatePresence(mockPresence);
};
