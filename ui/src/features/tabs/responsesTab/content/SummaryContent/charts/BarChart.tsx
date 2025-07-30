import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import CustomTooltip from "./CheckboxBarChart/CustomTooltip";
import CustomBarLabel from "./CheckboxBarChart/CustomBarLabel";

type VerticalBarChartData = { option: string; count: number };

interface VerticalBarChartProps {
  data: VerticalBarChartData[];
  totalAnswers: number;
  resetKey?: number;
}

const COLORS: string[] = ["#673ab7"];

const VerticalBarChart: React.FC<VerticalBarChartProps> = ({
  data,
  totalAnswers,
  resetKey,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  React.useEffect(() => {
    setHoveredIdx(null);
    setSelectedIdx(null);
  }, [resetKey]);

  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item, index) => ({
      ...item,
      color: item.count === 0 ? "#ddd" : COLORS[index % COLORS.length],
      index,
    }));
  }, [data]);

  const barWidth = useMemo(() => {
    const CHART_WIDTH = 390 - 24;
    const N = processedData.length || 1;
    return Math.max(16, Math.min(80, (CHART_WIDTH / N) * 0.97));
  }, [processedData.length]);

  const maxCount = useMemo(() => {
    if (!processedData.length) return 0;
    return Math.max(...processedData.map((item) => item.count));
  }, [processedData]);

  return (
    <div
      className="w-full bg-white max-h-[280px]"
      style={{
        height: 280,
        minWidth: 390,
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          layout="horizontal"
          margin={{ top: 36, right: 12, left: 12, bottom: 0 }}
          barCategoryGap={4}
          barGap={0}
        >
          <CartesianGrid
            stroke="#ded9d9"
            strokeWidth={1.5}
            horizontal={true}
            vertical={false}
          />

          {Array.from({ length: maxCount }, (_, i) => (
            <ReferenceLine
              key={`half-row-${i}`}
              y={i + 0.5}
              stroke="#ded9d9"
              strokeWidth={1}
              ifOverflow="extendDomain"
            />
          ))}

          <XAxis
            type="category"
            dataKey="option"
            tick={{ fontSize: 13, fill: "#222", fontFamily: "Arial" }}
            axisLine={{ stroke: "#222", strokeWidth: 2 }}
            tickLine={false}
            interval={0}
          />

          <YAxis
            type="number"
            domain={[0, maxCount]}
            allowDecimals={false}
            tick={{ fontSize: 13, fill: "#000", fontFamily: "Arial" }}
            axisLine={{ stroke: "#cdcccf", strokeWidth: 3 }}
            tickLine={false}
            interval={0}
            ticks={Array.from({ length: maxCount + 1 }, (_, i) => i)}
          />

          <Tooltip
            isAnimationActive={false}
            content={<CustomTooltip total={totalAnswers} />}
            cursor={{ fill: "rgba(51, 102, 204, 0.09)" }}
          />

          <Bar
            dataKey="count"
            label={(props) => (
              <CustomBarLabel
                {...props}
                totalAnswers={totalAnswers}
                insideBar={barWidth > 40}
                viewBox={props.viewBox}
              />
            )}
            barSize={barWidth}
            animationDuration={250}
            isAnimationActive={false}
            onMouseEnter={(_data, index) => setHoveredIdx(index)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={(_data, index) =>
              setSelectedIdx(selectedIdx === index ? null : index)
            }
          >
            {processedData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                opacity={1}
                style={{
                  cursor: "pointer",
                  stroke: hoveredIdx === index ? "#673ab7" : "none",
                  strokeWidth: hoveredIdx === index ? 3 : 0,
                  filter:
                    hoveredIdx === index
                      ? "drop-shadow(0 0 6px #b39ddb60)"
                      : "none",
                  transition: "stroke-width 0.12s, filter 0.18s",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VerticalBarChart;
