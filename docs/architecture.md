# DayFlow Architecture & System Design

**DAYFLOW - Intelligent Workforce OS** is designed as a modular, full-stack Human Resource Management & Decision-Support System. Rather than functioning solely as a passive CRUD database, DayFlow introduces an intelligence layer providing deterministic staffing risk assessments, live workforce health metrics, and data-grounded natural language analytics.

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (React)                          │
│                                                                         │
│  ┌─────────────────────────┐   ┌─────────────────────────────────────┐  │
│  │   Employee Portal       │   │          Admin / HR Portal          │  │
│  │  - Check-in / Out       │   │  - Core HR (Attendance, Payroll)    │  │
│  │  - Apply Leaves         │   │  ★ Workforce Pulse (Live Health)    │  │
│  │  - View Payslips        │   │  ★ Smart Leave Impact (Risk Engine) │  │
│  │  - Profile Management   │   │  ★ HR Copilot (Data Assistant)      │  │
│  └────────────┬────────────┘   └──────────────────┬──────────────────┘  │
│               │                                   │                     │
│               └─────────────────┬─────────────────┘                     │
│                                 │ Axios / Service Layer                 │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │ HTTP / REST (JWT Auth)
┌─────────────────────────────────▼───────────────────────────────────────┐
│                      BACKEND SERVER (Node.js / Express)                 │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Express REST Controllers & Middleware (Auth, RBAC, Validation)    │  │
│  └──────────────────┬─────────────────────────────┬──────────────────┘  │
│                     │                             │                     │
│  ┌──────────────────▼──────────┐   ┌──────────────▼──────────────────┐  │
│  │   Core HR Services          │   │  Intelligence Services Engine   │  │
│  │   - Attendance Service      │   │  - Workforce Pulse Calculator   │  │
│  │   - Leave Service           │   │  - Deterministic Leave Risk     │  │
│  │   - Payroll Service         │   │  - HR Copilot Grounding Engine  │  │
│  │   - Employee Service        │   │    (Context Injector + LLM)     │  │
│  └──────────────────┬──────────┘   └──────────────┬──────────────────┘  │
│                     │                             │                     │
└─────────────────────┼─────────────────────────────┼─────────────────────┘
                      │ Mongoose ORM                │ Real Data Grounding
┌─────────────────────▼─────────────────────────────▼─────────────────────┐
│                       PERSISTENCE LAYER (MongoDB)                       │
│                                                                         │
│  Collections:                                                           │
│  - Users (Credentials, Roles: 'employee' | 'admin')                     │
│  - EmployeeProfiles (Job Title, Department, Manager, Skills)            │
│  - Attendances (Daily Logs, Check-in, Check-out, Status)                │
│  - LeaveRequests (Type, Date Range, Status: 'Pending'|'Approved'|'...') │
│  - Payrolls (Base Salary, Deductions, Allowances, Net Pay)              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Team Ownership & Module Separation

The repository enforces strict separation of concerns across the 4 engineers:

| Engineer | Primary Area | Core Files / Directories | Responsibilities |
|---|---|---|---|
| **Hamza** | Backend & Intelligence Engine | `backend/`, `database/` | Express REST API, Mongoose models, JWT auth & RBAC, attendance/payroll logic, workforce calculations, deterministic leave risk engine, LLM grounding service. |
| **Santhosh** | UI/UX & Design System | `frontend/src/components/`, `frontend/src/layout/`, `frontend/src/styles/` | Global CSS theme, dark/light design tokens, reusable UI components (Card, Button, Badge, Modal, Table), sidebar, topbar, responsive layout grid. |
| **Saksham** | Frontend Features & API Integration | `frontend/src/pages/`, `frontend/src/features/`, `frontend/src/api/`, `frontend/src/hooks/` | Standard CRUD pages (Login, Employee Dashboard, Attendance, Leave Submission, Payroll), Axios client, API endpoints, feature services. |
| **Kaustubh** *(Team Leader)* | Product, QA, Docs & 3 Differentiators | `frontend/src/pages/admin/WorkforcePulse.jsx`<br>`frontend/src/pages/admin/LeaveImpact.jsx`<br>`frontend/src/pages/admin/HRCopilot.jsx`<br>`docs/`, `tests/manual/`, `README.md` | Product vision, cross-module integration, API contract formalization, end-to-end QA checklist, demo flow & story, 3 intelligence differentiator pages. |

