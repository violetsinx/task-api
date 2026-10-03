# task-api

`task-api` adalah REST API manajemen task untuk portfolio backend Node.js.

## Project overview

Phase 1 menyediakan fondasi aplikasi dan satu vertical slice lengkap: `GET /api/v1/health` dan `POST /api/v1/auth/register`. Register memvalidasi input, menormalisasi email, melakukan hashing password dengan bcrypt, lalu menyimpan user melalui Prisma ke PostgreSQL.

Login, JWT aktif, dan task CRUD sengaja belum diimplementasikan.

## Tech stack

Node.js 22+, JavaScript ESM, Express 5, PostgreSQL, Prisma 6, Zod, bcrypt, `node:test`, Supertest, ESLint, Prettier, dotenv, Docker Compose.

## Architecture

```text
request -> route -> validation -> controller -> service -> repository -> Prisma -> PostgreSQL -> response
```

```text
src/
├── config/         environment dan Prisma client
├── controllers/    HTTP request/response
├── middlewares/    validation, auth example, error handling
├── routes/         route definitions
├── services/       business logic register
├── repositories/   akses data Prisma
├── validators/     schema Zod
├── utils/          helper bersama
├── app.js          Express app
└── server.js       HTTP server startup
```

`app.js` diekspor untuk testing tanpa membuka port. `server.js` menangani startup server.

## Database schema

`User` menyimpan identitas user dan `password_hash`; email unique. `Task` sudah didefinisikan untuk milestone berikutnya.

```text
users: id, name, email, password_hash, created_at, updated_at
tasks: id, user_id, title, description, status, priority, due_date, created_at, updated_at
```

Task status: `todo`, `in_progress`, `done`. Task priority: `low`, `medium`, `high`.

## API endpoints

### Health check

```http
GET /api/v1/health
```

Response `200`: `{ "status": "ok" }`

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json
```

Request:

```json
{ "name": "Ada Lovelace", "email": "ada@example.com", "password": "password123" }
```

Response `201`:

```json
{
  "user": {
    "id": 1,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "createdAt": "2026-10-03T00:00:00.000Z",
    "updatedAt": "2026-10-03T00:00:00.000Z"
  }
}
```

Invalid input returns `400`; duplicate email returns `409`; unexpected errors are logged server-side and return `500`. `passwordHash` never appears in responses.

## Local setup

Requirements: Node.js 22+, PostgreSQL, and Docker Compose.

```bash
npm install
cp .env.example .env
docker compose up -d
npx prisma migrate deploy
npm run dev
```

API: `http://localhost:3000`.

Without Docker, point `DATABASE_URL` at an existing PostgreSQL database and run `npx prisma migrate deploy`.

## Environment variables

| Variable       | Example                                                  | Description               |
| -------------- | -------------------------------------------------------- | ------------------------- |
| `PORT`         | `3000`                                                   | HTTP server port          |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/task_api` | PostgreSQL connection URL |
| `NODE_ENV`     | `development`                                            | Runtime environment       |

`.env` is local-only and must not be committed.

## Testing

```bash
npm run lint
npm run format:check
npm test
```

Register tests verify persistence, email normalization, password hashing, response sanitization, invalid input, and duplicate email. Use a disposable database; never point tests at production.

## Docker usage

Docker Compose provides PostgreSQL only:

```bash
docker compose up -d
docker compose ps
npx prisma migrate deploy
docker compose down
```

The application runs on the host with `npm run dev` during Phase 1. Full application containerization is deferred.

## Future improvements

1. Login with password verification.
2. JWT signing.
3. JWT verification and protected routes.
4. Create/list task with owner scoping.
5. Task detail, update, and delete.
6. Task validation and domain errors.
7. Pagination, filtering, sorting, and search.
8. OpenAPI/Swagger documentation.
9. Request logging and rate limiting.
10. Database-backed health check and graceful shutdown.
11. CI and deployment configuration.

Suggested commits:

```text
feat: add login with password verification
feat: add jwt authentication middleware
feat: add task creation and list endpoints
feat: enforce task ownership on detail update and delete
feat: add task query parameters
docs: publish OpenAPI contract
chore: add CI quality gates
```
