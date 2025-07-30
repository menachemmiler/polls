import clsx from "clsx";
import type React from "react";
import ProgressBarContainer from "./ProgressBarContainer";
import Button from "./FormButton";

const navigationButtons = clsx(
  "flex",
  "justify-between",
  "items-center",
  "mt-8"
);

interface Props {
  children: React.ReactNode;
  progress: number;
  currentPage?: number;
  totalPages?: number;
  handleReset: () => void;
}

const NavigationButtons = ({
  children,
  progress,
  currentPage,
  totalPages,
  handleReset,
}: Props) => {
  return (
    <div className={navigationButtons}>
      <div>{children}</div>
      {totalPages! > 1 && (
        <div className="flex gap-3 items-center w-1/2">
          דף {currentPage} מתוך {totalPages}
          <ProgressBarContainer progress={progress} />
        </div>
      )}
      <Button
        type="reset"
        text="נקה טופס"
        variant="transparent"
        onClick={handleReset}
      />
    </div>
  );
};

export default NavigationButtons;
