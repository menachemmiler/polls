import React from "react";

interface CustomBarLabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
  totalAnswers: number;
  insideBar?: boolean;
  viewBox?: { y?: number; height?: number };
  orientation?: "horizontal" | "vertical";
}

const CustomBarLabel: React.FC<CustomBarLabelProps> = ({
  x,
  y,
  width,
  height,
  value,
  totalAnswers,
  insideBar = false,
  viewBox,
  orientation = "horizontal",
}) => {
  if (
    typeof x !== "number" ||
    typeof width !== "number" ||
    typeof y !== "number" ||
    typeof height !== "number" ||
    typeof value !== "number" ||
    !totalAnswers
  )
    return null;

  const percent = (value / totalAnswers) * 100;
  const labelText = `(${percent.toFixed(1)}%) ${value}`;

  if (value === 0) {
    if (orientation === "horizontal") {
      const barCenter = y + height / 2;
      const start = x + width / 2;
      return (
        <>
          <line
            x1={start}
            x2={start + 7}
            y1={barCenter}
            y2={barCenter}
            stroke="#222"
            strokeWidth={2}
            opacity={0.75}
          />
          <text
            x={start + 35}
            y={barCenter + 5}
            fill="#222"
            fontSize={13}
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
            fontWeight={600}
            style={{
              pointerEvents: "none",
              userSelect: "none",
              paintOrder: "stroke fill",
            }}
          >
            {labelText}
          </text>
        </>
      );
    } else {
      const barCenter = x + width / 2;
      const chartTop = viewBox?.y ?? 0;
      const chartHeight = viewBox?.height ?? 220;
      return (
        <>
          <line
            x1={barCenter}
            x2={barCenter}
            y1={chartTop}
            y2={chartTop + chartHeight - 10}
            stroke="#222"
            strokeWidth={2}
            opacity={0.75}
          />
          <text
            x={barCenter}
            y={chartTop - 14}
            fill="#222"
            fontSize={13}
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
            fontWeight={600}
            style={{
              pointerEvents: "none",
              userSelect: "none",
              paintOrder: "stroke fill",
            }}
          >
            {labelText}
          </text>
        </>
      );
    }
  }

  return (
    <text
      x={insideBar ? x + width / 2 : x + width + 65}
      y={y + height / 2}
      dy={5}
      fill={insideBar ? "#fff" : "#333"}
      fontSize={13}
      fontFamily="Arial, sans-serif"
      textAnchor={insideBar ? "middle" : "start"}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        filter: insideBar ? "drop-shadow(0 1px 3px #673ab7cc)" : "none",
        paintOrder: "stroke fill",
      }}
    >
      {labelText}
    </text>
  );
};

export default CustomBarLabel;
