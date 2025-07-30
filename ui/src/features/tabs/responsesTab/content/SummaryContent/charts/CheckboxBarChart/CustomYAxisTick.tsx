import React from "react";

interface CustomYAxisTickProps {
  x?: number;
  y?: number;
  payload?: { value?: string };
}

const CustomYAxisTick: React.FC<CustomYAxisTickProps> = ({ x = 0, y = 0, payload }) => {
  if (!payload || !payload.value) return null;
  const maxLength = 15;
  const text = String(payload.value);
  const displayText =
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-50}
        y={0}
        dy={6}
        textAnchor="end"
        fill="#222"
        fontSize={12}
        fontFamily="Arial, sans-serif"
        style={{ fontWeight: 400 }}
      >
        {displayText}
      </text>
    </g>
  );
};

export default CustomYAxisTick;
