import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Loading from "../../../components/shared/Loading";
import { FormSectionHeader } from "./FormSectionHeader";
import { Sidebar } from "./Sidebar";
import { QuestionsContainer } from "./QuestionsContainer";
import { SectionsContainer } from "./SectionsContainer";
import { usePollApiActions } from "./questionCard/hooks/usePollApiActions";
import { useQuestionsTabActions } from "./questionCard/hooks/useQuestionsTabActions";
import { useSidebarStore } from "../../../stores/sidebar";
import { useSidebarPosition } from "../../../hooks/useSidebarPosition";
import { useEffect } from "react";

interface QuestionsTabProps {
  setIsPromptSelectorOpen: (isOpen: boolean) => void;
  setIndex: (index: number) => void;
  setSectionId: (sectionId: string) => void;
}

const QuestionsTab = ({
  setIsPromptSelectorOpen,
  setIndex,
  setSectionId,
}: QuestionsTabProps) => {
  const {
    poll,
    pollId,
    isLoading,
    refreshPoll,
    updatePollTitle,
    updatePollDescription,
    updateSectionTitle,
    updateSectionDescription,
    createQuestion,
    deleteSection,
    createSection,
  } = usePollApiActions();

  const {
    formHeaderRef,
    sidebarContainerRef,
    handleSetActiveQuestion,
    handleFormFocus,
    handleFormHeaderBlur,
    handleDragStart,
    handleDragEnd,
  } = useQuestionsTabActions();

  const {
    sidebarTop,
    activeQuestionId,
    activeSectionId,
    setTarget,
    setActiveSectionId,
  } = useSidebarStore();
  useSidebarPosition(sidebarContainerRef);

  const questionDesign = {
    title: {
      fontSize: poll.design?.questions?.fontSize || 16,
      fontFamily: poll.design?.questions?.fontFamily || "Arial",
    },
    text: {
      fontSize: poll.design?.text?.fontSize || 14,
      fontFamily: poll.design?.text?.fontFamily || "Arial",
    },
    color: poll.design?.color || "#9333ea",
  };

  useEffect(() => {
    if (poll?.sections.length && !activeSectionId) {
      const firstSectionId = poll.sections[0]._id;
      setActiveSectionId(firstSectionId);
      const el = document.getElementById(`section-header-${firstSectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTarget(el);
      }
    }
  }, [poll, activeSectionId]);

  return (
    <div className="relative pb-10" ref={sidebarContainerRef}>
      {isLoading || !poll ? (
        <Loading />
      ) : (
        <>
          <DragDropContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-6">
              {poll.sections.map((section, index) => {
                const isFirstSection = index === 0;
                const hasMultipleSections = poll.sections.length > 1;

                const header = isFirstSection && (
                  <>
                    {hasMultipleSections && (
                      <div className="max-w-[720px] mx-auto">
                        <div
                          className="text-white px-4 py-2 rounded-t-lg inline-block float-right"
                          style={{ backgroundColor: questionDesign.color }}
                        >
                          <span className="text-sm font-medium">
                            סעיף 1 מתוך {poll.sections.length}
                          </span>
                        </div>
                        <div className="clear-both" />
                      </div>
                    )}
                    <div className="mb-4">
                      <div
                        ref={formHeaderRef}
                        onFocus={handleFormFocus}
                        onBlur={handleFormHeaderBlur}
                        tabIndex={-1}
                      >
                        <FormSectionHeader
                          title={poll.title || ""}
                          description={poll.description || ""}
                          onTitleChange={updatePollTitle}
                          onDescriptionChange={updatePollDescription}
                          sectionId={section._id}
                        />
                      </div>
                    </div>
                  </>
                );

                const container = (
                  <Droppable
                    droppableId={`section-${section._id}`}
                    key={section._id}
                  >
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                        style={{
                          transition: snapshot.isDraggingOver
                            ? "none"
                            : undefined,
                        }}
                      >
                        <QuestionsContainer
                          questions={section.questions}
                          pollId={pollId}
                          sectionId={section._id}
                          onQuestionsChanged={refreshPoll}
                          activeQuestionId={activeQuestionId}
                          onSetActiveQuestion={(id) =>
                            handleSetActiveQuestion(id, section._id)
                          }
                          onQuestionAdded={(id) => {
                            if (id) {
                              const el = document.getElementById(
                                `question-${id}`
                              );
                              if (el)
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                              handleSetActiveQuestion(id, section._id);
                            }
                          }}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );

                if (isFirstSection) {
                  return (
                    <div key={section._id}>
                      {header}
                      <div className="max-w-[720px] mx-auto">{container}</div>
                      <div
                        style={{ backgroundColor: questionDesign.color }}
                      ></div>
                    </div>
                  );
                }

                return (
                  <SectionsContainer
                    key={section._id}
                    section={section}
                    questionDesign={questionDesign}
                    sectionNumber={index + 1}
                    totalSections={poll.sections.length}
                    onSectionFocus={() =>
                      handleSetActiveQuestion(null, section._id)
                    }
                    onSectionBlur={() => {}}
                    onSectionTitleChange={(v) =>
                      updateSectionTitle(section._id, v)
                    }
                    onSectionDescriptionChange={(v) =>
                      updateSectionDescription(section._id, v)
                    }
                    onSectionDeleted={() => deleteSection(section._id)}
                  >
                    {container}
                  </SectionsContainer>
                );
              })}
            </div>
          </DragDropContext>

          <div
            className="absolute left-17 z-20"
            style={{
              top: `${sidebarTop}px`,
              transform: "scale(1)",
              transition: "all 300ms ease-out",
            }}
          >
            <Sidebar
              sectionId={activeSectionId}
              activeQuestionId={activeQuestionId}
              onQuestionAdded={(id) => {
                if (id) handleSetActiveQuestion(id, activeSectionId);
              }}
              createQuestion={createQuestion}
              createSection={createSection}
              setIsPromptSelectorOpen={setIsPromptSelectorOpen}
              setIndex={setIndex}
              setSectionId={setSectionId}
              onSectionAdded={() => {}}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionsTab;
