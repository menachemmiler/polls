import React from "react";
import { MarkdownText } from "../../../../../../../components/shared/MarkdownText";

interface ChartResponsesProps {
  title: string;
  responsesCount: number;
}

const ChartResponses: React.FC<ChartResponsesProps> = ({
  title,
  responsesCount,
}) => (
  <div className="pb-2">
    <div className="text-[17px] leading-[24px] text-[#222] mb-1">
      <MarkdownText text={title || ""} />
    </div>
    <div className="text-[13px] leading-[18px] text-[#5f6368]">
      {responsesCount} תגובות
    </div>
  </div>
);

export default ChartResponses;
