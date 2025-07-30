# 📊 Statistics Service

Minimal and production-ready microservice for managing dynamic poll statistics.

---

## 🔧 Folder Structure

```text
src/
├── config/                  # Environment & system configuration
├── express/                 # Express core server
│   ├── statistics-service/  # Core statistics service
│   │   ├── controller.ts        # Route controllers
│   │   ├── interface.ts         # Types, enums, and interfaces
│   │   ├── manager.ts           # Business logic for updating statistics
│   │   ├── model.ts             # Mongoose schema and model definition
│   │   ├── router.ts            # Express Router binding endpoints
│   │   ├── validations.ts       # Zod-based validation layer
│   ├── router.ts            # Root router
│   ├── server.ts            # Express app creation and listener
│   └── utils/               # Utility and helper functions
├── index.ts                 # Entry point

tests/
└── statistics.spec.ts       # Vitest end-to-end tests

docker-compose.yml           # Service orchestration: Mongo, App, Test
Dockerfile                   # Multi-stage container build
.env                         # Main environment variables
.env.test                    # Testing environment variables
tsconfig.json                # TypeScript config
package.json                 # Project metadata and dependencies
```

---

## 📦 Tech Stack

* **Node.js** + **Express**
* **MongoDB** with **Mongoose ODM**
* **TypeScript** throughout
* **Zod** for schema validation
* **Vitest** for testing
* **Docker** for containerization

---

## ✅ Features

* 📌 Create statistics documents per poll
* 🔁 Update statistics with submitted answers
* 🔎 Query statistics by `pollId` or other fields
* 🗑️ Delete statistics documents and individual questions
* ✏️ Update question configuration (type/options) without data loss
* 📄 Pagination via `step` and `limit` query params
* ❌ Full error handling with typed exceptions

---

## 🔌 API Reference

### `POST /api/statistics`

**Create a statistics document**

**Request Body:**

```json
{
  "pollId": "12345",
  "questionStats": [
    {
      "questionId": "abc123",
      "questionType": "MULTIPLE_CHOICE",
      "optionAnswerCounts": [
        { "_id": "aaa111", "option": "A" },
        { "_id": "bbb222", "option": "B" }
      ]
    },
    {
      "questionId": "def456",
      "questionType": "PARAGRAPH",
      "optionAnswerCounts": []
    }
  ]
}
```

**Response:** Full statistics document

---

### `PUT /api/statistics/:pollId/statistics`

**Update statistics with user submission**

**Request Body:**

```json
{
  "answers": [
    { "questionId": "abc123", "selectedOption": ["A"] },
    { "questionId": "def456", "selectedOption": ["Free text answer"] }
  ]
}
```

* Increments answer counts per question/option.
* Only `CHECKBOXES` type allows multiple answers per question.

**Response:** Updated statistics document
**Errors:**

* 404 if pollId/question/option not found
* 400 if invalid answer shape

---

### `PATCH /api/statistics/:pollId/form`

**Update question type/options** (without deleting option counts!)

**Request Body:**

```json
{
  "questionId": "abc123",
  "questionType": "MULTIPLE_CHOICE",
  "options": [
    { "_id": "aaa111", "option": "Option A" },
    { "_id": "ccc333", "option": "Option C" }
  ]
}
```

* Updates existing options by `_id` (renames allowed, counter is preserved).
* Adds new options (with count=0).
* **Does NOT remove options** – old options remain unless the whole question is deleted.

**Response:** Updated statistics document
**Errors:**

* 404 if pollId not found
* 400 if invalid schema

---

### `DELETE /api/statistics/:pollId/questions/:questionId`

**Delete a question (and its options/counters) from a poll statistics document.**

**Response:** Updated statistics document (with the question removed)
**Errors:** 404 if pollId or questionId not found

---

### `GET /api/statistics/:pollId`

**Fetch statistics by poll ID.**

**Response:**

