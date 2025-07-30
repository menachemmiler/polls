import { useEffect, useState } from "react";
import ResponseForm from "./ResponseForm";
import ResponseFormHeader from "./questionCard/ResponseFormHeader";
import NavigationButtons from "./NavigationButtons";
import Button from "./FormButton";
import Sent from "./Sent";
import { pollService } from "../../services/pollService";
import { IAnswer, IPoll } from "../../types/survey";
import QuestionsContainer from "./QuestionsContainer";
import PreviewHeader from "../../pages/PreviewHeader";
import { toastService } from "../../services/toastService";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";
import { kartoffelService } from "../../services/kartoffelService";
import { PollProvider } from "../../context/PollContext";

interface Props {
  pollId: string;
  preview?: boolean;
}

const Index = ({ pollId, preview }: Props) => {
  const [poll, setPoll] = useState<IPoll | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [errorReason, setErrorReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isPublished = pollService.useCheckIfPublished(pollId, !preview);

  const { mutate, isSuccess: sentPoll } = pollService.useResponsePoll();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, IAnswer>>({});
  const [popUpClearOpen, setPopUpClearOpen] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const { data } = pollService.GetPoll(pollId);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        if (preview) {
          if (data) {
            setPoll(data);
            const allQuestions = data.sections.flatMap(
              (section: IPoll["sections"][number]) => section.questions
            );
            const defaultResponses = allQuestions.reduce<
              Record<string, IAnswer>
            >((acc, question) => {
              acc[question._id] = {
                answer: [],
                questionId: question._id,
                questionType: question.type,
              };
              return acc;
            }, {});
            setResponses(defaultResponses);
          }
        } else {
          const res = await kartoffelService.getPollAAA(pollId);

          if (!res.poll) {
            setErrorReason(res.reason || "unknown");
            return;
          }

          setPoll(res.poll);
          setHasAccess(res.hasAccess);
          setHasResponded(res.hasResponded);

          const allQuestions = res.poll.sections.flatMap(
            (section: IPoll["sections"][number]) => section.questions
          );
          const defaultResponses: Record<string, IAnswer> = allQuestions.reduce(
            (
              acc: Record<string, IAnswer>,
              question: IPoll["sections"][number]["questions"][number]
            ) => {
              acc[question._id] = {
                answer: [],
                questionId: question._id,
                questionType: question.type,
              };
              return acc;
            },
            {}
          );
          setResponses(defaultResponses);
        }
      } catch (e) {
        console.error(e);
        setErrorReason("unknown");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId, clearForm]);

  useEffect(() => {
    if (poll?.name && !hasResponded) {
      document.title = poll.name;
    }
  }, [poll?.name, hasResponded]);

  if (loading) return <div>Loading...</div>;

  if (errorReason && !preview) {
    return (
      <ResponseForm>
        <Sent errorReason={errorReason} />
      </ResponseForm>
    );
  }

  if (!poll) return <div>לא נמצא סקר</div>;

  const totalSections = poll.sections.length;
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;

  const handleNext = () => {
    const currentSection = poll.sections[currentSectionIndex];
    const mandatoryQuestions = currentSection.questions.filter(
      (q) => q.isRequired
    );
    const unanswered = mandatoryQuestions.filter(
      (q) => !responses[q._id] || responses[q._id].answer.length === 0
    );
    if (unanswered.length > 0 && !preview) {
      return toastService.error("יש שאלות חובה שלא נענו בקטע הנוכחי");
    }
    setCurrentSectionIndex(currentSectionIndex + 1);
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const allQuestions = poll.sections.flatMap((section) => section.questions);
    const requiredQuestions = allQuestions.filter((q) => q.isRequired);
    const unanswered = requiredQuestions.filter(
      (q) => !responses[q._id] || responses[q._id].answer.length === 0
    );

    if (unanswered.length > 0) {
      return toastService.error("יש שאלות חובה שלא נענו בסקר");
    }

    const myRes = {
      data: {
        answers: Object.values(responses),
        pollId,
      },
    };

    mutate(myRes, {
      onSuccess: () => {},
      onError: (error) => {
        console.error("Failed to submit poll", error);
      },
    });
  };

  if (!hasAccess && !preview) {
    return (
      <ResponseForm>
        <Sent poll={poll} errorReason="noAccess" />
      </ResponseForm>
    );
  }

  if (hasResponded && !preview) {
    return (
      <ResponseForm>
        <Sent poll={poll} alreadySent />
      </ResponseForm>
    );
  }

  if (sentPoll && !preview) {
    return (
      <ResponseForm>
        <Sent poll={poll} sentNow />
      </ResponseForm>
    );
  }

  return (
    <div style={{ backgroundColor: poll.design?.backgroundColor }}>
      <PollProvider poll={poll}>
        {preview && (
          <PreviewHeader poll={poll} isPublished={!!isPublished.data} />
        )}
        <ResponseForm>
          <ConfirmationDialog
            confirmText="ניקוי טופס"
            isOpen={popUpClearOpen}
            message="פעולת ניקוי הטופס תסיר את התשובות שלך מכל השאלות, ולא יהיה ניתן לבטלה."
            onCancel={() => setPopUpClearOpen(false)}
            onConfirm={() => {
              setClearForm(!clearForm);
              setCurrentSectionIndex(0);
              setPopUpClearOpen(false);
            }}
            title="לנקות את הטופס?"
          />
          <ResponseFormHeader poll={poll} />
          <QuestionsContainer
            poll={poll}
            currentSectionIndex={currentSectionIndex}
            responses={responses}
            setResponses={setResponses}
          />
          <NavigationButtons
            progress={progress}
            currentPage={currentSectionIndex + 1}
            totalPages={totalSections}
            handleReset={() => setPopUpClearOpen(true)}
          >
            {currentSectionIndex > 0 ? (
              <Button
                customColor={poll.design?.color}
                onClick={handlePrevious}
                text="הקודם"
              />
            ) : (
              <div />
            )}
            {currentSectionIndex === totalSections - 1 ? (
              <Button
                type="submit"
                text="שליחה"
                onClick={handleSubmit}
                variant="primary"
                 customColor={!preview ? poll.design?.color : undefined}
                disabled={preview}
              />
            ) : (
              <Button
                customColor={poll.design?.color}
                text="הבא"
                onClick={handleNext}
              />
            )}
          </NavigationButtons>
        </ResponseForm>
      </PollProvider>
    </div>
  );
};

export default Index;
