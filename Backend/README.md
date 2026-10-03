# Fhast Pay Backend

This directory contains the API for the Fhast Pay capstone project. PostgreSQL is the database provider.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
3. Generate the Prisma client with `npm run prisma:generate`.
4. Apply migrations with `npx prisma migrate deploy`.
5. Start the API with `npm run dev`.

## Authentication

- `POST /api/v1/auth/register` creates an active user and bank account.
- `POST /api/v1/auth/login` accepts a phone number and password, then returns a JWT.

## Transfers and history

Both endpoints require `Authorization: Bearer <token>`:

- `POST /api/transactions/transfer` accepts `fromAccount`, `toAccount`, `amount`, and an optional `description`.
- `GET /api/transactions/history` returns the authenticated user's transaction entries, newest first. Optional query parameters: `page`, `limit` (maximum 100), `type`, `status`, and `accountNumber`.

Transfers debit and credit accounts and write matching ledger entries in one database transaction. Insufficient funds are rejected without changing either balance.
