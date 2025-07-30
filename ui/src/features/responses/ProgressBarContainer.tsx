import clsx from "clsx";

const progressBarContainer = clsx(
  "w-1/2",
  "bg-gray-500",
  "h-2",
  "rounded-lg",
);

const progressBarBaseInner = clsx(
  "h-2",
  "transition-all",
  "duration-300",
  "rounded-lg"
);

interface Props {
  progress: number;
}

const ProgressBarContainer = ({ progress }: Props) => {
  const progressColorClass = progress === 100 ? "bg-green-500" : "bg-blue-500";

  return (
    <div className={progressBarContainer}>
      <div
        className={clsx(progressBarBaseInner, progressColorClass)}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBarContainer;
