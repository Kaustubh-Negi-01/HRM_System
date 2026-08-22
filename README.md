# DayFlow — Intelligent Workforce OS

> An intelligent, proactive Human Resource Management & Decision-Support System built for modern organizations.

---

## 🌟 The Core Vision

Most HRMS applications are passive record-keeping tools: employees submit forms, HR clicks approve, and data sits in silos. 

**DayFlow** transforms HRMS into an **Intelligent Workforce Operating System** by introducing proactive decision support, real-time staffing risk simulations, and natural language data intelligence grounded in actual workforce records.

---

## 🚀 The Three Key Differentiators

### 1. Workforce Pulse (`/admin/workforce-pulse`)
A live visual snapshot of organizational health:
- **Real-Time Health Metrics**: Overall Attendance %, Team Coverage %, Leave Load %, Present vs. Absent counts, and automated Absence Risk level (`LOW`, `MEDIUM`, `HIGH`).
- **Workforce Alerts**: Real-time automated notifications when departmental coverage drops below operational thresholds.
- **Department Breakdown**: Visual capacity indicators across Engineering, Support, Product, and Marketing.
- **7-Day Attendance Trend**: Interactive rolling chart tracking attendance stability.

### 2. Smart Leave Impact (`/admin/leave-impact`)
Intelligent leave decision support before HR approves or rejects a request:
- **Coverage Simulation**: Visualizes Current Team Coverage vs. Projected Team Coverage after approval.
- **Conflict & Overlap Detection**: Instantly highlights concurrent team absences and critical role vacancies in the same time window.
- **Deterministic Risk Engine**: Calculates risk levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) using mathematical staffing thresholds rather than hallucinated estimates.
- **Actionable Decision Guidance**: One-click approval/rejection with built-in audit rationale logging.

### 3. HR Copilot (`/admin/copilot`)
An AI-powered data assistant grounded in actual application data:
- **Data-Grounded Queries**: Answers questions like *"Who has the highest absence rate this month?"*, *"Which team has the lowest attendance?"*, or *"Why is Support team coverage low?"*.
- **Structured Data Cards**: Displays interactive tables, department breakdowns, and metrics alongside conversational answers.
- **Curated Prompt Suggestions**: Pre-built prompt chips showcasing high-impact analytics.
- **Deterministic Fallback & Grounding**: Eliminates hallucinations by strictly binding answers to live database records.

---

## 👥 Team & Module Ownership

| Member | Role | Ownership Area | Key Deliverables |
|---|---|---|---|
| **Kaustubh** | Team Leader & Product Lead | Product Coordination, QA, Docs, Differentiators | `frontend/src/pages/admin/WorkforcePulse.jsx`<br>`frontend/src/pages/admin/LeaveImpact.jsx`<br>`frontend/src/pages/admin/HRCopilot.jsx`<br>`docs/`, `tests/manual/TEST_CHECKLIST.md`, `README.md` |
| **Hamza** | Backend Engineer | API, Database & Intelligence Backend | `backend/` (Express REST API, Mongoose Models, JWT Auth, RBAC, Calculations, Copilot Grounding Engine), `database/` |
| **Santhosh** | UI/UX & Frontend Architect | Design System & Shared Layout | `frontend/src/components/`, `frontend/src/layout/`, `frontend/src/styles/` (Theme, Design Tokens, Reusable Components) |
| **Saksham** | Frontend Engineer | Feature Implementation & API Client | `frontend/src/pages/` (Auth, Employee Portal, Admin CRUD), `frontend/src/features/`, `frontend/src/api/`, `frontend/src/hooks/` |

---

## 📂 Project Structure

```
HRM_System/
├── backend/                  # Node.js + Express REST API (Hamza)
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # Business logic controllers
│   ├── middleware/           # Auth, role check, validation middleware
│   ├── models/               # Mongoose schemas (User, Profile, Attendance, Leave, Payroll)
│   ├── routes/               # Express route handlers
│   ├── services/             # Core business & intelligence calculation services
│   └── server.js             # API entrypoint
├── database/                 # Schema documentation and seed data
├── docs/                     # Architecture, API contracts, features, and demo script (Kaustubh)
│   ├── api.md                # Authoritative REST API specification
│   ├── architecture.md       # System design & data flow pipelines
│   ├── features.md           # Feature matrix & differentiator deep-dive
│   └── demo-flow.md          # 10-step hackathon judge demo narrative
├── frontend/                 # React + Vite client
│   └── src/
│       ├── api/              # Axios client and endpoint definitions (Saksham)
│       ├── components/       # Shared UI components & layout (Santhosh)
│       ├── features/         # Frontend service integrations (Saksham)
│       ├── pages/admin/      # Admin pages including WorkforcePulse, LeaveImpact, HRCopilot
│       ├── pages/employee/   # Employee portal pages
│       └── styles/           # Global CSS variables and design tokens
└── tests/                    # Backend, frontend, and manual QA checklists (Kaustubh)
    └── manual/
        └── TEST_CHECKLIST.md # End-to-end verification checklist
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB (running locally or MongoDB Atlas URI)

### 2. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/Kaustubh-Negi-01/HRM_System.git
cd HRM_System

# Install dependencies for both frontend and backend
npm run setup

# Configure environment variables
cp .env.example backend/.env
```

### 3. Running Locally
```bash
# Start backend API (Port 5000)
cd backend && npm run dev

# Start frontend application (Port 5173)
cd frontend && npm run dev
```

---

## 📖 Documentation & Demo Guide
- [API Contract & Schema Specification](docs/api.md)
- [System Architecture & Data Flows](docs/architecture.md)
- [Feature Matrix & Differentiators](docs/features.md)
- [10-Step Judge Demo Walkthrough](docs/demo-flow.md)
- [Manual QA Test Checklist](tests/manual/TEST_CHECKLIST.md)
