import React from "react";
import { PieLabelRenderProps } from "recharts";

const PiePercentLabel: React.FC<PieLabelRenderProps> = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.7;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight="regular"
      pointerEvents="none"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

export default PiePercentLabel;
