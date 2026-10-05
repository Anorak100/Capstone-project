# Fhast Pay 💳⚡

> **A high-speed, secure digital banking and transaction ledger platform.**  
> Capstone Project developed with ❤️ by **Group 13 · TS Academy · Hajime Cohort (Backend Development)**.

---

## 🌟 Overview

**Fhast Pay** is a full-stack digital banking application engineered to simulate modern, high-reliability fintech banking operations. It combines an Express/PostgreSQL ledger backend with a responsive React/TypeScript frontend.

The platform provides instant account onboarding, peer-to-peer money transfers with ACID database transactions, live recipient account lookup, real-time transaction history, and an administrative control panel for system metrics and compliance audits.

To facilitate testing and evaluation right out of the box, every newly registered user automatically receives an instant **₦100,000.00 Welcome Demo Bonus** credited directly to their ledger account.

---

## 🚀 Key Features

### 👤 Customer Experience
- **Quick Account Registration:** Onboard in seconds with phone number and a secure 6-digit password.
- **₦100,000 Welcome Bonus:** Instant signup bonus credited to the ledger upon registration with a celebratory unlock modal, allowing immediate peer-to-peer transfer testing.
- **Automatic 10-Digit Account Number:** Deterministically generated from phone numbers with collision-handling retries.
- **Interactive Dashboard:** Luxury glassmorphic virtual debit card with EMV chip, live balance reveal/hide toggle, copy-to-clipboard account number, and quick actions.
- **4-Digit Transaction PIN:** Bank-grade PIN security for authorizing all money transfers. First-time users are prompted to set up their 4-digit PIN on their initial transfer, and can manage or change it anytime in the Profile settings.
- **Peer-to-Peer Transfers:** Transfer money between any Fhast Pay accounts with real-time recipient verification, PIN authorization, and instant receipt generation.
- **Transaction History & Filters:** Full financial ledger view with instant search, categorization (Transfers, Deposits), and direction indicators (Credit/Debit).
- **Profile & Security Settings:** Personal account details, PIN management, banking credentials preview, and account security tags.

### 🛡️ Administrative Portal
- **Executive Metrics:** Real-time overview of total registered users, active bank accounts, aggregate deposits, and transfer volume.
- **User & Account Management:** Full customer directory with instant search and one-click account freeze/reactivate controls.
- **Ledger Audit & Flagged Transfers:** Searchable transaction history across all users, with high-value transfer flagging for compliance reviews.
- **Security Guardrails:** Built-in safeguards preventing administrator self-deactivation or deactivation of the last active admin.

### ⚙️ Backend & Architecture
- **ACID Database Transactions:** Transfers debit and credit accounts in a single atomic database transaction via Prisma ORM, preventing balance inconsistency or partial execution.
- **Double-Entry Ledger:** Every transfer writes symmetric `DEBIT` and `CREDIT` records with unique `FHP-` tracking references.
- **HTTP Request Logging:** Integrated `morgan` logging (colorized `dev` format for local development, standardized `combined` format for production).
- **Validation & Security:** Zod request schema validation, bcrypt password hashing (cost factor 12), and JWT bearer authentication.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, React Router 7, Vanilla CSS Modules, Feather Icons (`react-icons/fi`) |
| **Backend** | Node.js, Express.js, Prisma ORM, PostgreSQL |
| **Authentication & Security** | JWT (JSON Web Tokens), Bcrypt.js, Zod Schema Validation |
| **Logging & Monitoring** | Morgan HTTP Logger |
| **Database Tools** | Prisma Studio, Prisma Migrate |

---

## 📁 Repository Structure

