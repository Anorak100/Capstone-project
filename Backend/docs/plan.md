# Fhast Pay — Backend Blueprint & Guide

> Complete architecture, database models, and service-oriented structure for Node.js, Express, and Prisma.

---

## 1. Architectural Principles

Fhast Pay implements a strict **Service-Oriented Architecture (SOA)** ensuring clear separation of concerns across the application lifecycle:

* **Controllers ("The Waiters"):** Manage HTTP request/response lifecycles, parse security credentials, invoke Zod validation schemas, and return structured JSON responses with proper HTTP status codes.
* **Services ("The Chefs"):** House pure business logic, financial calculations, and Prisma database transactions. Fully decoupled from Express so they can be seamlessly reused in cron jobs, background workers, or CLI tools.
* **Middlewares ("The Gatekeepers"):** Enforce perimeter security, handling authentication tokens (`verifyAuth`), administrative clearance (`verifyAdmin`), and payload validation schemas.

> [!IMPORTANT]
> **Core Development Rule:**  
> Never execute database queries directly inside HTTP controllers. All database interactions must be strictly encapsulated inside dedicated service modules.

---

## 2. Database Schema Design (Prisma)

The Neon PostgreSQL database schema models users, wallets, immutable ledgers, verification codes, and administrative roles:

| Model / Enum | Fields / Structure | Purpose |
| :--- | :--- | :--- |
| **`User`** | `id`, `firstName`, `lastName`, `email`, `phone`, `password`, `role` (`CUSTOMER` / `ADMIN`) | Stores core user profile credentials and access permission levels. |
| **`Account`** | `id`, `userId`, `accountNumber` (phone-based), `balance` (`Decimal`), `currency` | Manages user wallet balances and multi-currency support (default: `NGN`). |
| **`Transaction`** | `id`, `reference`, `senderId`, `recipientId`, `amount`, `type`, `status` | Immutable double-entry audit ledger tracking transfers and deposits. |
| **`VerificationCode`** | `id`, `identifier`, `code`, `type` (`REGISTRATION` / `PASSWORD_RESET`), `expiresAt` | Handles OTP verification tokens for authentication and recovery flows. |

---

## 3. Core Customer API Endpoints

Customer-facing routes secured via JWT authentication:

| Module | Method | Endpoint Path | Description |
| :--- | :---: | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register user profile, hash password, and dispatch OTP. |
| **Auth** | `POST` | `/api/auth/login` | Authenticate credentials and issue secure JWT access token. |
| **Accounts** | `GET` | `/api/accounts/balance` | Fetch authenticated user's wallet balance and currency. |
| **Accounts** | `POST` | `/api/accounts/lookup` | Name enquiry verification of recipient phone number. |
| **Transactions** | `POST` | `/api/transactions/transfer` | Execute atomic peer-to-peer fund transfer across accounts. |
| **Transactions** | `GET` | `/api/transactions/history` | Retrieve chronologically sorted debit and credit history. |

---

## 4. Administrative Back-Office Plan (`/api/admin`)

Protected by dual-guard middlewares (`verifyAuth` + `verifyAdmin`) to restrict access strictly to platform operators.

### 4.1 User Management
Mitigate fraud, inspect customer accounts, and control system access.

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/admin/users` | Paginated listing of registered users. |
| `GET` | `/api/admin/users/:id` | Detailed profile inspection and associated wallet status. |
| `PATCH` | `/api/admin/users/:id/status` | Account freezing and unfreezing controls to mitigate fraud. |

### 4.2 Transaction Auditing
Global ledger oversight and fraud tracking.

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/admin/transactions` | Global system ledger oversight across all users, filtered by status/type. |
| `GET` | `/api/admin/transactions/:reference` | Tracing and inspection for a specific transaction reference. |

### 4.3 Risk & Metrics Dashboard
Platform health, aggregate volumes, and automated anomaly flagging.

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/admin/metrics` | Platform health analytics (total users, active wallets, cash flow volume). |
| `GET` | `/api/admin/risk/flagged` | Retrieval of flagged high-risk or anomalous transactions. |

---

## 5. Implementation Strategy & Milestones

A phased rollout ensures stability before complexity is layered in:

1. **Phase 1: Core User & Auth Engine**
   - Provision Neon PostgreSQL with Prisma schema migrations.
   - Implement registration, password hashing, OTP verification, and JWT authentication.
2. **Phase 2: Accounts & Atomic Transactions**
   - Implement phone-based account number generation.
   - Build ACID-compliant double-entry transfer service with balance locks.
   - Connect client balance retrieval and transaction history queries.
3. **Phase 3: Administrative Back-Office**
   - Add role-based middleware (`verifyAdmin`).
   - Implement user freezing, audit log search, and metrics aggregation.
4. **Phase 4: Frontend Integration**
   - Wire customer and operator endpoints to the React (Vite) client interface.
