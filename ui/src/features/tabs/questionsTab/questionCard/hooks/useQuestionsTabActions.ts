import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { useSidebarStore } from "../../../../../stores/sidebar";
import { usePoll } from "../../../../../context/PollContext";
import { useFormManagement } from "./useFormManagement";
import { useDragAndDrop } from "./useDragAndDrop";
import { usePollApiActions } from "./usePollApiActions";

export const useQuestionsTabActions = () => {
  const formHeaderRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement | null>(null);
  const [pendingSectionId, setPendingSectionId] = useState<string | null>(null);
  const [previousSectionsCount, setPreviousSectionsCount] = useState(0);
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(
    null
  );

  const {
    setTarget,
    setIsDragging,
    setActiveQuestionId,
    setActiveSectionId,
    activeQuestionId,
    activeSectionId,
  } = useSidebarStore();

  const { poll } = usePoll();

  const { handleFormHeaderFocus, handleFormHeaderBlur } =
    useFormManagement(poll);

  const { reorderQuestionMutation, refreshPoll } = usePollApiActions();
  const { handleDragEnd } = useDragAndDrop(
    poll,
    reorderQuestionMutation,
    refreshPoll
  );

  const activeSection = useMemo(() => {
    return poll?.sections.find((s) => s._id === activeSectionId);
  }, [poll?.sections, activeSectionId]);

  const handleSetActiveQuestion = useCallback(
    (questionId: string | null, sectionId: string | null) => {
      setActiveQuestionId(questionId);
      if (sectionId !== activeSectionId) {
        setActiveSectionId(sectionId);
      }
    },
    [activeSectionId, setActiveQuestionId, setActiveSectionId]
  );

  const sidebarSectionId = useMemo(() => {
    if (activeQuestionId && poll) {
      const sectionWithQuestion = poll.sections.find((s) =>
        s.questions.some((q) => q._id === activeQuestionId)
      );
      return sectionWithQuestion?._id || activeSectionId;
    }
    return activeSectionId;
  }, [activeQuestionId, poll, activeSectionId]);

  useEffect(() => {
    const currentSectionsCount = poll?.sections.length || 0;
    if (currentSectionsCount > previousSectionsCount) {
      const newSection = poll?.sections[poll.sections.length - 1];
      if (newSection) {
        setActiveSectionId(newSection._id);
        setActiveQuestionId(null);
        setTimeout(() => {
          const sectionElement = document.getElementById(
            `section-header-${newSection._id}`
          );
          if (sectionElement) {
            sectionElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            setTarget(sectionElement);
          }
        }, 300);
      }
    }
    setPreviousSectionsCount(currentSectionsCount);
  }, [
    poll?.sections,
    previousSectionsCount,
    setActiveSectionId,
    setActiveQuestionId,
    setTarget,
  ]);

  useEffect(() => {
    if (
      pendingSectionId &&
      poll?.sections.find((s) => s._id === pendingSectionId)
    ) {
      setActiveSectionId(pendingSectionId);
      setActiveQuestionId(null);
      setPendingSectionId(null);
      setTimeout(() => {
        const sectionElement = document.getElementById(
          `section-header-${pendingSectionId}`
        );
        if (sectionElement) {
          sectionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          setTarget(sectionElement);
        }
      }, 300);
    }
  }, [
    poll?.sections,
    pendingSectionId,
    setActiveSectionId,
    setActiveQuestionId,
    setTarget,
  ]);

  const handleFormFocus = useCallback(() => {
    handleFormHeaderFocus();
    setActiveQuestionId(null);
    if (poll?.sections[0]?._id) {
      setActiveSectionId(poll.sections[0]._id);
    }
    setTarget(formHeaderRef.current);
  }, [
    handleFormHeaderFocus,
    poll?.sections,
    setActiveSectionId,
    setActiveQuestionId,
    setTarget,
  ]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    document.body.style.cursor = "grabbing";
  }, [setIsDragging]);

  const handleDragEndWrapper = useCallback(
    (result: DropResult) => {
      setIsDragging(false);
      document.body.style.cursor = "";
      handleDragEnd(result);
    },
    [setIsDragging, handleDragEnd]
  );

  return {
    formHeaderRef,
    sidebarContainerRef,
    pendingQuestionId,
    activeQuestionId,
    activeSectionId,
    activeSection,
    sidebarSectionId,
    poll,
    handleSetActiveQuestion,
    handleFormFocus,
    handleFormHeaderBlur,
    handleDragStart,
    handleDragEnd: handleDragEndWrapper,
    setPendingQuestionId,
  };
};
