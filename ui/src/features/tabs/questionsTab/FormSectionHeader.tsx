import { FC } from "react";
import { FormHeaderEditor } from "../../../components/shared/FormHeaderEditor";
import { SectionMenu } from "./SectionMenu";
import { usePoll } from "../../../context/PollContext";

interface FormHeaderProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  sectionId: string;
  onDeleteSection?: (sectionId: string) => void;
}

export const FormSectionHeader: FC<FormHeaderProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onDeleteSection,
  sectionId,
}) => {
  const { poll } = usePoll();
  return (
    <div dir="rtl" className="max-w-[720px] mx-auto">
      <div className="bg-white rounded-lg border border-gray-300">
        <div className="h-1" style={{ backgroundColor: poll?.design?.color || "#9333ea" }}></div>

        <div className="p-6 relative">
          <div className="absolute left-6 top-6 z-50">
            <SectionMenu
              sectionId={sectionId}
              onDeleteSection={onDeleteSection}
            />
          </div>
          <FormHeaderEditor
            value={title}
            onChange={onTitleChange}
            placeholder="טופס ללא כותרת"
            isTitle
            fontFamily={poll.design?.header?.fontFamily}
            fontSize={poll.design?.header?.fontSize}
          />
          <FormHeaderEditor
            value={description}
            placeholder="תיאור (אופציונלי)"
            onChange={onDescriptionChange}
          />
        </div>
      </div>
    </div>
  );
};
