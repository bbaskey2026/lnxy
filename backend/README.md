# ExamPro Backend

The backend is a separate Node.js application with manual dependency wiring. It does not use a dependency-injection container library.

## Architecture

Request flow:

```text
Express route -> auth/authorization -> Zod validation -> controller -> service -> repository -> configured persistence
```

The backend keeps runtime concerns outside domain code:

- `src/config/` for environment, database, CORS, app, and redacting logger setup
- `src/modules/` for route/controller/service/repository/validator boundaries
- `src/middleware/` for cross-cutting HTTP concerns
- `src/database/mongodb/schemas/` for Mongoose identity, refresh-session, purchase, and subscription schemas
- `src/database/mongodb/` and `src/modules/auth/` for MongoDB-backed identity and refresh sessions
- `src/models/`, `src/repositories/`, `src/services/`, and `src/routes/` for shared implementations
- `tests/unit/` and `tests/integration/` for verification
- `scripts/` for database and fixture seeding

Dependency wiring is explicit in `src/server.js`. Classes receive dependencies through constructor injection without a container abstraction.

## Run

```powers
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

Set `AUTH_PERSISTENCE=mongodb` in `.env` for MongoDB (the default), or set `AUTH_PERSISTENCE=memory` to use process-local in-memory auth, purchase, and subscription storage in development/test. Memory mode loads the Aarav demo account and sample purchases (`aarav@example.com` / `student123`) and loses all changes when the server stops. If MongoDB mode is selected but MongoDB is unavailable, development/test still falls back to empty process-local storage. Production requires MongoDB and rejects memory mode. Start MongoDB before running `npm run seed` to load the persistent demo data.

API base: `http://localhost:4000/api/v1` (legacy `http://localhost:4000/api` is also supported)

Successful API responses use `{ "status": "SUCCESS", "statusCode": 0, "statusDesc": "...", "data": ... }`, with a description specific to the completed action. Errors use the same fields with `status: "FAILED"`, `statusCode: 1`, a failure description, and error details in `data`.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | aarav@example.com | student123 |
| Instructor | instructor@exampro.com | instructor123 |
| Admin | admin@exampro.com | admin123 |

## Health

```http
GET /api/v1/health
```

## Authentication examples

Register:

```http
POST /api/v1/auth/register
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
POST /api/v1/user/auth/dashboard
Content-Type: application/json
```

```json
{
  "email": "admin@exampro.com",
  "password": "admin123"
}
```

`POST /api/v1/auth/dashboard`, `POST /api/v1/auth/login`, and `POST /api/v1/user/auth/login` remain available as compatibility aliases.

## Examination examples

Create an examination with an admin or instructor access token:

```http
POST /api/v1/exams
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
GET /api/v1/exams
```

## Persistence and security

`AUTH_PERSISTENCE` selects MongoDB or process-local memory for authentication, purchases, and subscriptions. MongoDB storage uses email uniqueness, token-hash uniqueness, and token-expiry indexes; development/test may fall back to memory if MongoDB is unavailable. Memory data is local to the process and lost on restart. Production always requires MongoDB and never falls back. Refresh tokens are random, HttpOnly cookies; only keyed hashes are stored, and refresh is single-use/rotating. Authentication routes have an additional IP-based rate limit.

Purchases and subscriptions have separate Mongoose collections keyed by `studentId` (the student's `User.id`), so growing purchase history is not embedded in a single student document. Monetary values are stored as integer minor currency units. These schemas define storage only; this change does not add purchase or subscription API workflows. Do not store raw card numbers or security codes.

Other domain collections still use the JSON adapter under `src/database/json`; set `PERSISTENCE=json`. MongoDB connection strings and JWT secrets are read from environment variables and are never logged. Production startup requires unique JWT secrets, `MONGODB_URI`, and `COOKIE_SECURE=true`; use an authenticated TLS MongoDB connection, least-privilege DB credentials, and network restrictions. No system can be guaranteed attack-free.

Structured auth logs include event, method, route, request ID, result, and safe user identifiers. Passwords, authorization headers, cookies, and token values are redacted and are not intentionally logged.

## Tests

```powers
npm test
```
