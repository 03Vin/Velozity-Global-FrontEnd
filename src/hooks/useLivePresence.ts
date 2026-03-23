import { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';

export function useLivePresence() {
  const { tasks, presence, updatePresence } = useTaskStore();

  useEffect(() => {
    if (tasks.length === 0) return;

    const interval = setInterval(() => {
      const newPresence = presence.map((p) => {
        // 30% chance to move to a new task
        if (Math.random() < 0.3) {
          const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
          return { ...p, taskId: randomTask.id };
        }
        return p;
      });
      
      updatePresence(newPresence);
    }, 5000 + Math.random() * 5000); // Random interval between 5-10s

    return () => clearInterval(interval);
  }, [tasks, presence, updatePresence]);
}
