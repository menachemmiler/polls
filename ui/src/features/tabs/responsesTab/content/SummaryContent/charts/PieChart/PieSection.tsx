import React, { useState, useMemo, useEffect } from "react";
import {
  PieChart, ResponsiveContainer, Tooltip, Legend
} from "recharts";
import PieLayer from "./PieLayer";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";
import PiePercentLabel from "./PiePercentLabel";

const COLORS = [
  "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6",
];

type PieChartData = { option: string; count: number };
interface PieSectionProps { data: PieChartData[]; }

const OUTLINE_OPACITY = 0.5;
const OUTLINE_RADIUS_INCREASE = 8;
const PIE_RADIUS = 85;
const SELECTED_RING_WIDTH = 4;

function mergePieChartData(data: PieChartData[]): PieChartData[] {
  const map = new Map<string, number>();
  data.forEach(({ option, count }) => {
    map.set(option, (map.get(option) || 0) + count);
  });
  return Array.from(map, ([option, count]) => ({ option, count }));
}

interface PieSectionProps {
  data: PieChartData[];
  resetSelectionKey?: number;
}

const PieSection: React.FC<PieSectionProps> = ({ data, resetSelectionKey }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    setHoveredIdx(null);
    setSelectedIdx(null);
  }, [resetSelectionKey]);

  const mergedData = useMemo(
    () => mergePieChartData(data).filter((d) => d.count > 0), 
    [data]
  );
  const total = useMemo(
    () => mergedData.reduce((sum, d) => sum + d.count, 0), 
    [mergedData]
  );
  const optionToIndex = useMemo(
    () => new Map(mergedData.map((d, i) => [d.option, i])),
    [mergedData]
  );

  const handlePieSelect = (idx: number) => setSelectedIdx(selectedIdx === idx ? null : idx);
  const handleLegendSelect = (option: string | null) => {
    const idx = option != null ? optionToIndex.get(option) ?? null : null;
    setSelectedIdx(selectedIdx === idx ? null : idx);
  };

  return (
    <div style={{ width: 400, height: 220 }} onMouseLeave={() => setHoveredIdx(null)}>
      <ResponsiveContainer width="100%" height="100%" className="no-border">
        <PieChart className="no-border">
          <PieLayer
            data={mergedData}
            dataKey="count"
            nameKey="option"
            cx="50%" cy="46%"
            outerRadius={PIE_RADIUS + OUTLINE_RADIUS_INCREASE}
            innerRadius={PIE_RADIUS}
            colors={COLORS}
            getCellProps={(idx) => ({
              opacity: hoveredIdx === idx ? OUTLINE_OPACITY : 0,
              style: { transition: "opacity 120ms", pointerEvents: "none" },
            })}
          />
          <PieLayer
            data={mergedData}
            dataKey="count"
            nameKey="option"
            cx="50%" cy="46%"
            outerRadius={PIE_RADIUS + SELECTED_RING_WIDTH}
            innerRadius={PIE_RADIUS}
            colors={COLORS}
            getCellProps={(idx) => ({
              opacity: selectedIdx === idx ? 1 : 0,
              style: { transition: "opacity 120ms", pointerEvents: "none" },
            })}
          />
          <PieLayer
            data={mergedData}
            dataKey="count"
            nameKey="option"
            cx="50%" cy="46%"
            outerRadius={PIE_RADIUS - 0.1}
            colors={COLORS}
            getCellProps={(idx) => ({
              onMouseEnter: () => setHoveredIdx(idx),
              onMouseLeave: () => setHoveredIdx(null),
              onClick: () => handlePieSelect(idx),
              style: { cursor: "pointer" },
            })}
            className="outline-none overflow-hidden"
            labelLine={false}
            legendType="circle"
            stroke="#fff"
            label={(props) => (
              <PiePercentLabel {...props} fill={COLORS[props.index ?? 0]} />
            )}
          />
          <Tooltip
            isAnimationActive={false}
            content={<CustomTooltip total={total} />}
          />
          <Legend
            layout="vertical"
            align="right"
            iconSize={9}
            content={(props) => (
              <CustomLegend
                {...props}
                optionToIndex={optionToIndex}
                onItemHover={(option) =>
                  setHoveredIdx(option != null ? optionToIndex.get(option) ?? null : null)
                }
                onItemClick={handleLegendSelect}
                payload={
                  props.payload
                    ? props.payload.map((entry) => ({
                        ...entry,
                        value: entry.value === undefined ? "" : entry.value,
                      }))
                    : undefined
                }
                selectedOption={
                  selectedIdx != null
                    ? mergedData[selectedIdx]?.option
                    : undefined
                }
              />
            )}
            wrapperStyle={{
              marginLeft: 16,
              lineHeight: "20px",
              height: "85%",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieSection;
