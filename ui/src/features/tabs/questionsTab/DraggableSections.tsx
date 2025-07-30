import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { SurveySection } from "../../../types/survey";

interface DraggableSectionsProps {
  sections: SurveySection[];
  onSave: (sectionId: string, newIndex: number) => void;
  onCancel: () => void;
}

export default function DraggableSections({
  sections: initialSections,
  onSave,
  onCancel,
}: DraggableSectionsProps) {
  const { t } = useTranslation();
  const [sections, setSections] = useState<SurveySection[]>(initialSections);
  const [movedSection, setMovedSection] = useState<{
    sectionId: string;
    newIndex: number;
  } | null>(null);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);

    setMovedSection({
      sectionId: result.draggableId,
      newIndex: result.destination.index,
    });
  };

  const getSectionId = (section: SurveySection) => {
    return section._id;
  };

  const handleSave = () => {
    if (movedSection) {
      onSave(movedSection.sectionId, movedSection.newIndex);
    }
  };

  return (
    <>
      <div className="fixed inset-0  z-40" onClick={onCancel} />

      <div className="fixed inset-x-0 top-32 z-50 flex justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-center text-gray-800">
              סידור מחדש של סעיפי הטופס
            </h2>
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-0"
                  >
                    {sections.map((section, index) => {
                      if (index === 0) return null;
                      const sectionId = getSectionId(section);
                      return (
                        <Draggable
                          key={sectionId}
                          draggableId={sectionId}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white border-b border-gray-200 ${
                                snapshot.isDragging
                                  ? "shadow-lg opacity-90"
                                  : ""
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              <div className="flex items-center px-4 py-5">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move text-gray-400 hover:text-gray-600 mr-3"
                                >
                                  <GripVertical size={28} />
                                </div>

                                <div className="flex-1 text-right mr-2">
                                  <h3 className="text-gray-800 font-medium">
                                    {section.title || "null"}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    סעיף {index + 1} מתוך {sections.length}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="p-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100  font-medium transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-purple-600 hover:bg-gray-100  font-medium transition-colors"
            >
              {t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
