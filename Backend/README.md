# Fhast Pay Backend

This directory contains the API for the Fhast Pay capstone project. PostgreSQL is the database provider.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
3. Generate the Prisma client with `npm run prisma:generate`.
4. Apply migrations with `npx prisma migrate deploy`.
5. Start the API with `npm run dev`.

## Signup verification

- `POST /api/v1/auth/register` creates a pending user, stores a six-digit code, and emails it.
- `POST /api/v1/auth/verify` accepts `{ "identifier": "email", "code": "123456" }`. A valid code activates the user and creates their account.
- `POST /api/v1/auth/resend-verification` accepts `{ "email": "user@example.com" }` and replaces the pending code.

Codes expire after `OTP_TTL_MINUTES` (10 minutes by default). SMTP credentials belong in local environment settings and must not be committed.
