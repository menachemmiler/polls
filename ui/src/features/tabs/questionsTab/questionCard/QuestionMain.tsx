import React from "react";
import { GripHorizontal } from "lucide-react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { QuestionEditor } from "./toolBar/QuestionEditor";
import { Question } from "../../../../types/survey";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

interface QuestionHeaderProps {
  question: Question;
  isActive: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  onUpdate: (question: Question) => void;
}

export const QuestionMain: React.FC<QuestionHeaderProps> = ({
  question,
  isActive,
  dragHandleProps,
  onUpdate,
}) => {
  const editorRef = React.useRef<Editor | null>(null);

  const readOnlyEditor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
  });

  React.useEffect(() => {
    const editor = editorRef.current;
    if (editor && question.title !== editor.getHTML()) {
      editor.commands.setContent(question.title || "Question");
    }
  }, [question.title]);

  return (
    <div className="relative mb-4 w-full">
      <div
        {...dragHandleProps}
        className={`absolute top-[-20px] left-1/2 -translate-x-1/2 h-10 flex justify-center items-center cursor-move ${
          isActive ? "opacity-100" : "opacity-30 hover:opacity-60"
        }`}
      >
        <GripHorizontal className="w-6 h-6 text-gray-400" />
      </div>

      <div className="flex items-start gap-4 pt-10">
        <div className="flex-1">
          {isActive ? (
            <QuestionEditor
              value={question.title || ""}
              onChange={(title) =>
                onUpdate({
                  ...question,
                  title: title.replace(/<[^>]+>/g, "").trim(),
                })
              }
              placeholder="שאלה"
            />
          ) : (
            <EditorContent editor={readOnlyEditor} />
          )}
        </div>
      </div>

      {question.description && (
        <div className="mt-2 text-sm text-gray-600">{question.description}</div>
      )}
    </div>
  );
};
