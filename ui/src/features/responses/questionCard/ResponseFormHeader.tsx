import clsx from "clsx";
import { IPoll } from "../../../types/survey";
import ReactMarkdown from "react-markdown";
interface Props {
  poll: IPoll;
}

const responseFormHeaderBar = clsx(
  "w-full",
  "bg-purple-600",
  "h-2",
  "rounded-t-lg"
);

const responseFormHeaderMain = clsx(
  "bg-white",
  "p-6",
  "rounded-b-lg",
  "shadow-md"
);

const responseFormHeaderH1 = clsx("text-3xl", "font-bold");

const responseFormHeaderH2 = clsx("text-lg", "mt-1", "text-gray-600");

const requiredNote = clsx(
  "border-t",
  "border-gray-200",
  "mt-4",
  "pt-2",
  "-mx-6"
);

const ResponseFormHeader = ({ poll }: Props) => {
  const hasRequiredQuestion = poll.sections.some((section) =>
    section.questions.some((q) => q.isRequired)
  );

  return (
    <div className="mt-6">
      <div
        className={responseFormHeaderBar}
        style={{ backgroundColor: poll.design?.color}}
      />
      <div className={responseFormHeaderMain}>
        <h1 className={responseFormHeaderH1}>
          <ReactMarkdown
            components={{
              p: (props) => <>{props.children}</>, // לא לעטוף בפסקה בתוך h1
            }}
          >
            {poll.title || "טופס ללא כותרת"}
          </ReactMarkdown>
        </h1>
        <h2 className={responseFormHeaderH2}>
          <ReactMarkdown
            components={{
              p: (props) => <>{props.children}</>, // לא לעטוף בפסקה בתוך h2
            }}
          >
            {poll.description || ""}
          </ReactMarkdown>
        </h2>
        <div className={requiredNote} />
        {hasRequiredQuestion && (
          <h2 className="text-sm text-gray-500">* שאלת חובה</h2>
        )}
      </div>
    </div>
  );
};

export default ResponseFormHeader;
