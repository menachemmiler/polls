import React from "react";
import { FormattingButton } from "./FormattingButton";
import { Editor } from "@tiptap/react";

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Link2,
  Type,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor;
  onLinkClick: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onLinkClick,
}) => {
  const iconSize = "w-5 h-5";
  const stroke = 3;

  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <FormattingButton
        icon={<BoldIcon className={iconSize} strokeWidth={stroke} />}
        tooltip="מודגש"
        onAction={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      />
      <FormattingButton
        icon={<ItalicIcon className={iconSize} strokeWidth={stroke} />}
        tooltip="נטוי"
        onAction={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      />
      <FormattingButton
        icon={<UnderlineIcon className={iconSize} strokeWidth={stroke} />}
        tooltip="קו תחתון"
        onAction={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
      />
      <FormattingButton
        icon={<Link2 className={iconSize} strokeWidth={stroke} />}
        tooltip="הוספת קישור"
        onAction={onLinkClick}
        isActive={editor.isActive("link")}
      />
      <FormattingButton
        icon={
          <div className="relative">
            <Type className={iconSize} strokeWidth={stroke} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-current transform rotate-45" />
            </div>
          </div>
        }
        tooltip="הסרת עיצוב"
        onAction={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
      />
    </div>
  );
};
