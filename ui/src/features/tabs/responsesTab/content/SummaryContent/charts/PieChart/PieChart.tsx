import React from "react";
import PieSection from "./PieSection";

type PieChartData = {
  option: string;
  count: number;
};

interface PieChartProps {
  data: PieChartData[];
  resetPieKey?: number; 
}

const PieChart: React.FC<PieChartProps> = ({ data, resetPieKey }) => {
  return (
    <div className="flex justify-center bg-white w-full mx-auto">
      <PieSection data={data} resetSelectionKey={resetPieKey} />
    </div>
  );
};

export default PieChart;
