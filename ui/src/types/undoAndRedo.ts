export type PollAction =
  | {
      type: "CREATE_QUESTION";
      sectionId: string;
      question: any;
      do: () => Promise<void>;
      undo: () => Promise<void>;
    }
  | {
      type: "DELETE_QUESTION";
      sectionId: string;
      questionId: string;
      questionData: any;
      do: () => Promise<void>;
      undo: () => Promise<void>;
    }
  | {
      type: "CREATE_SECTION";
      section: any;
      do: () => Promise<void>;
      undo: () => Promise<void>;
    }
  | {
      type: "DELETE_SECTION";
      sectionId: string;
      sectionData: any;
      do: () => Promise<void>;
      undo: () => Promise<void>;
    }
  | {
      type: "UPDATE_TITLE";
      prev: string;
      next: string;
      do: () => Promise<void>;
      undo: () => Promise<void>;
    }
  | {
      type: "UPDATE_DESCRIPTION";
      prev: string;
      next: string;
      do: () => Promise<void>;
      undo: () => Promise<void>;
    }
  | {
      type: "UPDATE_SECTION_TITLE";
      sectionId: string;
      prev: string;
      next: string;
      do: () => Promise<void>;
      undo: () => Promise<void>;
    }
  | {
      type: "UPDATE_SECTION_DESCRIPTION";
      sectionId: string;
      prev: string;
      next: string;
      do: () => Promise<void>;
      undo: () => Promise<void>;
    };
