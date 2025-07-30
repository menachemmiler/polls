import React, { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { usePoll } from "../../context/PollContext";

interface Props {
  text: string;
}

export const MarkdownText: React.FC<Props> = ({ text }) => {
  const [html, setHtml] = useState<string>("");
  const { poll } = usePoll();
  const design = poll?.design;

  useEffect(() => {
    const convertMarkdown = async () => {
      const dirty = await marked.parse(text || "", { breaks: true });
      const clean = DOMPurify.sanitize(dirty);
      setHtml(clean);
    };

    convertMarkdown();
  }, [text]);

  return (
    <div
      className="
        max-w-full space-y-3
        [&_a]:text-blue-600 [&_a]:underline [&_a]:font-medium
        [&_ul]:list-disc [&_ul]:ps-5
        [&_ol]:list-decimal [&_ol]:ps-5
        [&_li]:mb-1
        [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
        [&_pre]:bg-gray-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre>code]:bg-transparent
        [&_blockquote]:border-s-4 [&_blockquote]:border-gray-400 [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:text-gray-600
      "
      style={{
        fontFamily: design?.questions?.fontFamily,
        fontSize: `${design?.questions?.fontSize}px`,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
