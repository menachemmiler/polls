import { FC, useRef, useState, useEffect, useCallback, useMemo } from "react";
import html2canvas from "html2canvas";
import RespondersList from "./RespondersList";
import QuestionChart from "./QuestionChart";
import ChartHeader from "./charts/ChartHeader/ChartHeader";
import Snackbar from "./Snackbar";
import { useSurveyData } from "../../../../../context/responsesContext";
import Spinner from "../shered/Spinner";
import { QuestionType } from "../../../../../types/statisticsType";

const CHART_TYPES = [
  "MULTIPLE_CHOICE",
  "CHECKBOXES",
  "DROPDOWN",
  "LINEAR_SCALE",
];

// כמה שאלות להציג בכל Batch
const QUESTIONS_BATCH_SIZE = 8;

interface QuestionStat {
  questionId: string;
  questionTitle?: string;
  totalAnswers?: number;
  type?: string;
  optionAnswerCounts?: { option: string; count: number }[]; // עדכן טיפוס לפי המבנה בפועל!
}

interface SectionStat {
  sectionId: string;
  sectionTitle: string;
  questions: QuestionStat[];
}

interface SummaryContentProps {
  onResponderSelect?: (idx: number) => void;
}

const SummaryContent: FC<SummaryContentProps> = ({ onResponderSelect }) => {
  
  const surveyData = useSurveyData();
  const isAnonymous = surveyData?.isAnonymous ?? false;

  // עטוף את sections ב־useMemo כדי שלא תשתנה סתם
  const sections: SectionStat[] = useMemo(
    () => surveyData?.sections ?? [],
    [surveyData?.sections]
  );
  const responders = surveyData?.responders ?? [];
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [resetPieKeys, setResetPieKeys] = useState<Record<string, number>>({});
  const [questionReady, setQuestionReady] = useState<
    Record<number, { header: boolean; chart: boolean }>
  >({});
  const [questionsToShow, setQuestionsToShow] = useState(QUESTIONS_BATCH_SIZE);

  const isEmptyState = !sections.some(
    (section) => section.questions.length > 0
  );

  // מערך שטוח של כל השאלות עם המידע הנחוץ, עם טיפוסים
  const questionsFlat = useMemo(() => {
    let idx = 0;
    const out: {
      sectionIdx: number;
      globalIdx: number;
      question: QuestionStat;
    }[] = [];
    sections.forEach((section, sectionIdx) => {
      section.questions.forEach((question) => {
        out.push({
          sectionIdx,
          globalIdx: idx,
          question,
        });
        idx++;
      });
    });
    return out;
  }, [sections]);

  // בונים את הקבוצות לפי סקשן – רק לשאלות שמוצגות כרגע (slice לפי questionsToShow)
  const visibleSections = useMemo(() => {
    const visibleQuestions = questionsFlat.slice(0, questionsToShow);
    const map = new Map<number, { globalIdx: number; question: QuestionStat }[]>();
    visibleQuestions.forEach(({ sectionIdx, globalIdx, question }) => {
      if (!map.has(sectionIdx)) map.set(sectionIdx, []);
      map.get(sectionIdx)!.push({ globalIdx, question });
    });
    return Array.from(map.entries()).map(([sectionIdx, questions]) => ({
      section: sections[sectionIdx],
      sectionIdx,
      questions,
    }));
  }, [questionsFlat, questionsToShow, sections]);

  // true אם כל מה שמוצג כרגע כבר נטען
  const allReady = visibleSections.every((sectionGroup) =>
    sectionGroup.questions.every(({ globalIdx }) => {
      const ready = questionReady[globalIdx] || { header: false, chart: false };
      return ready.header && ready.chart;
    })
  );

  const isFetchingRef = useRef(false);

  // טעינה מדורגת – עוד batch בגלילה
  const handleScroll = useCallback(() => {
    if (
      questionsToShow < questionsFlat.length &&
      window.scrollY > 0 &&
      allReady &&
      !isFetchingRef.current
    ) {
      isFetchingRef.current = true;
      setQuestionsToShow((prev) =>
        Math.min(prev + QUESTIONS_BATCH_SIZE, questionsFlat.length)
      );
      setTimeout(() => {
        isFetchingRef.current = false;
      }, 350);
    }
  }, [questionsToShow, questionsFlat.length, allReady]);

  useEffect(() => {
    if (questionsToShow < questionsFlat.length && allReady) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, questionsToShow, questionsFlat.length, allReady]);

  // פונקציה: סימון ש-Header או Chart סיימו להיטען
  const markReady = (idx: number, key: "header" | "chart") => {
    setQuestionReady((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] || { header: false, chart: false }), [key]: true },
    }));
  };

  const handleCopyChart = async (idx: number, questionId: string) => {
    setResetPieKeys((keys) => ({
      ...keys,
      [questionId]: (keys[questionId] ?? 0) + 1,
    }));
    await new Promise((r) => setTimeout(r, 30));
    const ref = chartRefs.current[idx];
    const btn = document.getElementById(`copy-chart-btn-${idx}`);
    if (!ref) return;
    if (btn) btn.style.visibility = "hidden";
    const canvas = await html2canvas(ref, {
      backgroundColor: null,
      useCORS: true,
      scale: 2,
    });
    if (btn) btn.style.visibility = "visible";
    canvas.toBlob((blob) => {
      if (!blob) return;
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
      setCopiedIdx(idx);
      setSnackbarOpen(true);
    });
  };

  const [showEmptySpinner, setShowEmptySpinner] = useState(false);

  useEffect(() => {
    if (isEmptyState) {
      setShowEmptySpinner(true);
      const timeout = setTimeout(() => setShowEmptySpinner(false), 3000);
      return () => clearTimeout(timeout);
    } else {
      setShowEmptySpinner(false);
    }
  }, [isEmptyState]);

  return (
    <div>
      {!isAnonymous &&
        responders &&
        responders.length > 0 &&
        allReady && (
          <RespondersList
            responders={responders}
            onResponderSelect={onResponderSelect}
          />
        )}

      <div className="mt-8 space-y-8">
        {isEmptyState ? (
          showEmptySpinner ? (
            <div className="bg-white rounded-md flex justify-center items-center text-gray-600 min-h-[300px]">
              <Spinner show={true} />
            </div>
          ) : (
            <div className="bg-white rounded-md flex justify-center items-center text-gray-600 min-h-[300px]">
              אין סטטיסטיקות להצגה.
            </div>
          )
        ) : (
          visibleSections.map(({ section, sectionIdx, questions }) => (
            <div key={section.sectionId} className="mb-8">
              {sectionIdx > 0 && (
                <div className="rounded-t-lg bg-[#693bb8] text-white text-lg font-semibold py-2 px-4">
                  {section.sectionTitle}
                </div>
              )}
              {questions.map(({ globalIdx, question }) => (
                <div
                  key={question.questionId}
                  ref={(el) => {
                    chartRefs.current[globalIdx] = el;
                  }}
                  className="bg-white rounded-b-lg pl-4 pr-6 pt-4 w-full mb-8"
                >
                  <ChartHeader
                    title={question.questionTitle || `שאלה ${globalIdx + 1}`}
                    responsesCount={question.totalAnswers || 0}
                    onCopyChart={() =>
                      handleCopyChart(globalIdx, question.questionId)
                    }
                    copyFeedback={copiedIdx === globalIdx}
                    btnId={`copy-chart-btn-${globalIdx}`}
                    showCopyButton={CHART_TYPES.includes(question.type ?? "")}
                    onRendered={() => markReady(globalIdx, "header")}
                  />
                  <div className="pb-4">
                    <QuestionChart
                      stats={{
                        ...question,
                        optionAnswerCounts: question.optionAnswerCounts ?? [],
                        type: question.type as QuestionType, // Ensure type is never undefined
                      }}
                      pieResetKey={resetPieKeys[question.questionId] || 0}
                      onRendered={() => markReady(globalIdx, "chart")}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        {questionsToShow < questionsFlat.length && !isEmptyState && (
          <div className="flex justify-center py-8"></div>
        )}
      </div>
      <Snackbar open={snackbarOpen} message="Chart copied to clipboard." />
    </div>
  );
};

export default SummaryContent;
