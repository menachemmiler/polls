import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import { toastService } from "../../services/toastService";

type ButtonVariant = "primary" | "secondary" | "transparent" | "disabled";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: ButtonVariant;
  customColor?: string;
}

const FormButton = ({
  text,
  variant = "secondary",
  disabled,
  customColor,
  ...props
}: ButtonProps & { customColor?: string }) => {
  const buttonClasses = clsx(
    baseButtonClasses,
    disabled ? buttonVariants["disabled"] : buttonVariants[variant]
  );

  return (
    <button
      {...props}
      disabled={disabled}
      className={buttonClasses}
      style={props.type === "submit" ? { backgroundColor: customColor } : {color: customColor}}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          toastService.error("מצב תצוגה מקדימה - לא ניתן לשלוח");
        } else {
          props.onClick?.(e);
        }
      }}
    >
      {text}
    </button>
  );
};

export default FormButton;

const buttonVariants: Record<ButtonVariant, string> = {
  primary: clsx(
    "bg-purple-700",
    "text-white",
    "hover:bg-purple-400",
    "dark:bg-purple-700",
    "dark:hover:bg-purple-700",
  ),
  secondary: clsx(
    "text-purple-600",
    "bg-white",
    "border",
    "border-gray-300",
    "focus:outline-none",
    "hover:bg-gray-100",
    "focus:ring-4",
    "focus:ring-gray-100",
    "dark:bg-gray-800",
    "dark:text-white",
    "dark:border-gray-600",
    "dark:hover:bg-gray-700",
    "dark:hover:border-gray-600",
    "dark:focus:ring-gray-700"
  ),
  transparent: clsx(
    "text-purple-600",
    "bg-transparent",
    "hover:bg-purple-200",
    "active:bg-purple-300"
  ),
  disabled: clsx("bg-gray-300", "text-gray-600", "cursor-not-allowed"),
};
const baseButtonClasses = clsx(
  "font-medium",
  "rounded-lg",
  "text-sm",
  "px-5",
  "py-2.5",
  "me-2",
  "mb-2"
);
