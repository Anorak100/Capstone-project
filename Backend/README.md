# Fhast Pay Backend

This directory contains the API for the Fhast Pay capstone project.

## Local setup

1. Install dependencies with `npm install`.
2. Set `DATABASE_PROVIDER=sqlite` and `DATABASE_URL=file:./prisma/dev.db` for local SQLite, or omit `DATABASE_PROVIDER` to use the PostgreSQL schema.
3. Configure the SMTP variables to deliver signup verification emails.
4. Generate and migrate the SQLite client with `DATABASE_PROVIDER=sqlite DATABASE_URL=file:./prisma/dev.db npx prisma migrate dev --name init`.
5. Start the API with `DATABASE_PROVIDER=sqlite DATABASE_URL=file:./prisma/dev.db PORT=5000 npm run dev`.

## Signup verification

- `POST /api/v1/auth/register` creates a pending user, stores a six-digit code, and sends it to the submitted email address.
- `POST /api/v1/auth/verify` accepts `{ "identifier": "email", "code": "123456" }`. A valid code activates the user and creates their account.
- `POST /api/v1/auth/resend-verification` accepts `{ "email": "user@example.com" }` and replaces the pending code.

Codes expire after `OTP_TTL_MINUTES` (10 minutes by default). SMTP credentials are local environment settings and must not be committed.

Environment files containing real credentials are ignored by Git. Keep provider credentials local and out of version control.
