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

## Admin API

Admin endpoints require a JWT belonging to an active user with the `ADMIN` role:

- `GET /api/v1/admin/users?page=1&limit=20&search=` lists users and their accounts.
- `GET /api/v1/admin/users/:userId` returns a user, account details, and recent ledger entries.
- `PATCH /api/v1/admin/users/:userId/status` accepts `{ "isActive": false }` to freeze a user and their active accounts, or `true` to reactivate accounts frozen by this operation.
- `GET /api/v1/admin/transactions` lists ledger entries; filters include `type`, `status`, `userId`, `reference`, `from`, and `to`.
- `GET /api/v1/admin/transactions/:reference` returns one ledger entry or both entries for a transfer reference.
- `GET /api/v1/admin/metrics` returns user/account totals and successful transfer totals grouped by currency.
- `GET /api/v1/admin/transactions/flagged?minAmount=1000000` lists successful transfers above an explicit amount threshold. These are high-value review candidates, not an automated fraud determination.

The last active administrator cannot be deactivated, and administrators cannot deactivate their own account.

## Transfers and history

Both endpoints require `Authorization: Bearer <token>`:

- `POST /api/transactions/transfer` accepts `fromAccount`, `toAccount`, `amount`, and an optional `description`.
- `GET /api/transactions/history` returns the authenticated user's transaction entries, newest first. Optional query parameters: `page`, `limit` (maximum 100), `type`, `status`, and `accountNumber`.

Transfers debit and credit accounts and write matching ledger entries in one database transaction. Insufficient funds are rejected without changing either balance.
