import React, { useCallback, useMemo } from "react";
import {
  Plus,
  Type,
  FileInput,
  Image,
  PlaySquare,
  AlignJustify,
} from "lucide-react";
import { useSaveStatus } from "../../../context/SaveStatusContext";
import { QuestionType } from "../../../types/survey";
import { toastService } from "../../../services/toastService";
import { useSidebarStore } from "../../../stores/sidebar";
import { usePoll } from "../../../context/PollContext";

interface SidebarProps {
  sectionId: string | null;
  activeQuestionId: string | null;
  onQuestionAdded: (questionId?: string) => void;
  isImportQuestionsOpen?: boolean;
  setIsImportQuestionsOpen?: (isOpen: boolean) => void;
  setIsPromptSelectorOpen: (isOpen: boolean) => void;
  setIndex?: (index: number) => void;
  setSectionId: (sectionId: string) => void;
  onSectionAdded?: (sectionId?: string) => void;
  createQuestion: (
    sectionId: string,
    options?: { index?: number; type?: QuestionType }
  ) => Promise<string | undefined>;
  createSection: () => Promise<string | undefined>;
}

type Tool = {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({
  sectionId,
  activeQuestionId,
  onQuestionAdded,
  setIsPromptSelectorOpen,
  setIndex,
  setSectionId,
  onSectionAdded,
  createQuestion,
  createSection,
}) => {
  const { setSaveStatus } = useSaveStatus();
  const { setTarget } = useSidebarStore();
  const { poll } = usePoll();

  const currentIndex = useMemo(() => {
    if (!poll?.sections?.length || !sectionId) return 0;

    const section = poll.sections.find((s) => s._id === sectionId);
    if (!section || !section.questions?.length) return 0;

    const index = activeQuestionId
      ? section.questions.findIndex((q) => q._id === activeQuestionId)
      : -1;

    return index === -1 ? section.questions.length : index + 1;
  }, [poll, sectionId, activeQuestionId]);

  const handleAddSection = useCallback(async () => {
    try {
      const id = await createSection();
      setSaveStatus("saved", "הקטע נוסף");
      if (onSectionAdded && id) onSectionAdded(id);
    } catch {
      setSaveStatus("error", "שגיאה בהוספת קטע");
    }
  }, [createSection, onSectionAdded, setSaveStatus]);

  const focusNewQuestion = (id: string | undefined) => {
    if (!id) return;

    const trySetTarget = () => {
      const el = document.getElementById(`question-${id}`);
      if (el) {
        setTarget(el);
        observer.disconnect();
      }
    };

    const observer = new MutationObserver(trySetTarget);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    trySetTarget();

    onQuestionAdded(id);
  };

  const tools: Tool[] = [
    {
      icon: <Plus className="w-5 h-5" />,
      title: "הוספת שאלה",
      onClick: async () => {
        const id = await createQuestion(sectionId!, {
          index: currentIndex,
          type: "MULTIPLE_CHOICE",
        });
        focusNewQuestion(id);
      },
    },
    {
      icon: <FileInput className="w-5 h-5" />,
      title: "Import questions",
      onClick: () => {
        setIsPromptSelectorOpen(true);
        setIndex?.(currentIndex);
        setSectionId?.(sectionId!);
      },
    },
    {
      icon: <Type className="w-5 h-5" />,
      title: "Add title and description",
      onClick: async () => {
        const id = await createQuestion(sectionId!, {
          index: currentIndex,
          type: "HEADER",
        });
        focusNewQuestion(id);
      },
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: "Add image",
      onClick: () => toastService.info("בקרוב..."),
    },
    {
      icon: <PlaySquare className="w-5 h-5" />,
      title: "Add video",
      onClick: () => toastService.info("בקרוב..."),
    },
    {
      icon: <AlignJustify className="w-5 h-5" />,
      title: "הוספת קטע",
      onClick: handleAddSection,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-0.5">
      {tools.map((tool, index) => (
        <button
          key={index}
          onClick={tool.onClick}
          className="block w-full p-2.5 hover:bg-gray-100 rounded transition-colors group relative"
          title={tool.title}
        >
          {tool.icon}
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {tool.title}
          </span>
        </button>
      ))}
    </div>
  );
};
