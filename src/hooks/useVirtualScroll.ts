import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

interface UseVirtualScrollProps {
  items: any[];
  itemHeight: number;
  buffer?: number;
}

export function useVirtualScroll({ items, itemHeight, buffer = 5 }: UseVirtualScrollProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerRef.current);
      setContainerHeight(containerRef.current.offsetHeight);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { virtualItems, totalHeight, offsetY } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + buffer
    );

    const virtualItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight,
    }));

    const offsetY = startIndex * itemHeight;

    return { virtualItems, totalHeight, offsetY };
  }, [items, itemHeight, scrollTop, containerHeight, buffer]);

  return {
    virtualItems,
    totalHeight,
    offsetY,
    onScroll,
    containerRef,
  };
}
