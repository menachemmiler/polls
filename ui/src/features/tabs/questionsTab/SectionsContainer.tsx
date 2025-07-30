import React from "react";
import { SurveySection } from "../../../types/survey";
import { FormSectionHeader } from "./FormSectionHeader";
import { useSidebarStore } from "../../../stores/sidebar";

interface SectionsContainerProps {
  section: SurveySection;
  children: React.ReactNode;
  onSectionFocus?: () => void;
  onSectionBlur?: () => void;
  sectionNumber: number;
  totalSections: number;
  onSectionTitleChange: (sectionId: string, title: string) => void;
  onSectionDescriptionChange: (sectionId: string, description: string) => void;
  onSectionDeleted: (sectionId: string) => void;
  questionDesign: {
    title: {
      fontSize: number;
      fontFamily: string;
    };
    text: {
      fontSize: number;
      fontFamily: string;
    };
    color: string;
  };
}

export function SectionsContainer({
  section,
  children,
  onSectionFocus,
  onSectionBlur,
  sectionNumber,
  totalSections,
  onSectionTitleChange,
  onSectionDescriptionChange,
  questionDesign,
  onSectionDeleted,
}: SectionsContainerProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const { setTarget } = useSidebarStore();

  const handleSectionFocus = () => {
    const element = document.getElementById(`section-header-${section._id}`);
    if (element) {
      setTarget(element);
    } else if (sectionRef.current) {
      setTarget(sectionRef.current);
    }

    if (onSectionFocus) {
      onSectionFocus();
    }
  };

  const handleSectionBlur = () => {
    if (onSectionBlur) {
      onSectionBlur();
    }
  };

  return (
    <div className="mb-8">
      <div className="max-w-[720px] mx-auto">
        <div
          className="text-white px-4 py-2 rounded-t-lg inline-block float-right"
          style={{ backgroundColor: questionDesign.color }}
        >
          <span className="text-sm font-medium">
            סעיף {sectionNumber} מתוך {totalSections}
          </span>
        </div>

        <div className="clear-both"></div>
      </div>

      <div
        ref={sectionRef}
        onFocus={handleSectionFocus}
        onBlur={handleSectionBlur}
        id={`section-header-${section._id}`}
      >
        <FormSectionHeader
          title={section.title || ""}
          description={section.description || ""}
          onTitleChange={(value) => onSectionTitleChange(section._id, value)}
          sectionId={section._id}
          onDescriptionChange={(value) =>
            onSectionDescriptionChange(section._id, value)
          }
          onDeleteSection={(sectionId) => onSectionDeleted(sectionId)}
        />
      </div>

      <div className="max-w-[720px] mx-auto mt-4">{children}</div>
    </div>
  );
}
