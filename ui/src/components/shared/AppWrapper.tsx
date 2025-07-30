import clsx from "clsx";
import type { PageWrapperProps } from "../../types/warperType";

const AppWrapper = ({ children, className }: PageWrapperProps) => {
  const pageWrapperClass = clsx(
    "flex",
    "flex-col",
    "items-center",
    "min-h-screen",
    "bg-accent",
    // "px-1",
    // "sm:px-6",
    // "md:px-8",
    // "xl:px-0",
    className
  );

  const contentClass = clsx("w-full", "max-w-screen");

  return (
    <div className={pageWrapperClass}>
      <div className={contentClass}>{children}</div>
    </div>
  );
};

export default AppWrapper;
