import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const ShortAnswerRespons: React.FC<TextInputProps> = ({
  className,
  ...props
}) => {
  return <input className={clsx(textInputStyles, className)} {...props} />;
};

export default ShortAnswerRespons;

const textInputStyles = clsx(
  "w-1/2",
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
  "[background-image:linear-gradient(to_right,theme(colors.purple.600)_0%,theme(colors.purple.600)_100%)]",
  "bg-no-repeat",
  "bg-bottom",
  "bg-[length:0%_2px]",
  "focus:bg-[length:100%_2px]",
  "px-0",
  "py-0"
);
