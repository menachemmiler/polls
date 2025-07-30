import { createContext, useContext, useRef, useState, ReactNode } from "react";
import { PollAction } from "../types/undoAndRedo";

interface ActionHistoryContextType {
  perform: (action: PollAction) => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
}

const ActionHistoryContext = createContext<
  ActionHistoryContextType | undefined
>(undefined);

export const ActionHistoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const actionsRef = useRef<PollAction[]>([]);
  const [index, setIndex] = useState(-1);

  const perform = async (action: PollAction) => {
    console.log(action, "perform");
    await action.do();
    actionsRef.current = actionsRef.current.slice(0, index + 1);
    actionsRef.current.push(action);
    setIndex((prev) => prev + 1);
    console.log({ index }, "perform");
  };

  const undo = async () => {
    console.log("undo");
    if (index >= 0) {
      await actionsRef.current[index].undo();
      setIndex((prev) => prev - 1);
      console.log({ index });
    }
  };

  const redo = async () => {
    if (index < actionsRef.current.length - 1) {
      await actionsRef.current[index + 1].do();
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <ActionHistoryContext.Provider value={{ perform, undo, redo }}>
      {children}
    </ActionHistoryContext.Provider>
  );
};

export const useActionHistory = () => {
  const context = useContext(ActionHistoryContext);
  if (!context)
    throw new Error(
      "useActionHistory must be used within ActionHistoryProvider"
    );
  return context;
};