```text
Capstone-project/
├── Backend/                       # Express.js REST API & Database
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (User, Account, Transaction)
│   │   └── migrations/            # SQL migration history
│   ├── src/
│   │   ├── Controllers/           # Route controller handlers
│   │   ├── routes/                # Express API routes (auth, account, transaction, admin)
│   │   ├── services/              # Business logic & database operations
│   │   ├── validations/           # Zod validation schemas
│   │   ├── middlewares/           # Auth, error, and role validation middlewares
│   │   └── app.js                 # Express application initialization & middleware
│   └── package.json
│
├── Frontend/Fhast Pay/            # React + TypeScript Client
│   ├── public/
│   │   └── favicon.svg            # Fhast Pay brand shield icon
│   ├── src/
│   │   ├── components/            # Reusable UI components (Toast, Navbars, Modals)
│   │   ├── layouts/               # CustomerLayout, AdminLayout
│   │   ├── pages/                 # Public, Customer, and Admin pages
│   │   ├── services/              # API clients (auth, accounts, transactions, admin)
│   │   └── styles/                # CSS design system, variables, and global tokens
│   ├── vite.config.ts             # Vite configuration with API proxy
│   └── package.json
│
└── README.md                      # Project documentation
```

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database (local instance or cloud database such as Neon / Supabase)
- [Git](https://git-scm.com/)

---

### 1. Clone Repository & Setup Backend

```bash
# 1. Clone the repository
git clone https://github.com/Anorak100/Capstone-project.git
cd Capstone-project/Backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file inside Backend/
```

Example `Backend/.env`:
```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/fhastpay?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
NODE_ENV="development"
```

```bash
# 4. Generate Prisma client & apply database migrations
npm run prisma:generate
npx prisma migrate deploy

# 5. Start the backend API server
npm run dev
```
> The Backend API will be running at `http://localhost:3000`.

---

### 2. Setup Frontend Application

Open a new terminal window:

```bash
# 1. Navigate to frontend directory
cd "Capstone-project/Frontend/Fhast Pay"

# 2. Install dependencies
npm install

# 3. Configure frontend environment variables
# Create a .env file inside "Frontend/Fhast Pay/"
```

Example `Frontend/Fhast Pay/.env`:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

```bash
# 4. Start the frontend development server
npm run dev
```
> The Frontend application will be available at `http://localhost:5173`.

---

## 🧪 Testing Transfers & User Flow

You can test the entire banking loop locally without manual database seeding:

1. **Register User A:**
   - Navigate to `http://localhost:5173/register`
   - Fill in name, email, phone (e.g. `08100000001`), and a 6-digit password (e.g. `123456`).
   - Notice the **Welcome Bonus Modal** confirming **₦100,000.00** credited to User A!
   - Note the generated 10-digit account number displayed in the modal.
2. **Register User B:**
   - In an incognito window or after signing out, register User B (e.g. phone `08100000002`, password `123456`).
   - User B also receives their **₦100,000.00** welcome demo balance.
3. **Execute a Transfer:**
   - Log into User A's account at `http://localhost:5173/login`.
   - Go to **Transfer Funds**.
   - Enter User B's 10-digit account number; observe the real-time verified recipient badge appear.
   - Enter an amount (e.g. `25000`) and optional note, then click **Confirm Transfer**.
   - Review the instant transfer receipt and check the updated balance on your dashboard.
4. **Verify Ledger:**
   - Log into User B's account to observe the incoming credit and increased balance.

---

## 🔌 API Reference Overview

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user, generate bank account, and grant ₦100k demo bonus |
| `POST` | `/api/v1/auth/login` | Authenticate with phone number + 6-digit password; returns JWT |

### Customer Banking (`/api/v1/accounts` & `/api/transactions`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/accounts/balance` | Fetch active user's account details and balance |
| `GET` | `/api/v1/accounts/lookup/:accountNumber` | Look up recipient name by 10-digit account number |
| `GET` | `/api/v1/accounts/pin-status` | Check if user has configured their 4-digit transaction PIN |
| `POST` | `/api/v1/accounts/pin` | Create or update 4-digit transaction PIN |
| `POST` | `/api/transactions/transfer` | Execute atomic transfer between accounts (requires 4-digit PIN) |
| `GET` | `/api/transactions/history` | Paginated transaction history with type/status filters |

### Admin Controls (`/api/v1/admin`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/metrics` | System aggregates (users, accounts, transfer volume) |
| `GET` | `/api/v1/admin/users` | Paginated user directory with search |
| `GET` | `/api/v1/admin/users/:userId` | User profile, accounts, and recent transactions |
| `PATCH` | `/api/v1/admin/users/:userId/status` | Freeze or reactivate user and associated accounts |
| `GET` | `/api/v1/admin/transactions` | Full ledger entries across all users |
| `GET` | `/api/v1/admin/transactions/flagged` | Audit high-value transactions above review threshold |

---

## 👥 Authors & Acknowledgments

This platform was built as the Capstone Project for **TS Academy**:
- **Group 13 · Hajime Cohort (Backend Development)**
- Special thanks to TS Academy instructors and mentors for technical guidance throughout the cohort.