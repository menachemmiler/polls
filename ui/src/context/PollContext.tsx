import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { IPoll, PollContextType } from "../types/survey";

// -------------------- יצירת הקונטקסט --------------------
const PollContext = createContext<PollContextType | undefined>(undefined);

// -------------------- Provider --------------------
export const PollProvider = ({
  children,
  poll: initialPoll,
}: {
  children: ReactNode;
  poll: IPoll;
}) => {
  const [poll, setPoll] = useState(initialPoll);

  const historyRef = useRef<IPoll[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // בפעם הראשונה נטען את ההיסטוריה
  useEffect(() => {
    setPoll(initialPoll);
    historyRef.current = [structuredClone(initialPoll)];
    setHistoryIndex(0);
  }, [initialPoll]);

  const updatePollInternal = (newPoll: IPoll) => {
    setPoll(newPoll);
  };

  const pushToHistory = useCallback(
    (newPoll: IPoll) => {
      const copy = structuredClone(newPoll);
      historyRef.current = historyRef.current.slice(0, historyIndex + 1);
      historyRef.current.push(copy);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      updatePollInternal(historyRef.current[historyIndex - 1]);
      setHistoryIndex((prev) => prev - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < historyRef.current.length - 1) {
      updatePollInternal(historyRef.current[historyIndex + 1]);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [historyIndex]);

  const updatePoll = (newPoll: IPoll) => {
    setPoll(newPoll);
    pushToHistory(newPoll);
  };

  return (
    <PollContext.Provider
      value={{
        poll,
        setPoll,
        updatePoll,
        undo,
        redo,
        pushToHistory,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};

// -------------------- שימוש בקונטקסט --------------------
export const usePoll = (): PollContextType => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error("usePoll must be used within a PollProvider");
  }
  return context;
};
