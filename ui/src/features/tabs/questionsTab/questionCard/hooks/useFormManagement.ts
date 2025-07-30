import { useState, useEffect } from "react";
import { IPoll } from "../../../../../types/survey";

export const useFormManagement = (poll: IPoll | undefined) => {
  const [isFormHeaderActive, setIsFormHeaderActive] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("");

  useEffect(() => {
    if (poll && poll.sections.length > 0 && !activeSectionId) {
      setActiveSectionId(poll.sections[0]._id);
    }
  }, [poll, activeSectionId]);

  const handleFormHeaderFocus = () => {
    setIsFormHeaderActive(true);
  };

  const handleFormHeaderBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFormHeaderActive(false);
    }
  };

  return {
    isFormHeaderActive,
    activeSectionId,
    setActiveSectionId,
    handleFormHeaderFocus,
    handleFormHeaderBlur,
  };
};
