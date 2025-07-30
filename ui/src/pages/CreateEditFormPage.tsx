import { useEffect, useCallback, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IPoll, TabType } from "../types/survey";
import { pollService } from "../services/pollService";
import QuestionsTab from "../features/tabs/questionsTab/QuestionsTab";
import ResponsesTab from "../features/tabs/responsesTab/ResponsesTab";
import SettingsTab from "../features/tabs/settingsTab/SettingsTab";
import NotFoundPage from "./404Page";
import Loading from "../components/shared/Loading";
import { TabButton } from "../features/tabs/TabButton";
import validationPollFromParam from "../utils/validationPollFromParam";
import { PollProvider } from "../context/PollContext";
import Navbar from "../components/layout/FormNavbar";
import { SaveStatusProvider } from "../context/SaveStatusContext";
import PromptSelectorFromPolls from "../features/importQuestions/PromptSelectorFromPolls";
import ImportQuestionsPanel from "../features/importQuestions/ImportQuestionsPanel";
import { SurveyDataProvider } from "../context/responsesContext";

const REDIRECT_DELAY = 3000;

const CreateEditFormPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabType) || TabType.QUESTIONS;
  const isValidPollId = validationPollFromParam(pollId);

  const [isPromptSelectorOpen, setIsPromptSelectorOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [sectionId, setSectionId] = useState("");
  const [isImportQuestionsPanelOpen, setIsImportQuestionsPanelOpen] =
    useState(false);
  const [pollToImport, setPollToImport] = useState<IPoll | null>(null);

  const {
    data: poll,
    isLoading,
    isError,
    refetch,
  } = isValidPollId && pollId
    ? pollService.GetPoll(pollId)
    : {
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: async () => {},
      };

  useEffect(() => {
    if (!isLoading && (isError || !poll)) {
      const timer = setTimeout(() => navigate("/"), REDIRECT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isError, isLoading, poll, navigate]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      setSearchParams({ tab });
    },
    [setSearchParams]
  );

  const questionsBtnRef = useRef<HTMLButtonElement>(null);
  const responsesBtnRef = useRef<HTMLButtonElement>(null);
  const jumpedBackRef = useRef(false);

  useEffect(() => {
    if (
      activeTab === TabType.RESPONSES &&
      !jumpedBackRef.current &&
      window.performance?.navigation?.type === 1 
    ) {
      jumpedBackRef.current = true;
      setSearchParams({ tab: TabType.QUESTIONS });
      setTimeout(() => {
        setSearchParams({ tab: TabType.RESPONSES });
      }, 80); 
    }
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    if (activeTab === TabType.RESPONSES) {
      window.scrollTo(0, 0);
    }
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case TabType.QUESTIONS:
        return (
          <QuestionsTab
            setSectionId={setSectionId}
            setIndex={setIndex}
            setIsPromptSelectorOpen={setIsPromptSelectorOpen}
          />
        );
      case TabType.RESPONSES:
        return <ResponsesTab />;
      case TabType.SETTINGS:
        return <SettingsTab />;
      default:
        return <NotFoundPage />;
    }
  };

  if (isLoading || !poll) {
    return <Loading />;
  }

  return (
    <PollProvider poll={poll}>
      <SurveyDataProvider pollId={poll._id}>
        {isPromptSelectorOpen && (
          <PromptSelectorFromPolls
            onClose={() => setIsPromptSelectorOpen(false)}
            setPollToImport={setPollToImport}
            setIsImportQuestionsPanelOpen={setIsImportQuestionsPanelOpen}
          />
        )}
        {isImportQuestionsPanelOpen && pollToImport && pollId && (
          <ImportQuestionsPanel
            pollToImport={pollToImport}
            pollId={pollId}
            index={index}
            sectionId={sectionId}
            onClose={() => {
              setIsImportQuestionsPanelOpen(false);
              setPollToImport(null);
            }}
            onPollImported={refetch}
          />
        )}
        <SaveStatusProvider>
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar poll={poll} />
          </div>
          <div
            className="min-h-screen pt-16"
            style={{ backgroundColor: poll.design?.backgroundColor }}
          >
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
              <div className="max-w-5xl mx-auto">
                <div className="flex justify-center gap-3">
                  <TabButton
                    ref={questionsBtnRef}
                    active={activeTab === TabType.QUESTIONS}
                    onClick={() => handleTabChange(TabType.QUESTIONS)}
                    text="שאלות"
                  />
                  <TabButton
                    ref={responsesBtnRef}
                    active={activeTab === TabType.RESPONSES}
                    onClick={() => handleTabChange(TabType.RESPONSES)}
                    text="תגובות"
                  />
                  <TabButton
                    active={activeTab === TabType.SETTINGS}
                    onClick={() => handleTabChange(TabType.SETTINGS)}
                    text="הגדרות"
                  />
                </div>
              </div>
            </div>
            <div className="max-w-5xl mx-auto p-6">{renderTabContent()}</div>
          </div>
        </SaveStatusProvider>
      </SurveyDataProvider>
    </PollProvider>
  );
};

export default CreateEditFormPage;
