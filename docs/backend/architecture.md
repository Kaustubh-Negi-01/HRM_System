# DayFlow Architecture & Technical Design

## 1. High-Level System Architecture

DayFlow is designed around a clean Layered MVC + Service Architecture:

```
[ Frontend (React + Vite) ]
          │
          ▼
[ Express Router & Middleware ]
  ├── auth.middleware.js (JWT Validation)
  ├── role.middleware.js (RBAC - ADMIN vs EMPLOYEE)
  ├── validate.middleware.js (Input Validation)
  └── error.middleware.js (Centralized Error Handler)
          │
          ▼
[ Controllers Layer ]
  ├── auth.controller.js
  ├── employee.controller.js
  ├── attendance.controller.js
  ├── leave.controller.js
  ├── payroll.controller.js
  ├── workforce.controller.js
  ├── leaveImpact.controller.js
  └── copilot.controller.js
          │
          ▼
[ Services Layer (Business Logic) ]
  ├── auth.service.js
  ├── employee.service.js
  ├── attendance.service.js
  ├── leave.service.js
  ├── payroll.service.js
  ├── workforce.service.js   <── [ Workforce Pulse Engine ]
  ├── leaveImpact.service.js <── [ Smart Leave Impact Simulator ]
  └── copilot.service.js     <── [ HR Copilot Intent Analyzer & AI Fallback ]
          │
          ▼
[ Utilities & Deterministic Engines ]
  ├── calculations.js
  ├── riskEngine.js
  ├── response.js
  └── constants.js
          │
          ▼
[ Data Layer (Mongoose ODM) ]
  ├── User.js
  ├── EmployeeProfile.js
  ├── Attendance.js
  ├── LeaveRequest.js
  └── Payroll.js
          │
          ▼
[ Database (MongoDB / MongoMemoryServer) ]
```

---

## 2. Core Differentiators & Intelligence Mechanics

### 2.1 Workforce Pulse (`backend/services/workforce.service.js`)
- Aggregates daily attendance, active approved leaves, and department distribution in real-time.
- Calculates deterministic metrics: `attendancePercentage`, `teamCoverage`, `leaveLoad`, `absenceRate`.
- Evaluates risk score (`LOW`, `MEDIUM`, `HIGH`) using configurable thresholds in `backend/utils/riskEngine.js`.
- Generates actionable alerts for HR admins.

### 2.2 Smart Leave Impact (`backend/services/leaveImpact.service.js`)
- Simulates the staffing impact of approving an individual leave request before HR makes the decision.
- Compares department size, existing approved leaves, and concurrent overlapping requests.
- Calculates projected team coverage drop (e.g. from 67% down to 33%).
- Produces deterministic risk rating and plain-language explanation without LLM hallucinations.

### 2.3 HR Copilot (`backend/services/copilot.service.js`)
- Answers natural language questions from HR managers by querying real database metrics.
- Pattern matches intents (lowest attendance team, absent employees today, pending leave requests, overall workforce pulse, historical trends, payroll summary).
- Returns structured context and concise answers, with optional OpenAI enhancement when `OPENAI_API_KEY` is provided.
