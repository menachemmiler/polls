import React, { useState, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./EditorToolbar";
import { LinkModal } from "./LinkModal";
import { useLinkModal } from "../../../../../hooks/useLinkModel";
import TurndownService from "turndown";
import { marked } from "marked";

interface QuestionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  value,
  onChange,
  placeholder = "Question",
}) => {
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const linkModal = useLinkModal(editorInstance as Editor);

  const htmlFromMarkdown = marked(value);

  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });

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
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: htmlFromMarkdown,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
      onChange(markdown);
    },
    onCreate: ({ editor }) => setEditorInstance(editor),
  });

  const handleLinkClick = () => {
    if (!editorInstance) return;

    const sel = editorInstance.state.selection;
    const selectedText = editorInstance.state.doc.textBetween(sel.from, sel.to);
    const previousUrl = editorInstance.getAttributes("link").href || "";
    linkModal.open(previousUrl, selectedText);
  };

  const handleFocus = () => setShowToolbar(true);

  const handleBlur = () => {
    setTimeout(() => {
      const container = containerRef.current;
      if (container && container.contains(document.activeElement)) return;
      setShowToolbar(false);
    }, 100);
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col w-full gap-2" ref={containerRef}>
      <div className="relative w-full">
        <EditorContent
          editor={editor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full text-base bg-gray-50 py-3 px-4 transition-colors
            border-b-2 border-black
            [&_.ProseMirror]:outline-none
            [&_.ProseMirror]:break-all
            [&_.ProseMirror]:overflow-x-hidden
          `}
        />
        <span
          className={`
            absolute bottom-0 left-0 h-0.5 bg-purple-800 w-full
            origin-center transform
            transition-transform duration-150 ease-out
            ${showToolbar ? "scale-x-100" : "scale-x-0"}
          `}
        />
      </div>
      <div
        className={`
          transition-all duration-200 
          ${showToolbar ? "max-h-20 opacity-100 mt-0" : "max-h-0 opacity-0"}
        `}
      >
        {editorInstance && (
          <EditorToolbar
            editor={editorInstance}
            onLinkClick={handleLinkClick}
          />
        )}
      </div>
      <LinkModal
        isOpen={linkModal.isOpen}
        onClose={linkModal.close}
        onSubmit={linkModal.submit}
        initialUrl={linkModal.data.url}
        initialText={linkModal.data.text}
      />
    </div>
  );
};
