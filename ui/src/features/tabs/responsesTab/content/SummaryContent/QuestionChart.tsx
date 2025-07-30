import { FC, useEffect } from "react";
import CustomPieChart from "./charts/PieChart/PieChart";
import RawAnswersList from "./charts/RawAnswersList";
import CheckboxBarChart from "./charts/CheckboxBarChart/CheckboxBarChart";
import BarChart from "./charts/BarChart";
import DateSummaryChart from "./charts/DateSummaryChart";
import { parseDateOptions } from "../shered/parseDateOptions";
import { groupTimesByHour } from "../shered/groupTimesByHour";
import TimeSummaryChart from "./charts/TimeSummaryChart";
import { QuestionType } from "../../../../../types/statisticsType";
// Define QuestionType to match all used string literals
// type QuestionType =
//   | "HEADER"
//   | "MULTIPLE_CHOICE"
//   | "DROPDOWN"
//   | "CHECKBOXES"
//   | "LINEAR_SCALE"
//   | "RATING"
//   | "SHORT_ANSWER"
//   | "PARAGRAPH"
//   | "MULTIPLE_CHOICE_GRID"
//   | "CHECKBOX_GRID"
//   | "DATE"
//   | "TIME";

interface QuestionStatistics {
  type: QuestionType;
  optionAnswerCounts: { option: string; count: number }[];
  totalAnswers?: number;
}

interface QuestionChartProps {
  stats: QuestionStatistics;
  pieResetKey?: number;
  onRendered?: () => void;
}

const QuestionChart: FC<QuestionChartProps> = ({
  stats,
  pieResetKey,
  onRendered,
}) => {
  useEffect(() => {
    if (onRendered) onRendered();
  }, []);
  switch (stats.type) {
    case "MULTIPLE_CHOICE":
    case "DROPDOWN":
      return (
        <CustomPieChart
          data={stats.optionAnswerCounts}
          resetPieKey={pieResetKey}
        />
      );
    case "CHECKBOXES":
      return (
        <CheckboxBarChart
          data={stats.optionAnswerCounts}
          totalAnswers={stats.totalAnswers ?? 0}
        />
      );
    case "LINEAR_SCALE":
      return (
        <BarChart
          data={stats.optionAnswerCounts}
          totalAnswers={stats.totalAnswers ?? 0}
        />
      );
    case "SHORT_ANSWER":
    case "PARAGRAPH":
      return <RawAnswersList answers={stats.optionAnswerCounts} />;
    case "DATE": {
      const dateGroups = parseDateOptions(stats.optionAnswerCounts);
      return (
        <div>
          {dateGroups.map(({ month, year, days }) => (
            <DateSummaryChart
              key={month + year}
              month={month}
              year={year}
              days={days}
            />
          ))}
        </div>
      );
    }
    case "TIME": {
      const timesByHour = groupTimesByHour(stats.optionAnswerCounts);
      return <TimeSummaryChart timesByHour={timesByHour} />;
    }

    default:
      return null;
  }
};

export default QuestionChart;
