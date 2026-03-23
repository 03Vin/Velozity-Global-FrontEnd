import { useEffect } from 'react'
import { Header } from './components/layout/Header'
import { FilterBar } from './components/layout/FilterBar'
import { useTaskStore, initializeStore } from './store/useTaskStore'
import { useUrlFilters } from './hooks/useUrlFilters'
import { useLivePresence } from './hooks/useLivePresence'
import { KanbanBoard } from './components/kanban/KanbanBoard'
import { ListView } from './components/list/ListView'
import { TimelineView } from './components/timeline/TimelineView'


function App() {
  const { activeView } = useTaskStore();
  
  useEffect(() => {
    initializeStore();
  }, []);

  useUrlFilters();
  useLivePresence();

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <FilterBar />
        <div className="flex-1 overflow-hidden relative">
          <div key={activeView} className="h-full animate-in fade-in zoom-in-95 duration-700 ease-out transition-all">
            {activeView === 'kanban' && <KanbanBoard />}
            {activeView === 'list' && <ListView />}
            {activeView === 'timeline' && <TimelineView />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
