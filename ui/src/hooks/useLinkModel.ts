import { useState } from "react";
import { Editor } from "@tiptap/react";

export const useLinkModal = (editor: Editor) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({ url: "", text: "" });

  const open = (url: string, text: string) => {
    setData({ url, text });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const submit = (url: string, text: string) => {
    if (!editor) return;

    const selection = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(
      selection.from,
      selection.to
    );

    if (text && !selectedText) {
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${text}</a>`
        )
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }

    close();
  };

  return { isOpen, data, open, close, submit };
};
