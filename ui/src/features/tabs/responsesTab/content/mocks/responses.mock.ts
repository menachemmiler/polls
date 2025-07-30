import { QuestionType } from "../../../../../types/statisticsType";
import { pollMock } from "./poll.mock";

export const respondersMock = [
  {
    respondentId: "5e5688324203fc40043591aa",
    email: "user1@example.com",
    name: "משתמש 1",
  },
  {
    respondentId: "5e5688324203fc40043591bb",
    email: "user2@example.com",
    name: "משתמש 2",
  },
  {
    respondentId: "5e5688324203fc40043591cc",
    email: "user3@example.com",
    name: "משתמש 3",
  },
  {
    respondentId: "5e5688324203fc40043591dd",
    email: "user4@example.com",
    name: "משתמש 4",
  },
  {
    respondentId: "5e5688324203fc40043591ee",
    email: "user5@example.com",
    name: "משתמש 5",
  },
  {
    respondentId: "5e5688324203fc40043591ff",
    email: "user6@example.com",
    name: "משתמש 6",
  },
  {
    respondentId: "5e5688324203fc40043591gg",
    email: "user7@example.com",
    name: "משתמש 7",
  },
  {
    respondentId: "5e5688324203fc40043591hh",
    email: "user8@example.com",
    name: "משתמש 8",
  },
];

export const totalResponsesMock = pollMock.isAnonymous
  ? respondersMock.length
  : respondersMock.length;

