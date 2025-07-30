import clsx from "clsx";
import { useEffect } from "react";
import { IPoll } from "../../types/survey";

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

const responseFormHeaderH1 = clsx("text-2xl", "font-bold");
const responseFormHeaderH2 = clsx("text-lg", "mt-1", "text-gray-600");

interface Props {
  poll?: IPoll;
  alreadySent?: boolean;
  sentNow?: boolean;
  errorReason?: string;
}

const getErrorText = (reason: string | undefined) => {
  switch (reason) {
    case "notRespondable":
      return {
        title: "הסקר פורסם אך לא ניתן להשיב עליו",
        description: "יוצר הסקר טרם פתח את האפשרות למענה.",
      };
    case "notPublished":
      return {
        title: "הסקר עדיין לא פורסם",
        description: "לא ניתן למלא את הסקר לפני הפרסום.",
      };
    case "noAccess":
      return {
        title: "אין לך גישה לסקר הזה",
        description: "אם לדעתך מדובר בטעות, פנה לבעלי הסקר.",
      };
    default:
      return {
        title: "לא ניתן לטעון את הסקר",
        description: "אירעה שגיאה בלתי צפויה בעת הטעינה.",
      };
  }
};

const Sent = ({ poll, alreadySent, sentNow, errorReason }: Props) => {
  useEffect(() => {
    if (alreadySent) {
      document.title = "כבר מילאת";
    }
    if (poll?.title) {
      document.title = poll.title;
    }
  }, [alreadySent, poll?.title]);

  const error = errorReason ? getErrorText(errorReason) : null;

  return (
    <div className="mt-6">
      <div className={responseFormHeaderBar} />
      <div className={responseFormHeaderMain}>
        {sentNow && poll && (
          <>
            <h1 className={responseFormHeaderH1}>{poll.title}</h1>
            <h2 className={responseFormHeaderH2}>תגובתך נרשמה.</h2>
          </>
        )}

        {alreadySent && (
          <>
            <h1 className={responseFormHeaderH1}>כבר הגבת</h1>
            <h2 className={responseFormHeaderH2}>
              אפשר למלא את הטופס הזה פעם אחת בלבד.
            </h2>
            <h2 className={responseFormHeaderH2}>
              אם לדעתך מדובר בטעות, באפשרותך ליצור קשר עם בעלי הטופס.
            </h2>
          </>
        )}

        {error && (
          <>
            <h1 className={responseFormHeaderH1}>{error.title}</h1>
            <h2 className={responseFormHeaderH2}>{error.description}</h2>
          </>
        )}
      </div>
    </div>
  );
};

export default Sent;
