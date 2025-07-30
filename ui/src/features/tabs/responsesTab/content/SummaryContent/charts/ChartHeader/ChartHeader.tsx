import { FC, useEffect } from "react";
import ChartResponses from "./ChartResponses";
import CopyChartBtn from "./CopyChartBtn";

interface ChartHeaderProps {
  title: string;
  responsesCount: number;
  copyFeedback?: boolean;
  onCopyChart?: () => void;
  btnId?: string;
  showCopyButton?: boolean;
  onRendered?: () => void;
}

const ChartHeader: FC<ChartHeaderProps> = ({
  title,
  responsesCount,
  onCopyChart,
  btnId,
  showCopyButton = true,
  onRendered = () => {},
}) => {
  useEffect(() => {
    if (onRendered) onRendered();
  }, []);
  return (
    <div className="flex items-center justify-between w-full bg-white rounded-t-xl">
      <ChartResponses title={title} responsesCount={responsesCount} />
      {showCopyButton && (
        <CopyChartBtn onCopyChart={onCopyChart} btnId={btnId} />
      )}
    </div>
  );
};

export default ChartHeader;
