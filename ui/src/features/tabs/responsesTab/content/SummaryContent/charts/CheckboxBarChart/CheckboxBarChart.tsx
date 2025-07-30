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
import { getBarHeight } from "./utils";
import CustomYAxisTick from "./CustomYAxisTick";
import CustomTooltip from "./CustomTooltip";
import CustomBarLabel from "./CustomBarLabel";

type HorizontalBarChartData = { option: string; count: number };

interface HorizontalBarChartProps {
  data: HorizontalBarChartData[];
  totalAnswers: number;
  resetKey?: number;
}

const COLORS: string[] = ["#673ab7"];

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
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

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const barHeight = getBarHeight(processedData.length);

  return (
    <div
      className="w-full bg-white"
      style={{
        height: Math.max(260, processedData.length * (barHeight + 10) + 60),
        minWidth: 390,
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 16, right: 80, left: 36, bottom: 16 }}
          barCategoryGap={16}
        >
          <CartesianGrid stroke="#ffff" horizontal={false} vertical />
          {Array.from({ length: maxCount }, (_, i) => (
            <ReferenceLine
              key={`half-grid-${i}`}
              x={i + 0.5}
              stroke="#d4cfcf"
              strokeWidth={1}
              ifOverflow="extendDomain"
            />
          ))}

          <XAxis
            type="number"
            domain={[0, maxCount]}
            tick={{ fontSize: 13, fill: "#000", fontFamily: "Arial" }}
            axisLine={{ stroke: "#cdcccf", strokeWidth: 3 }}
            tickLine={false}
            interval={0}
            ticks={Array.from({ length: maxCount + 1 }, (_, i) => i)}
          />

          <YAxis
            type="category"
            dataKey="option"
            tick={<CustomYAxisTick />}
            width={110}
            axisLine={{ stroke: "#222", strokeWidth: 2 }}
            tickLine={false}
            interval={0}
          />

          <Tooltip
            isAnimationActive={false}
            content={<CustomTooltip total={totalAnswers} />}
            cursor={{ fill: "#ffff" }}
          />

          <Bar
            dataKey="count"
            minPointSize={2}
            label={(props) => (
              <CustomBarLabel
                {...props}
                totalAnswers={totalAnswers}
                orientation="horizontal"
              />
            )}
            barSize={barHeight}
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
                key={entry.option ?? index}
                fill={entry.color}
                opacity={
                  selectedIdx === index ? 0.8 : hoveredIdx === index ? 0.9 : 1
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalBarChart;