---

## 3. Data Flow Pipelines for the Three Differentiators

### Pipeline 1: Workforce Pulse (Live Workforce Health Snapshot)

```
[ MongoDB Attendance & Leave Logs ]
               │
               ▼
[ Hamza: workforce.service.js ]
  - Aggregates daily attendance %
  - Computes department-level coverage %
  - Evaluates threshold rules (e.g. Coverage < 75% triggers alert)
  - Identifies upcoming absence load
               │
               ▼  GET /api/workforce/pulse
[ Saksham: workforce.service.js (Frontend) ]
               │
               ▼  Imported by
[ Kaustubh: WorkforcePulse.jsx ]
  - Renders live StatCards (Attendance, Coverage, Leave Load, Risk)
  - Displays interactive Department Breakdown bars
  - Highlights real-time Workforce Alerts
  - Visualizes 7-day Attendance Trend
```

---

### Pipeline 2: Smart Leave Impact (Deterministic Risk Engine)

```
[ HR / Admin selects a pending leave request ]
               │
               ▼  GET /api/leave-impact/:leaveId
[ Hamza: leaveImpact.service.js & riskEngine.js ]
  1. Identifies applicant's department and date window.
  2. Queries existing approved/pending leaves overlapping the window.
  3. Calculates:
     - Baseline team headcount
     - Current scheduled coverage %
     - Projected coverage % if applicant's leave is approved
     - Coverage drop %
  4. Evaluates deterministic risk level:
     - LOW: Projected coverage >= 80% & no key roles affected
     - MEDIUM: Projected coverage between 70% - 79%
     - HIGH: Projected coverage < 70% OR critical role deficit
     - CRITICAL: Projected coverage < 50% OR >= 3 simultaneous absences
  5. Formulates actionable recommendation and concrete risk reasons.
               │
               ▼
[ Saksham: leaveImpact.service.js (Frontend) ]
               │
               ▼  Imported by
[ Kaustubh: LeaveImpact.jsx ]
  - Renders Coverage Delta Gauge (Current vs. Projected)
  - Visualizes overlapping teammate conflicts
  - Badges deterministic Risk Level with explicit backend rationales
  - Provides one-click Approve / Reject action triggers with reason modal
```

---

### Pipeline 3: HR Copilot (Data-Grounded Natural Language Assistant)

```
[ Admin enters natural language question ]
(e.g., "Which team has the lowest attendance rate this week?")
               │
               ▼  POST /api/copilot/query
[ Hamza: copilot.service.js ]
  1. Query Intent Classification (ATTENDANCE, LEAVE_RISK, PAYROLL, STAFFING).
  2. Live Data Extraction: Queries MongoDB for exact real-time metrics.
  3. Grounding Context Assembly: Injects structured JSON metrics into LLM prompt.
  4. Structured Response Generation: Returns plain English answer + structured breakdown.
               │
               ▼
[ Saksham: copilot.service.js (Frontend) ]
               │
               ▼  Imported by
[ Kaustubh: HRCopilot.jsx ]
  - Displays conversation timeline
  - Highlights Query Type & Grounding Confidence
  - Renders supporting structured data cards (comparative tables & badges)
  - Provides clickable follow-up inquiry chips
```

---

## 4. Security, RBAC & State Management

- **Role-Based Access Control (RBAC)**:
  - **Employee**: Can only view personal attendance logs, submit personal leave requests, and view personal payslips.
  - **Admin / HR**: Can view organization-wide attendance, evaluate smart leave impacts, view workforce pulse analytics, execute payroll disbursements, and interrogate HR Copilot.
- **Frontend State Handling**:
  - Modular React state with standard hooks (`useState`, `useEffect`, `useCallback`).
  - Strict loading, error retry, and empty state fallbacks across all views.
  - Zero hardcoded mock numbers in production pages when backend APIs are connected.
