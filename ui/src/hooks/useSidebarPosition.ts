import { useEffect, useCallback } from "react";
import { useSidebarStore } from "../stores/sidebar";

export const useSidebarPosition = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const { targetElement, isDragging, setSidebarTop } = useSidebarStore();

  const calculatePosition = useCallback(() => {
    if (!targetElement || !containerRef.current) {
      setSidebarTop(-16);
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const scrollTop = containerRef.current.scrollTop || 0;

    const relativeTop = targetRect.top - containerRect.top + scrollTop;
    setSidebarTop(relativeTop);
  }, [targetElement, containerRef, setSidebarTop]);

  useEffect(() => {
    calculatePosition();
  }, [targetElement, calculatePosition]);

  useEffect(() => {
    if (isDragging) return;
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      calculatePosition();
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [calculatePosition, isDragging, containerRef]);
};
