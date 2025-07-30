import { FC } from "react";

interface DateSummaryChartProps {
  month: string;
  year: number;
  days: number[];
}

const DateSummaryChart: FC<DateSummaryChartProps> = ({ month, year, days }) => {
  return (
    <div className="flex w-full pl-10 min-h-[44px]">
      <div className="flex flex-row w-full">
        <div className="flex flex-col items-end min-w-[80px] px-2 h-full justify-center">
          <span className="font-normal text-black text-[15px] w-[85px] leading-4 px-3 py-2 h-full items-center flex flex-row justify-between">
            {month} <span className="mr-1">{year}</span>
          </span>
        </div>
        <div className="flex gap-2 items-center pr-4 w-full min-h-[32px] border-r border-[#232235]">
          {days.map((d) => (
            <span
              key={d}
              className="bg-[#ede7f6] text-[#222] font-normal px-3 py-0.5 rounded-full text-[14px] shadow-sm whitespace-nowrap min-w-[38px] inline-flex justify-center items-center"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateSummaryChart;
