import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TurndownService from "turndown";
import { marked } from "marked";
import { EditorToolbar } from "../../features/tabs/questionsTab/questionCard/toolBar/EditorToolbar";

interface FormFieldEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isTitle?: boolean;
  fontSize?: number;
  fontFamily?: string;
}

export const FormHeaderEditor: React.FC<FormFieldEditorProps> = ({
  value,
  onChange,
  placeholder = "",
  isTitle = false,
  fontSize,
  fontFamily,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const turndownService = new TurndownService();
  turndownService.addRule("preserveUnderline", {
    filter: "u",
    replacement: (content) => `<u>${content}</u>`,
  });

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: marked(value),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
      onChange(markdown);
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative w-full">
        <EditorContent
          editor={editor}
          onFocus={() => setShowToolbar(true)}
          onBlur={() =>
            setTimeout(() => {
              const container = containerRef.current;
              if (container && container.contains(document.activeElement))
                return;
              setShowToolbar(false);
            }, 150)
          }
          className={`
    w-full py-2 px-0 border-b-2 border-gray-300 focus:border-purple-700 transition-colors
    ${isTitle ? "font-normal" : "text-base mt-2"}
    [&_.ProseMirror]:outline-none
  `}
          style={{
            fontFamily: fontFamily || "Arial",
            fontSize: fontSize || (isTitle ? 24 : 16),
          }}
        />
        <span
          className={`
            absolute bottom-0 left-0 h-0.5 bg-purple-700 w-full
            transform transition-transform duration-150 ease-out
            ${showToolbar ? "scale-x-100" : "scale-x-0"}
          `}
        />
      </div>

      <div
        className={`
          transition-all duration-200 ease-out overflow-hidden
          ${showToolbar ? "max-h-20 opacity-100 mt-1" : "max-h-0 opacity-0"}
        `}
      >
        <EditorToolbar editor={editor} onLinkClick={() => {}} />
      </div>
    </div>
  );
};
