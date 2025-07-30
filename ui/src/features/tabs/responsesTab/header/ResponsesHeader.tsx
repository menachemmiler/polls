import { FC } from "react";
import LinkToSheetsButton from "./LinkToSheetsButton";
import MenuDots from "./MenuDots";
import StatisticsTabs from "./StatisticsTabs";
import QuestionSelector from "../content/QuestionContent/QuestionSelector";
import IndividualSelector from "../content/IndividualContent/IndividualSelector";
import { useSurveyData } from "../../../../context/responsesContext";

type TabType = "summary" | "question" | "individual";

type Props = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  questionIdx: number;
  setQuestionIdx: React.Dispatch<React.SetStateAction<number>>;
  individualIdx: number;
  setIndividualIdx: React.Dispatch<React.SetStateAction<number>>;
  onLinkToSheets?: () => void;
  onMenu?: () => void;
};

const ResponsesHeader: FC<Props> = ({
  activeTab,
  onTabChange,
  questionIdx,
  setQuestionIdx,
  individualIdx,
  setIndividualIdx,
  onLinkToSheets,
  onMenu,
}) => {
  // קח את כל מה שצריך מהקונטקסט
  const surveyData = useSurveyData();
  const responders = surveyData?.responders ?? [];
  const sections = surveyData?.sections ?? [];

  // רשימה שטוחה של כל השאלות (כולל מספר תגובות וכו')
  const allQuestions = sections.flatMap(section =>
    section.questions.map(q => ({
      questionId: q.questionId,
      type: q.type,
      totalResponses: q.totalAnswers, // assuming totalAnswers is the correct value
      optionAnswerCounts: q.optionAnswerCounts.map(opt => ({
        option: opt.option,
        count: opt.count,
      })),
      title: q.questionTitle, // rename questionTitle to title
    }))
  );

  return (
    <div className="bg-white rounded-lg pt-2 pb-0 w-full mb-4">
      <div className="flex items-center justify-between px-4">
        <span className="text-[26px] font-regular text-gray-900">
          {responders.length > 0 && `${responders.length} תגובות`}
        </span>
        <div className="flex items-center gap-4">
          <LinkToSheetsButton onClick={onLinkToSheets} />
          <MenuDots onClick={onMenu} />
        </div>
      </div>
      <div className="mt-6 flex w-full">
        <StatisticsTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>
      {activeTab === "question" && (
        <div className="flex items-center px-4 py-2 border-t border-gray-200">
          <QuestionSelector
            allQuestions={allQuestions}
            selectedIdx={questionIdx}
            setSelectedIdx={setQuestionIdx}
          />
        </div>
      )}
      {activeTab === "individual" && (
        <div className="flex items-center px-4 py-2 border-t border-gray-200">
          <IndividualSelector
            responders={responders}
            selectedIdx={individualIdx}
            setSelectedIdx={setIndividualIdx}
            pollId={""}
          />
        </div>
      )}
    </div>
  );
};

export default ResponsesHeader;
