import { create } from "zustand";

interface SidebarStore {
  targetElement: HTMLElement | null;
  isDragging: boolean;
  sidebarTop: number;
  activeQuestionId: string | null;
  activeSectionId: string | null;
  formHeaderElement: HTMLElement | null;
  setTarget: (el: HTMLElement | null) => void;
  setIsDragging: (dragging: boolean) => void;
  setSidebarTop: (top: number) => void;
  setActiveQuestionId: (id: string | null) => void;
  setActiveSectionId: (id: string | null) => void;
  setFormHeaderElement: (el: HTMLElement | null) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  targetElement: null,
  isDragging: false,
  sidebarTop: 0,
  activeQuestionId: null,
  activeSectionId: null,
  formHeaderElement: null,
  setTarget: (el) => set({ targetElement: el }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
  setSidebarTop: (top) => set({ sidebarTop: top }),
  setActiveQuestionId: (id) => set({ activeQuestionId: id }),
  setActiveSectionId: (id) => set({ activeSectionId: id }),
  setFormHeaderElement: (el) => set({ formHeaderElement: el }),
}));
