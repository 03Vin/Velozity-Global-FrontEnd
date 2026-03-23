import { useState, useCallback } from 'react';

export function useCustomDnD() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<string | null>(null);

  const onDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
    e.dataTransfer.effectAllowed = 'move';
    setActiveId(id);
    
    // Create a ghost image if needed, or just let browser handle it
    // The requirement says "dragged card must follow cursor with opacity reduction and shadow"
    // Native drag handles this partially, but we can style the dragging element
  }, []);

  const onDragEnd = useCallback(() => {
    setActiveId(null);
    setOverStatus(null);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverStatus(status);
  }, []);

  const onDragLeave = useCallback(() => {
    setOverStatus(null);
  }, []);

  const onDrop = useCallback((e: React.DragEvent, status: string, callback: (status: any, id: string) => void) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      callback(status, taskId);
    }
    setActiveId(null);
    setOverStatus(null);
  }, []);

  return {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    activeId,
    overStatus
  };
}
