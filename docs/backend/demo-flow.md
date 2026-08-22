# DayFlow Hackathon Demo Flow

This guide walks through the live presentation flow for demonstrating DayFlow's differentiators.

---

## Pre-requisites & Setup
1. Run backend server: `npm run dev` (runs on `http://localhost:5000`)
2. Seed initial data: `npm run seed` (creates deterministic dataset)

---

## 1. Authentication & Role-Based Access
- **Admin Login**:
  - Email: `admin@dayflow.internal`
  - Password: `Password123!`
  - Role: `ADMIN` (Access to all workforce analytics, leave approvals, payroll ledger, and Copilot)
- **Employee Login**:
  - Email: `priya.sharma@dayflow.internal`
  - Password: `Password123!`
  - Role: `EMPLOYEE` (Access to self-service check-in/out, personal leave requests, personal payroll)

---

## 2. Differentiator 1: Workforce Pulse (Live Workforce Health)
- **Concept**: Moves beyond static attendance lists to real-time workforce health monitoring.
- **Endpoint**: `GET /api/workforce/pulse`
- **Demo Action**:
  1. Open Workforce Pulse overview.
  2. View live metrics: Attendance %, Team Coverage %, Leave Load %, Absence Rate %, and Workforce Risk level.
  3. Show how department coverage in Support (67%) triggers an operational warning alert.

---

## 3. Differentiator 2: Smart Leave Impact (Predictive Decision Making)
- **Concept**: Before approving time-off, HR evaluates the impact on team staffing.
- **Endpoint**: `GET /api/leave-impact/:leaveRequestId`
- **Demo Action**:
  1. Go to Pending Leaves in HR dashboard.
  2. Select Priya Sharma's pending leave request (`EMP004` in Support).
  3. Notice that David Kim (`EMP005` in Support) is already on approved leave for those dates.
  4. DayFlow calculates:
     - Current Support Coverage: 67% (2 out of 3 available)
     - Projected Support Coverage: 33% (1 out of 3 available)
     - Risk: **HIGH RISK** (Coverage drops below 60% critical threshold)
  5. The judge sees deterministic math and plain-language explanation without unpredictable AI hallucinations.

---

## 4. Differentiator 3: HR Copilot (Data-Grounded AI)
- **Concept**: HR asks natural-language questions, and Copilot answers with actual HRMS database metrics.
- **Endpoint**: `POST /api/copilot/ask`
- **Demo Prompts**:
  1. *"Which team has the lowest attendance?"*
     $\to$ Answers: *Support currently has the lowest workforce coverage at 67% (2/3 present, 0 absent).*
  2. *"Who is absent today?"*
     $\to$ Lists exact names and departments from database records.
  3. *"Are there any pending leave requests?"*
     $\to$ Returns pending leaves with applicant names, types, and date ranges.
  4. *"What is our monthly payroll spend?"*
     $\to$ Returns total payroll expenditure and per-employee average.
