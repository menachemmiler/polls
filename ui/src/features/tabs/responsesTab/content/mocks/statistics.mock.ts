import { pollMock } from "./poll.mock";

export const statisticsMock = [
  {
    _id: "AAAAAAAAAAAAAAAAAAAAA001",
    pollId: pollMock._id,
    questionStats: [
      // SECTION 1
      // SHORT_ANSWER
      {
        questionId: "999999999999999999999801",
        questionType: "SHORT_ANSWER",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "משה כהן", count: 1 },
          { option: "שרה לוי", count: 1 },
          { option: "יוני א.", count: 1 },
          { option: "עדן ר.", count: 1 },
        ],
      },
      // PARAGRAPH
      {
        questionId: "999999999999999999999802",
        questionType: "PARAGRAPH",
        totalAnswers: 3,
        optionAnswerCounts: [
          { option: "אני אוהב ללמוד ולהתנדב", count: 2 },
          { option: "תחביב עיקרי: ריצה", count: 1 },
        ],
      },
      // MULTIPLE_CHOICE
      {
        questionId: "999999999999999999999803",
        questionType: "MULTIPLE_CHOICE",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "אדום", count: 1 },
          { option: "כחול", count: 2 },
          { option: "ירוק", count: 1 },
        ],
      },
      // CHECKBOXES
      {
        questionId: "999999999999999999999804",
        questionType: "CHECKBOXES",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "מוזיקה", count: 2 },
          { option: "ספורט", count: 1 },
          { option: "בישול", count: 2 },
          { option: "קריאה", count: 3 },
        ],
      },
      // DROPDOWN
      {
        questionId: "999999999999999999999805",
        questionType: "DROPDOWN",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "ישראל", count: 2 },
          { option: "ארה״ב", count: 1 },
          { option: "קנדה", count: 1 },
        ],
      },
      // LINEAR_SCALE
      {
        questionId: "999999999999999999999806",
        questionType: "LINEAR_SCALE",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "1", count: 1 },
          { option: "2", count: 0 },
          { option: "3", count: 1 },
          { option: "4", count: 1 },
          { option: "5", count: 1 },
        ],
      },
      // DATE
      {
        questionId: "999999999999999999999807",
        questionType: "DATE",
        totalAnswers: 3,
        optionAnswerCounts: [
          { option: "1998-06-05", count: 2 },
          { option: "2002-02-23", count: 1 },
        ],
      },
      // TIME
      {
        questionId: "999999999999999999999808",
        questionType: "TIME",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "09:00", count: 1 },
          { option: "10:30", count: 2 },
          { option: "13:15", count: 1 },
        ],
      },
      // CHECKBOXES
      {
        questionId: "999999999999999999999809",
        questionType: "CHECKBOXES",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "בוקר:נגינה", count: 2 },
          { option: "בוקר:ציור", count: 1 },
          { option: "ערב:כתיבה", count: 2 },
          { option: "ערב:ציור", count: 1 },
        ],
      },
      // SECTION 2
      // SHORT_ANSWER
      {
        questionId: "999999999999999999999810",
        questionType: "SHORT_ANSWER",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "דוד מנחם", count: 2 },
          { option: "יוסי ישראלי", count: 1 },
          { option: "חן יעל", count: 1 },
        ],
      },
      // PARAGRAPH
      {
        questionId: "999999999999999999999811",
        questionType: "PARAGRAPH",
        totalAnswers: 3,
        optionAnswerCounts: [
          { option: "פיתוח מוצרי אינטרנט", count: 1 },
          { option: "בדיקות QA", count: 1 },
          { option: "ניהול צוות", count: 1 },
        ],
      },
      // MULTIPLE_CHOICE
      {
        questionId: "999999999999999999999812",
        questionType: "MULTIPLE_CHOICE",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "פיתוח", count: 2 },
          { option: "בדיקות", count: 1 },
          { option: "תמיכה", count: 1 },
        ],
      },
      // CHECKBOXES
      {
        questionId: "999999999999999999999813",
        questionType: "CHECKBOXES",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "React", count: 3 },
          { option: "Node.js", count: 2 },
          { option: "MongoDB", count: 2 },
          { option: "Docker", count: 1 },
        ],
      },
      // DROPDOWN
      {
        questionId: "999999999999999999999814",
        questionType: "DROPDOWN",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "משרד", count: 2 },
          { option: "בית", count: 1 },
          { option: "היברידי", count: 1 },
        ],
      },
      // LINEAR_SCALE
      {
        questionId: "999999999999999999999815",
        questionType: "LINEAR_SCALE",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "1", count: 0 },
          { option: "2", count: 1 },
          { option: "3", count: 1 },
          { option: "4", count: 2 },
          { option: "5", count: 0 },
        ],
      },
      // DATE
      {
        questionId: "999999999999999999999816",
        questionType: "DATE",
        totalAnswers: 3,
        optionAnswerCounts: [
          { option: "2021-01-01", count: 2 },
          { option: "2023-12-01", count: 1 },
        ],
      },
      // TIME
      {
        questionId: "999999999999999999999817",
        questionType: "TIME",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "17:00", count: 1 },
          { option: "18:00", count: 2 },
          { option: "20:00", count: 1 },
        ],
      },
      // CHECKBOX
      {
        questionId: "999999999999999999999818",
        questionType: "CHECKBOXES",
        totalAnswers: 4,
        optionAnswerCounts: [
          { option: "מערכת ראשית:Jira", count: 2 },
          { option: "מערכת ראשית:GitLab", count: 1 },
          { option: "סביבות פיתוח:GitLab", count: 2 },
          { option: "סביבות פיתוח:AWS", count: 2 },
        ],
      },
    ],
    createdAt: "2025-07-08T14:20:00.000Z",
    updatedAt: "2025-07-08T14:21:00.000Z",
    __v: 1,
  },
];
