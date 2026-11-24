# ExamPro Backend

The backend is a separate Node.js application with manual dependency wiring. It does not use a dependency-injection container library.

## Architecture

Request flow:

```text
Express route -> auth/authorization -> Zod validation -> controller -> service -> repository -> JSON database
```

`src/container/container.js` is the explicit composition root. Classes receive dependencies through constructor injection.

## Run

```powers
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

API base: `http://localhost:4000/api`

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | aarav@example.com | student123 |
| Instructor | instructor@exampro.com | instructor123 |
| Admin | admin@exampro.com | admin123 |

## Health

```http
GET /api/health
```

## Authentication examples

Register:

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Test Student",
  "email": "student@example.com",
  "password": "password123"
}
```

Login:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "admin@exampro.com",
  "password": "admin123"
}
```

## Examination examples

Create an examination with an admin or instructor access token:

```http
POST /api/exams
Authorization: Bearer <access-token>
Content-Type: application/json
```

```json
{
  "name": "SSC CHSL",
  "category": "SSC Examinations",
  "description": "Clerical recruitment examination",
  "durationMinutes": 60,
  "totalMarks": 200,
  "negativeMarking": 0.5
}
```

List:

```http
GET /api/exams
```

## Persistence

The initial JSON demo adapter is implemented under `src/database/json`. PostgreSQL and MongoDB are intentionally not represented as working adapters until their implementations are completed. Set `PERSISTENCE=json`.

## Tests

```powers
npm test
```
