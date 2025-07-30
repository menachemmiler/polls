import React, { TextareaHTMLAttributes, useRef } from "react";
import clsx from "clsx";

type ParagraphInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

const ParagraphRespons: React.FC<ParagraphInputProps> = ({
  className,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      onInput={handleInput}
      className={clsx(paragraphInputStyles, className)}
      {...props}
    />
  );
};

export default ParagraphRespons;

const paragraphInputStyles = clsx(
  "w-full",
  "pt-5",
  "border-b",
  "focus:border-b-2",
  "border-gray-300",
  "text-gray-800",
  "placeholder-gray-600",
  "focus:outline-none",
  "focus:border-transparent",
  "relative",
  "transition-all",
  "duration-200",
  "break-words",
  "resize-none",
  "overflow-hidden",
  "[background-image:linear-gradient(to_right,theme(colors.purple.600)_0%,theme(colors.purple.600)_100%)]",
  "bg-no-repeat",
  "bg-bottom",
  "bg-[length:0%_2px]",
  "focus:bg-[length:100%_2px]",
  "px-0",
  "py-0"
);
