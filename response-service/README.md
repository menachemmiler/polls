# 📦 Users Service

A Node.js microservice built with **Express**, **MongoDB**, and **TypeScript** that manages user data, including creation, retrieval, updates, and deletions. It supports advanced query filtering, pagination, and count-based operations.

---

## 🚀 Features

- Create, update, delete, and fetch users by `genesisId`
- Flexible querying with filtering and pagination
- API-ready error handling and logging with Winston
- Built-in health check endpoint (`/api/isAlive`)
- Full TypeScript support with ESLint and Prettier
- Environment configuration via `.env`
- Docker & CI/CD ready

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB via Mongoose
- **Validation:** Zod
- **Testing:** Vitest + Supertest
- **Logging:** Winston
- **Security:** Helmet, CORS

---

## 🛠️ Setup

### 1. Clone the repo

```bash
git clone https://gitlab.com/work1214403/whatsdown/-/tree/users-service/users-service?ref_type=heads
cd users-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file at the root with the following variables:

```env
MONGO_URI=mongodb://localhost:27017/whatsdowne
USERS_COLLECTION_NAME=users
PORT=3000
CORS_ORIGIN=*
```

You can also use `.env.dev` and set `LOAD_DEV_DOTENV=true` before running the service to load dev settings.

### 4. Run the service

```bash
npm run dev
```

Or build and run:

```bash
npm run build
npm start
```

---

## 🐳 Docker

To build and run the service with Docker:

```bash
docker build -t users-service .
docker run -p 3001:3001 --env-file .env users-service
```

Or use `docker-compose`:

```bash
docker-compose up
```

---

## 📡 API Endpoints

Base URL: `/api/users`

| Method | Endpoint                        | Description                      |
|--------|----------------------------------|----------------------------------|
| GET    | `/api/users`                    | Get users by query               |
| GET    | `/api/users/count`              | Get user count                   |
| GET    | `/api/users/genesis/:genesisId` | Get a user by Genesis ID         |
| POST   | `/api/users`                    | Create a new user                |
| PUT    | `/api/users/genesis/:genesisId` | Update user by Genesis ID        |
| DELETE | `/api/users/:id`                | Delete a user by ID              |
| GET    | `/api/users/genesis-ids`        | Get all Genesis IDs              |

Other endpoints:

| Method | Endpoint     | Description         |
|--------|--------------|---------------------|
| GET    | `/api/isAlive` | Health check       |

---

## 🧪 Testing

To run tests with UI and coverage:

```bash
npm test
```

---

## 🧹 Scripts

Useful npm scripts:

- `dev`: Build and run
- `build`: Compile TypeScript
- `lint`: Run ESLint
- `prettier`: Check code formatting
- `test`: Run tests

---

## 🤝 Contributing

Feel free to fork the repo and submit pull requests. Please make sure your code passes linting and tests.

---

## 📝 License

ISC License © Vision