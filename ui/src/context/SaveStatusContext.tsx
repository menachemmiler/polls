import { createContext, useContext, useState, ReactNode } from "react";

type SaveStatus = "idle" | "saved" | "error";

interface SaveStatusContextType {
  saveStatus: SaveStatus;
  saveMessage: string;
  setSaveStatus: (status: SaveStatus, message?: string) => void;
}

const SaveStatusContext = createContext<SaveStatusContextType | undefined>(undefined);

export const SaveStatusProvider = ({ children }: { children: ReactNode }) => {
  const [saveStatus, setStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setMessage] = useState<string>("");

  const setSaveStatus = (status: SaveStatus, message: string = "") => {
    setStatus(status);
    setMessage(message);
  };

  return (
    <SaveStatusContext.Provider value={{ saveStatus, saveMessage, setSaveStatus }}>
      {children}
    </SaveStatusContext.Provider>
  );
};

export const useSaveStatus = (): SaveStatusContextType => {
  const context = useContext(SaveStatusContext);
  if (!context) {
    throw new Error("useSaveStatus must be used within a SaveStatusProvider");
  }
  return context;
};
