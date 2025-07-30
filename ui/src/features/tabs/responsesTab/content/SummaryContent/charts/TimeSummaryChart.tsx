import { FC } from "react";

interface TimeSummaryChartProps {
  timesByHour: Record<string, string[]>;
}

const TimeSummaryChart: FC<TimeSummaryChartProps> = ({ timesByHour }) => {
  const hours = Object.keys(timesByHour)
    .filter((h) => timesByHour[h]?.length)
    .sort();

  return (
    <div className="flex w-full my-2 pb-4 pr-15 min-h-[44px] overflow-hidden">
      <div className="flex flex-col items-end min-w-[50px] ml-2 gap-3 pt-1">
        {hours.map((hour) => (
          <div key={hour} className="flex items-center h-7 min-h-[28px] gap-1">
            <span className="font-normal text-black text-[15px]">{hour}</span>
            <span className="mx-[1px] text-black text-[16px] font-bold">:</span>
            <span className="inline-block w-[22px] h-1 bg-[#4d2b87] rounded mt-[5px] align-bottom"></span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 pt-1 w-full min-w-0 pr-4 border-r border-[#232235] overflow-hidden">
        {hours.map((hour) => (
          <div key={hour} className="flex gap-1 h-7 items-center flex-nowrap">
            {timesByHour[hour]?.map((minute, idx) => (
              <span
                key={minute + idx}
                className="bg-[#ede7f6] text-[#222] font-normal px-3 py-0.5 rounded-full text-[14px] shadow-sm whitespace-nowrap min-w-[38px] inline-flex justify-center items-center"
              >
                {hour}:{minute}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSummaryChart;
