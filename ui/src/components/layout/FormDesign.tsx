import { useEffect, useState } from "react";
import { Palette, X } from "lucide-react";
import { ColorPickerPalette } from "./Colors";
import { usePoll } from "../../context/PollContext";
import { pollService } from "../../services/pollService";
import { useSaveStatus } from "../../context/SaveStatusContext";

const fontFamilies = [
  "Arial",
  "Tahoma",
  "Verdana",
  "Courier New",
  "Georgia",
  "Trebuchet MS",
  "Times New Roman",
  "Impact",
  "Comic Sans MS",
  "Noto Sans Hebrew",
  "Noto Rashi Hebrew",
  "Assistant",
  "Heebo",
  "Consolas",
  "Monaco",
  "Lucida Console",
  "Courier New",
  "Impact",
  "Comic Sans MS",
  "Brush Script MT",
  "Segoe UI",
];

const fontSizes = [
  10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
];

interface Props {
  onClose: () => void;
}

const FormDesign: React.FC<Props> = ({ onClose }) => {
  const { poll, setPoll } = usePoll();
  const [styles, setStyles] = useState({
    title: { fontSize: 24, fontFamily: "Arial" },
    question: { fontSize: 12, fontFamily: "Alef" },
    text: { fontSize: 11, fontFamily: "Courier New" },
    color: "rgba(231, 228, 235, 1)",
    backgroundColor: "#f8f9fa",
  });

  useEffect(() => {
    setStyles({
      title: {
        fontSize: poll.design?.header?.fontSize || 24,
        fontFamily: poll.design?.header?.fontFamily || "Arial",
      },
      question: {
        fontSize: poll.design?.questions?.fontSize || 12,
        fontFamily: poll.design?.questions?.fontFamily || "Alef",
      },
      text: {
        fontSize: poll.design?.text?.fontSize || 11,
        fontFamily: poll.design?.text?.fontFamily || "Courier New",
      },
      color: poll.design?.color || "#9333ea",
      backgroundColor: poll.design?.backgroundColor || "#f8f9fa",
    });
  }, [poll.design]);

  const { mutate: updatePollMutation } = pollService.useUpdatePoll();
  const { setSaveStatus } = useSaveStatus();
  const updateHeaderDesign = (
    key: "fontSize" | "fontFamily",
    value: string | number
  ) => {
    const updatedDesign = {
      ...poll.design,
      header: {
        ...poll.design?.header,
        [key]: value,
      },
    };

    setPoll({ ...poll, design: updatedDesign });

    updatePollMutation(
      {
        pollId: poll._id,
        data: { design: updatedDesign },
      },
      {
        onSuccess: () => {
          setSaveStatus("saved", "העיצוב עודכן");
          setTimeout(() => setSaveStatus("idle"), 3000);
        },
        onError: () => {
          setSaveStatus("error", "שגיאה בעדכון הכותרת");
        },
      }
    );
  };

  const updateQuestionDesign = (
    key: "fontSize" | "fontFamily",
    value: string | number
  ) => {
    const updatedDesign = {
      ...poll.design,
      questions: {
        ...poll.design?.questions,
        [key]: value,
      },
    };
    setPoll({ ...poll, design: updatedDesign });
    updatePollMutation(
      {
        pollId: poll._id,
        data: { design: updatedDesign },
      },
      {
        onSuccess: () => {
          setSaveStatus("saved", "העיצוב עודכן");
          setTimeout(() => setSaveStatus("idle"), 3000);
        },
        onError: () => {
          setSaveStatus("error", "שגיאה בעדכון העיצוב");
        },
      }
    );
  };
  const updateQuestionTextDesign = (
    key: "fontSize" | "fontFamily",
    value: string | number
  ) => {
    const updatedDesign = {
      ...poll.design,
      text: {
        ...poll.design?.text,
        [key]: value,
      },
    };

    setPoll({ ...poll, design: updatedDesign });

    updatePollMutation(
      {
        pollId: poll._id,
        data: { design: updatedDesign },
      },
      {
        onSuccess: () => {
          setSaveStatus("saved", "העיצוב עודכן");
          setTimeout(() => setSaveStatus("idle"), 3000);
        },
        onError: () => {
          setSaveStatus("error", "שגיאה בשמירת עיצוב טקסט השאלה");
        },
      }
    );
  };
  const updateHeaderColor = (color: string) => {
    const updatedDesign = {
      ...poll.design,
      color,
    };

    setPoll({ ...poll, design: updatedDesign });
    setStyles((prev) => ({ ...prev, color }));

    updatePollMutation(
      {
        pollId: poll._id,
        data: { design: updatedDesign },
      },
      {
        onSuccess: () => {
          setSaveStatus("saved", "העיצוב עודכן");
          setTimeout(() => setSaveStatus("idle"), 3000);
        },
        onError: () => {
          setSaveStatus("error", "שגיאה בעדכון העיצוב");
        },
      }
    );
  };
  const updateBackgroundColor = (color: string) => {
    const updatedDesign = {
      ...poll.design,
      backgroundColor: color,
    };

    setPoll({ ...poll, design: updatedDesign });

    updatePollMutation(
      {
        pollId: poll._id,
        data: { design: updatedDesign },
      },
      {
        onSuccess: () => {
          setSaveStatus("saved", "צבע רקע עודכן");
          setTimeout(() => setSaveStatus("idle"), 3000);
        },
        onError: () => {
          setSaveStatus("error", "שגיאה בעדכון צבע הרקע");
        },
      }
    );
  };

  return (
    <div
      className="w-full max-w-sm shadow-lg border-r border-gray-200 h-full overflow-y-auto"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Palette className="text-gray-600 w-5 h-5" />
          <h2 className="text-base font-normal text-black-900">עיצוב</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4 space-y-12">
        <div>
          {/* כותרת עליונה */}
          <div className="mb-8">
            <div className="text-xl text-gray-600 mb-2">כותרת עליונה</div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={styles.title.fontSize}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-2 text-sm w-16 focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    updateHeaderDesign("fontSize", Number(e.target.value))
                  }
                >
                  {fontSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative flex-1">
                <select
                  value={styles.title.fontFamily}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm w-full focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    updateHeaderDesign("fontFamily", e.target.value)
                  }
                >
                  {fontFamilies.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* שאלה */}
          <div className="mb-8">
            <div className="text-xl text-gray-600 mb-2">שאלה</div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={styles.question.fontSize}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-2 text-sm w-16 focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    updateQuestionDesign("fontSize", Number(e.target.value))
                  }
                >
                  {fontSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative flex-1">
                <select
                  value={styles.question.fontFamily}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm w-full focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    updateQuestionDesign("fontFamily", e.target.value)
                  }
                >
                  {fontFamilies.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* טקסט */}
          <div className="mb-8">
            <div className="text-xl text-gray-600 mb-2">טקסט</div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={styles.text.fontSize}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-2 text-sm w-16 focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    updateQuestionTextDesign("fontSize", Number(e.target.value))
                  }
                >
                  {fontSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative flex-1">
                <select
                  value={styles.text.fontFamily}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm w-full focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    updateQuestionTextDesign("fontFamily", e.target.value)
                  }
                >
                  {fontFamilies.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* כותרת עליונה section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="text-xl text-gray-700 font-medium mb-3">
            כותרת עליונה
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            בחר תמונה
          </button>
        </div>

        {/* צבע */}
        <div className="border-t border-gray-200 pt-4">
          <ColorPickerPalette
            selectedColor={styles.color}
            onSelect={updateHeaderColor}
            selectedBackgroundColor={poll.design?.backgroundColor}
            onBackgroundSelect={updateBackgroundColor}
          />
        </div>
      </div>
    </div>
  );
};

export default FormDesign;
