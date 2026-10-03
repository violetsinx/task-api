# task-api

Production-ready REST API manajemen task untuk showcase portfolio backend developer.

![CI Status](https://github.com/violetsinx/task-api/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-6.x-blueviolet.svg)

---

## Highlights & Keunggulan Arsitektur

- **Clean Layered Architecture**: Pemisahan tanggung jawab secara tegas (`routes` -> `middlewares` -> `controllers` -> `services` -> `repositories` -> `Prisma/PostgreSQL`).
- **Secure Authentication & Authorization**:
  - Hashing password dengan `bcrypt` (12 salt rounds).
  - Stateless authentication via JSON Web Tokens (JWT).
  - Sanitasi response (tidak pernah mengekspos `passwordHash`).
- **Strict Multi-Tenant / Ownership Scoping (Anti-IDOR)**:
  - Validasi kepemilikan resource `Task` dilakukan langsung pada query database layer (`findFirst({ where: { id, userId } })`), mencegah akses tidak sah antar-user.
- **Strict Input Validation**: Validasi schema menyeluruh menggunakan `Zod` pada request body dan URL route parameter.
- **Automated Integration Testing**: Suite testing komprehensif menggunakan `node:test` native runner + `Supertest` dengan database PostgreSQL terisolasi.
- **OpenAPI 3.0 Contract**: Spesifikasi API lengkap dan terdokumentasi di [`openapi.yaml`](./openapi.yaml).
- **CI/CD Quality Gates**: Otomasi GitHub Actions untuk linting ESLint, formatting Prettier, validasi migrasi Prisma, dan automated testing.

---

## Tech Stack

| Layer              | Teknologi                                           |
| ------------------ | --------------------------------------------------- |
| **Runtime**        | Node.js 22+ (ES Modules)                            |
| **Framework**      | Express 5                                           |
| **Database & ORM** | PostgreSQL 17, Prisma ORM 6                         |
| **Validation**     | Zod                                                 |
| **Security**       | bcrypt, jsonwebtoken                                |
| **Testing**        | Node.js Native Test Runner (`node:test`), Supertest |
| **Code Quality**   | ESLint, Prettier                                    |
| **Specification**  | OpenAPI 3.0.3                                       |

---

## Architecture Flow

```text
HTTP Request
   │
   ▼
[ Express Router ] ──► [ Auth Middleware (JWT Verification) ]
   │
   ▼
[ Validation Middleware (Zod) ]
   │
   ▼
[ Controller ] (HTTP Request/Response translation)
   │
   ▼
[ Service ] (Business Logic & Domain Sanitization)
   │
   ▼
[ Repository ] (Database Queries scoped by userId)
   │
   ▼
[ Prisma ORM & PostgreSQL ]
```

---

## API Endpoints Overview

Semua route task dilindungi header `Authorization: Bearer <token>`.

| Method   | Endpoint                | Deskripsi                                  | Auth   |
| -------- | ----------------------- | ------------------------------------------ | ------ |
| `GET`    | `/api/v1/health`        | Health check endpoint                      | Public |
| `POST`   | `/api/v1/auth/register` | Mendaftarkan user baru                     | Public |
| `POST`   | `/api/v1/auth/login`    | Login user & generate JWT access token     | Public |
| `GET`    | `/api/v1/tasks`         | Mengambil semua task milik user yang login | Bearer |
| `POST`   | `/api/v1/tasks`         | Membuat task baru                          | Bearer |
| `GET`    | `/api/v1/tasks/:id`     | Mengambil detail task berdasarkan ID       | Bearer |
| `PATCH`  | `/api/v1/tasks/:id`     | Memperbarui task (status, priority, dll)   | Bearer |
| `DELETE` | `/api/v1/tasks/:id`     | Menghapus task berdasarkan ID              | Bearer |

Lihat [`openapi.yaml`](./openapi.yaml) untuk spesifikasi request/response schema lengkap.

---

## Quickstart & Local Setup

### 1. Prasyarat

- Node.js 22+
- PostgreSQL atau Docker

### 2. Instalasi

```bash
git clone https://github.com/violetsinx/task-api.git
cd task-api
npm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
```

Sesuaikan `.env`:

```dotenv
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_api"
JWT_SECRET="super-secret-jwt-key"
NODE_ENV="development"
```

### 4. Database Migration & Menjalankan Server

```bash
npx prisma migrate deploy
npm run dev
```

Server berjalan di `http://localhost:3000`.

---

## Testing & Quality Assurance

Proyek ini dilengkapi pengujian integrasi end-to-end:

```bash
# Menjalankan linter
npm run lint

# Memeriksa format kode
npm run format:check

# Menjalankan seluruh test suite
DATABASE_URL="postgresql://postgres@localhost:55432/task_api_test" JWT_SECRET="test-secret" npm test
```

### Cakupan Pengujian:

1. **Health Check**: Status 200 service readiness.
2. **Registration**: Normalisasi email, enkripsi password, sanitasi output, duplikasi email (409), validasi format (400).
3. **Authentication**: Login kredensial valid, proteksi token palsu/kedaluwarsa (401).
4. **Task CRUD**: Create, read, update, delete operasi task.
5. **IDOR Prevention / Tenant Scoping**: Verifikasi user A tidak dapat membaca/mengubah/menghapus task milik user B (404 Not Found).
