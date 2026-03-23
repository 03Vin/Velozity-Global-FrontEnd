import { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import type { Status, Priority } from '../types';

export function useUrlFilters() {
  const { filters, setFilters, activeView, setActiveView } = useTaskStore();

  // Sync from URL to Store on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const status = params.get('status')?.split(',').filter(Boolean) as Status[] || [];
    const priority = params.get('priority')?.split(',').filter(Boolean) as Priority[] || [];
    const assignee = params.get('assignee')?.split(',').filter(Boolean) || [];
    const from = params.get('from') ? new Date(params.get('from')!) : undefined;
    const to = params.get('to') ? new Date(params.get('to')!) : undefined;
    const view = params.get('view') as any;

    if (status.length || priority.length || assignee.length || from || to) {
      setFilters({
        status,
        priority,
        assignee,
        dateRange: { from, to }
      });
    }

    if (view && ['kanban', 'list', 'timeline'].includes(view)) {
      setActiveView(view);
    }
  }, []);

  // Sync from Store to URL on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.status.length) params.set('status', filters.status.join(','));
    if (filters.priority.length) params.set('priority', filters.priority.join(','));
    if (filters.assignee.length) params.set('assignee', filters.assignee.join(','));
    if (filters.dateRange.from) params.set('from', filters.dateRange.from.toISOString().split('T')[0]);
    if (filters.dateRange.to) params.set('to', filters.dateRange.to.toISOString().split('T')[0]);
    params.set('view', activeView);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters, activeView]);
}
