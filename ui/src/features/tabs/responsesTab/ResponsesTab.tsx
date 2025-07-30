import { FC, useState, useEffect, useMemo } from "react";
import ResponsesHeader from "./header/ResponsesHeader";
import SummaryContent from "./content/SummaryContent/SummaryContent";
import QuestionContent from "./content/QuestionContent/QuestionContent";
import IndividualContent from "./content/IndividualContent/IndividualContent";
import { useSurveyData } from "../../../context/responsesContext";
import { exportResponsesToCsv } from "./content/shered/exportResponsesToCsv";

type TabType = "summary" | "question" | "individual";

const getStorageKey = (pollId: string) => `responses-activeTab-${pollId}`;
const getRespondersLocalKey = (pollId: string) => `responders-list-${pollId}`;

const ResponsesTab: FC = () => {
  const { pollId, sections, responders } = useSurveyData() || {
    pollId: "",
    sections: [],
    responders: [],
  };

  const [respondersList, setRespondersList] = useState(() => {
    if (!pollId) return [];
    try {
      const fromStorage = localStorage.getItem(getRespondersLocalKey(pollId));
      return fromStorage ? JSON.parse(fromStorage) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!pollId) return;
    if (Array.isArray(responders) && responders.length > 0) {
      setRespondersList(responders);
      localStorage.setItem(
        getRespondersLocalKey(pollId),
        JSON.stringify(responders)
      );
    } else if (Array.isArray(responders) && responders.length === 0) {
      setRespondersList([]);
      localStorage.removeItem(getRespondersLocalKey(pollId));
    }
  }, [responders, pollId]);

  const allQuestions = useMemo(
    () => sections.flatMap((section) => section.questions),
    [sections]
  );

  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [individualIdx, setIndividualIdx] = useState(0);

  useEffect(() => {
    if (!pollId) return;
    const stored = localStorage.getItem(getStorageKey(pollId));
    if (
      stored === "summary" ||
      stored === "question" ||
      stored === "individual"
    ) {
      setActiveTab(stored);
    } else {
      setActiveTab("summary");
    }
  }, [pollId]);

  useEffect(() => {
    if (pollId) {
      localStorage.setItem(getStorageKey(pollId), activeTab);
    }
  }, [activeTab, pollId]);

  const goToIndividualByIdx = (idx: number) => {
    setIndividualIdx(idx);
    setActiveTab("individual");
  };

  const handleLinkToSheets = () => {
    exportResponsesToCsv({
      responders: respondersList,
      allQuestions,
      pollId,
    });
  };

  return (
    <div className="px-6">
      <ResponsesHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        questionIdx={questionIdx}
        setQuestionIdx={setQuestionIdx}
        individualIdx={individualIdx}
        setIndividualIdx={setIndividualIdx}
        onLinkToSheets={handleLinkToSheets}
        onMenu={() => {}}
      />

      {activeTab === "summary" && (
        <SummaryContent onResponderSelect={goToIndividualByIdx} />
      )}
      {activeTab === "question" && (
        <QuestionContent
          allQuestions={allQuestions}
          selectedIdx={questionIdx}
          setSelectedIdx={setQuestionIdx}
        />
      )}
      {activeTab === "individual" && (
        <IndividualContent
          responders={respondersList}
          selectedIdx={individualIdx}
          setSelectedIdx={setIndividualIdx}
        />
      )}
    </div>
  );
};

export default ResponsesTab;
