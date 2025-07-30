import {
  CircleDot,
  CheckSquare,
  CircleChevronDown,
  Calendar,
  Clock,
  ListMinus,
  ListPlus,
} from "lucide-react";
import { QuestionType } from "../../../../types/survey";

interface QuestionTypeOption {
  value: QuestionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isNew?: boolean;
}

export const QUESTION_TYPE_LIST: QuestionTypeOption[] = [
  {
    value: "SHORT_ANSWER",
    label: "תשובה קצרה",
    icon: ListMinus,
  },
  {
    value: "PARAGRAPH",
    label: "פסקה",
    icon: ListPlus,
  },
  {
    value: "MULTIPLE_CHOICE",
    label: "בחירה מרובה",
    icon: CircleDot,
  },
  {
    value: "CHECKBOXES",
    label: "תיבות סימון",
    icon: CheckSquare,
  },
  {
    value: "DROPDOWN",
    label: "רשימה נפתחת",
    icon: CircleChevronDown,
  },
  {
    value: "LINEAR_SCALE",
    label: "סולם ליניארי",
    icon: CircleDot,
  },
  {
    value: "DATE",
    label: "תאריך",
    icon: Calendar,
  },
  {
    value: "TIME",
    label: "שעה",
    icon: Clock,
  },
];
