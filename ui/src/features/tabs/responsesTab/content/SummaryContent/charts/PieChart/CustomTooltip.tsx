import React from "react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      option: string;
      count: number;
    };
  }>;
  total?: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, total }) => {
  if (active && payload && payload.length > 0 && total && total > 0) {
    const entry = payload[0].payload;
    const percent = (entry.count / total) * 100;
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          padding: 8,
          fontSize: 14,
          borderRadius: 3,
          direction: "rtl",
          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        }}
      >
        <div style={{ fontWeight: 500 }}>{entry.option}</div>
        <div>
          {entry.count} ({percent.toFixed(0)}%)
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
