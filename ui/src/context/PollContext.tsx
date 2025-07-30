import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IPoll } from "../types/survey";

interface PollContextType {
  poll: IPoll;
  setPoll: (poll: IPoll) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider = ({
  children,
  poll: initialPoll,
}: {
  children: ReactNode;
  poll: IPoll;
}) => {
  const [poll, setPoll] = useState(initialPoll);

  useEffect(() => {
    setPoll(initialPoll);
  }, [initialPoll]);

  return (
    <PollContext.Provider value={{ poll, setPoll }}>
      {children}
    </PollContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePoll = (): PollContextType => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error("usePoll must be used within a PollProvider");
  }
  return context;
};