```json
{
  "pollId": "12345",
  "questionStats": [
    {
      "questionId": "abc123",
      "questionType": "MULTIPLE_CHOICE",
      "totalAnswers": 10,
      "optionAnswerCounts": [
        { "_id": "aaa111", "option": "A", "count": 5 },
        { "_id": "bbb222", "option": "B", "count": 5 }
      ]
    }
  ],
  "_id": "someMongoId",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### `DELETE /api/statistics/:pollId`

**Delete statistics document by poll ID.**

**Response:** The deleted document, or 404 if not found

---

### `GET /api/statistics/query?pollId=12345&step=0&limit=10`

**Advanced query with pagination.**

* Any filter field (`pollId`, `questionId`, etc.)
* `step`: zero-based page index
* `limit`: number of items per page (`DEFAULT_LIMIT` fallback)

**Response:** Array of statistics documents

---

## 🧭 Request Flow Diagram

```text
Client
  │
  ├── POST /api/statistics ─────────────▶ controller.createOne()
  │                                        └─▶ manager.createStatistics()
  │
  ├── PUT /api/statistics/:pollId/statistics ─▶ controller.updateOne()
  │                                        └─▶ manager.updateStatistics()
  │
  ├── PATCH /api/statistics/:pollId/form ──▶ controller.updateForm()
  │                                        └─▶ manager.updateStatisticsQuestionForm()
  │
  ├── GET /api/statistics/:pollId ─────────▶ controller.getBypollId()
  │
  ├── DELETE /api/statistics/:pollId ──────▶ controller.deleteOne()
  │
  └── DELETE /api/statistics/:pollId/questions/:questionId ─▶ controller.deleteQuestion()
```

---

## 🗒️ Business Logic / Design Notes

* Each `questionId` must be unique **per poll**.
* Within each question, each option must have a unique `_id` and `option` string.
* When PATCH-ing question options, **options are never deleted**, only added/updated. Old options remain until the whole question is deleted.
* When a question is deleted, all associated answer counts are also deleted.
* Option counters are preserved when updating the name of an existing option.
* Only questions of type `CHECKBOXES` allow multiple selected options in a single submission.
* **Zod** validates all request payloads; all errors are returned as JSON with status code and message.
* No authentication layer yet – intended for future release.
* Full coverage tests using Vitest (`/tests/statistics.spec.ts`).

---

## 🧪 Example Types

```ts
export interface IStatistics {
    pollId: string;
    questionStats: IQuestionStatistics[];
}

export interface IQuestionStatistics {
    questionId: string;
    questionType: QuestionType;
    totalAnswers: number;
    optionAnswerCounts: {
        _id?: string;
        option: string;
        count: number;
    }[];
}

export interface IStatisticsUpdateForm {
    questionId: string;
    questionType: QuestionType;
    options: { _id: string; option: string }[];
}
```

---

## 📦 Installation & Usage

### Clone

```bash
git clone https://gitlab.com/amanpolls/microservices/statistics-service.git
cd statistics-service
```

### Configure Environment

Set up `.env` and `.env.test` files:

```env
PORT=8000
DEFAULT_LIMIT=20
MONGO_URI=mongodb://statistics-mongo:27017/statistics
STATISTICS_COLLECTION_NAME=statistics
```

### Run with Docker

```bash
docker compose up --build
```

* App → [http://localhost:8000](http://localhost:8000)
* MongoDB → port 27017

---

### Run Tests

```bash
docker compose run --rm test
```

* Runs full coverage with Vitest
* Uses `.env.test` and test DB

---

## ⚡ FAQ & Gotchas

* **Updating options via PATCH will never remove options!** You must delete a question to remove its options.
* Submitting answers to non-selectable questions (like PARAGRAPH) will store unique answers in `optionAnswerCounts` as new options with a count.
* **No authentication** – the API is open by default.
* For breaking changes or schema updates, see CHANGELOG.md.

---

## 📄 License

MH© 2025 — All rights reserved.

---

*For questions, bug reports, or integration notes, contact the project maintainer.*