export const responsesMock = [
  {
    _id: "aaaaaaa000000000000001",
    respondentId: "999999999999999999999814", // משה כהן
    pollId: pollMock._id,
    submittedAt: "2025-07-08T14:30:00.000Z",
    answers: [
      {
        questionId: "999999999999999999999801",
        questionType: QuestionType.SHORT_ANSWER,
        answer: ["משה כהן"],
      },
      {
        questionId: "999999999999999999999802",
        questionType: QuestionType.PARAGRAPH,
        answer: ["אני אוהב ללמוד ולהתנדב"],
      },
      {
        questionId: "999999999999999999999803",
        questionType: QuestionType.MULTIPLE_CHOICE,
        answer: ["אדום"],
      },
      {
        questionId: "999999999999999999999804",
        questionType: QuestionType.CHECKBOXES,
        answer: ["מוזיקה", "בישול"],
      },
      {
        questionId: "999999999999999999999805",
        questionType: QuestionType.DROPDOWN,
        answer: ["ישראל"],
      },
      {
        questionId: "999999999999999999999806",
        questionType: QuestionType.LINEAR_SCALE,
        answer: ["1"],
      },
      {
        questionId: "999999999999999999999807",
        questionType: QuestionType.DATE,
        answer: ["1998-06-05"],
      },
      {
        questionId: "999999999999999999999808",
        questionType: QuestionType.TIME,
        answer: ["09:00"],
      },
      {
        questionId: "999999999999999999999809",
        questionType: QuestionType.CHECKBOXES,
        answer: ["בוקר:נגינה", "בוקר:ציור"],
      },

      {
        questionId: "999999999999999999999810",
        questionType: QuestionType.SHORT_ANSWER,
        answer: ["דוד מנחם"],
      },
      {
        questionId: "999999999999999999999811",
        questionType: QuestionType.PARAGRAPH,
        answer: ["פיתוח מוצרי אינטרנט"],
      },
      {
        questionId: "999999999999999999999812",
        questionType: QuestionType.MULTIPLE_CHOICE,
        answer: ["פיתוח"],
      },
      {
        questionId: "999999999999999999999813",
        questionType: QuestionType.CHECKBOXES,
        answer: ["React", "MongoDB"],
      },
      {
        questionId: "999999999999999999999814",
        questionType: QuestionType.DROPDOWN,
        answer: ["משרד"],
      },
      {
        questionId: "999999999999999999999815",
        questionType: QuestionType.LINEAR_SCALE,
        answer: ["4"],
      },
      {
        questionId: "999999999999999999999816",
        questionType: QuestionType.DATE,
        answer: ["2021-01-01"],
      },
      {
        questionId: "999999999999999999999817",
        questionType: QuestionType.TIME,
        answer: ["17:00"],
      },
      {
        questionId: "999999999999999999999818",
        questionType: QuestionType.CHECKBOXES,
        answer: ["מערכת ראשית:Jira", "סביבות פיתוח:GitLab"],
      },

      {
        questionId: "999999999999999999999819",
        questionType: QuestionType.PARAGRAPH,
        answer: [""],
      },
    ],
  },
  {
    _id: "aaaaaaa000000000000002",
    respondentId: "999999999999999999999815", // שרה לוי
    pollId: pollMock._id,
    submittedAt: "2025-07-08T14:35:00.000Z",
    answers: [
      {
        questionId: "999999999999999999999801",
        questionType: QuestionType.SHORT_ANSWER,
        answer: ["שרה לוי"],
      },
      {
        questionId: "999999999999999999999802",
        questionType: QuestionType.PARAGRAPH,
        answer: ["אני אוהב ללמוד ולהתנדב"],
      },
      {
        questionId: "999999999999999999999803",
        questionType: QuestionType.MULTIPLE_CHOICE,
        answer: ["כחול"],
      },
      {
        questionId: "999999999999999999999804",
        questionType: QuestionType.CHECKBOXES,
        answer: ["מוזיקה", "קריאה"],
      },
      {
        questionId: "999999999999999999999805",
        questionType: QuestionType.DROPDOWN,
        answer: ["ישראל"],
      },
      {
        questionId: "999999999999999999999806",
        questionType: QuestionType.LINEAR_SCALE,
        answer: ["3"],
      },
      {
        questionId: "999999999999999999999807",
        questionType: QuestionType.DATE,
        answer: ["1998-06-05"],
      },
      {
        questionId: "999999999999999999999808",
        questionType: QuestionType.TIME,
        answer: ["10:30"],
      },
      {
        questionId: "999999999999999999999809",
        questionType: QuestionType.CHECKBOXES,
        answer: ["ערב:כתיבה", "ערב:ציור"],
      },

      {
        questionId: "999999999999999999999810",
        questionType: QuestionType.SHORT_ANSWER,
        answer: ["יוסי ישראלי"],
      },
      {
        questionId: "999999999999999999999811",
        questionType: QuestionType.PARAGRAPH,
        answer: ["בדיקות QA"],
      },
      {
        questionId: "999999999999999999999812",
        questionType: QuestionType.MULTIPLE_CHOICE,
        answer: ["בדיקות"],
      },
      {
        questionId: "999999999999999999999813",
        questionType: QuestionType.CHECKBOXES,
        answer: ["React", "Node.js"],
      },
      {
        questionId: "999999999999999999999814",
        questionType: QuestionType.DROPDOWN,
        answer: ["בית"],
      },
      {
        questionId: "999999999999999999999815",
        questionType: QuestionType.LINEAR_SCALE,
        answer: ["2"],
      },
      {
        questionId: "999999999999999999999816",
        questionType: QuestionType.DATE,
        answer: ["2021-01-01"],
      },
      {
        questionId: "999999999999999999999817",
        questionType: QuestionType.TIME,
        answer: ["18:00"],
      },
      {
        questionId: "999999999999999999999818",
        questionType: QuestionType.CHECKBOXES,
        answer: [
          "מערכת ראשית:GitLab",
          "סביבות פיתוח:GitLab",
          "סביבות פיתוח:AWS",
        ],
      },

      {
        questionId: "999999999999999999999819",
        questionType: QuestionType.PARAGRAPH,
        answer: [""],
      },
    ],
  },
  {
    _id: "aaaaaaa000000000000003",
    respondentId: "999999999999999999999816", // יוני א.
    pollId: pollMock._id,
    submittedAt: "2025-07-08T14:40:00.000Z",
    answers: [
      {
        questionId: "999999999999999999999801",
        questionType: QuestionType.SHORT_ANSWER,
        answer: ["יוני א."],
      },
      {
        questionId: "999999999999999999999802",
        questionType: QuestionType.PARAGRAPH,
        answer: ["תחביב עיקרי: ריצה"],
      },
      {
        questionId: "999999999999999999999803",
        questionType: QuestionType.MULTIPLE_CHOICE,
        answer: ["כחול"],
      },
      {
        questionId: "999999999999999999999804",
        questionType: QuestionType.CHECKBOXES,
        answer: ["בישול", "קריאה"],
      },
      {
        questionId: "999999999999999999999805",
        questionType: QuestionType.DROPDOWN,
        answer: ["ארה״ב"],
      },
      {
        questionId: "999999999999999999999806",
        questionType: QuestionType.LINEAR_SCALE,
        answer: ["4"],
      },
      {
        questionId: "999999999999999999999807",
        questionType: QuestionType.DATE,
        answer: ["2002-02-23"],
      },
      {
        questionId: "999999999999999999999808",
        questionType: QuestionType.TIME,
        answer: ["10:30"],
      },
      {
        questionId: "999999999999999999999809",
        questionType: QuestionType.CHECKBOXES,
        answer: ["ערב:כתיבה"],
      },

      {
        questionId: "999999999999999999999810",
        questionType: QuestionType.SHORT_ANSWER,
        answer: ["חן יעל"],
      },
      {
        questionId: "999999999999999999999811",
        questionType: QuestionType.PARAGRAPH,
        answer: ["ניהול צוות"],
      },
      {
        questionId: "999999999999999999999812",
        questionType: QuestionType.MULTIPLE_CHOICE,
        answer: ["פיתוח"],
      },
      {
        questionId: "999999999999999999999813",
        questionType: QuestionType.CHECKBOXES,
        answer: ["React", "Node.js", "Docker"],
      },
      {
        questionId: "999999999999999999999814",
        questionType: QuestionType.DROPDOWN,
        answer: ["היברידי"],
      },
      {
        questionId: "999999999999999999999815",
        questionType: QuestionType.LINEAR_SCALE,
        answer: ["3"],
      },
      {
        questionId: "999999999999999999999816",
        questionType: QuestionType.DATE,
        answer: ["2023-12-01"],
      },
      {
        questionId: "999999999999999999999817",
        questionType: QuestionType.TIME,
        answer: ["18:00"],
      },
      {
        questionId: "999999999999999999999818",
        questionType: QuestionType.CHECKBOXES,
        answer: ["סביבות פיתוח:AWS"],
      },

      {
        questionId: "999999999999999999999819",
        questionType: QuestionType.PARAGRAPH,
        answer: [""],
      },
    ],
  },
  {
    _id: "aaaaaaa000000000000004",
    respondentId: "999999999999999999999817", // עדן ר.
    pollId: pollMock._id,
    submittedAt: "2025-07-08T14:45:00.000Z",
    answers: [
      {
        questionId: "999999999999999999999801",
        questionType: QuestionType.SHORT_ANSWER,
        answer: ["עדן ר."],
      },
      {
        questionId: "999999999999999999999802",
        questionType: QuestionType.PARAGRAPH,
        answer: [""],
      },
      {
        questionId: "999999999999999999999803",
        questionType: QuestionType.MULTIPLE_CHOICE,
        answer: ["ירוק"],
      },
      {
        questionId: "999999999999999999999804",
        questionType: QuestionType.CHECKBOXES,
        answer: ["ספורט", "קריאה"],
      },
      {
        questionId: "999999999999999999999805",
        questionType: QuestionType.DROPDOWN,
        answer: ["קנדה"],
      },
      {
        questionId: "999999999999999999999806",
        questionType: QuestionType.LINEAR_SCALE,
        answer: ["5"],
      },
      {
        questionId: "999999999999999999999807",
        questionType: QuestionType.DATE,
        answer: ["2002-02-23"],
      },
      {
        questionId: "999999999999999999999808",
        questionType: QuestionType.TIME,
        answer: ["13:15"],
      },
      {
        questionId: "999999999999999999999809",
        questionType: QuestionType.CHECKBOXES,
        answer: ["ערב:כתיבה"],
      },

      {
        questionId: "999999999999999999999810",
        questionType: QuestionType.SHORT_ANSWER,
        answer: ["דוד מנחם"],
      },
      {
        questionId: "999999999999999999999811",
        questionType: QuestionType.PARAGRAPH,
        answer: [""],
      },
      {
        questionId: "999999999999999999999812",
        questionType: QuestionType.MULTIPLE_CHOICE,
        answer: ["תמיכה"],
      },
      {
        questionId: "999999999999999999999813",
        questionType: QuestionType.CHECKBOXES,
        answer: ["MongoDB"],
      },
      {
        questionId: "999999999999999999999814",
        questionType: QuestionType.DROPDOWN,
        answer: ["משרד"],
      },
      {
        questionId: "999999999999999999999815",
        questionType: QuestionType.LINEAR_SCALE,
        answer: ["4"],
      },
      {
        questionId: "999999999999999999999816",
        questionType: QuestionType.DATE,
        answer: ["2021-01-01"],
      },
      {
        questionId: "999999999999999999999817",
        questionType: QuestionType.TIME,
        answer: ["20:00"],
      },
      {
        questionId: "999999999999999999999818",
        questionType: QuestionType.CHECKBOXES,
        answer: ["מערכת ראשית:Jira", "סביבות פיתוח:AWS"],
      },

      {
        questionId: "999999999999999999999819",
        questionType: QuestionType.PARAGRAPH,
        answer: [""],
      },
    ],
  },
];

export const getAnswersByQuestionId = (questionId: string): string[] => {
  return responsesMock
    .flatMap((response) =>
      (response.answers ?? [])
        .filter((ans) => ans.questionId === questionId)
        .flatMap((ans) => ans.answer)
    )
    .filter((ans) => ans && ans !== "");
};
