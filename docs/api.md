# DayFlow API Contract & Specification

This document defines the authoritative API contract between **Hamza** (Backend API), **Saksham** (Frontend Service Layer & Page Integration), and **Kaustubh** (Differentiator Pages & Product Coordination).

All endpoints return JSON responses with standard status codes.

---

## Base URL & Authentication

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT Bearer Token in the `Authorization` header:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Standard Error Response**:
  ```json
  {
    "success": false,
    "error": "Descriptive error message",
    "code": "ERROR_CODE"
  }
  ```

---

## 1. Differentiator 1: Workforce Pulse

### `GET /api/workforce/pulse`
Retrieves live overview metrics representing current workforce health, staffing coverage, and active alerts.

- **Access**: Admin / HR (`role: 'admin'`)
- **Headers**: `Authorization: Bearer <token>`
- **Frontend Service**: `getWorkforcePulse()` in `frontend/src/features/workforce/workforce.service.js`
- **Consumer**: `WorkforcePulse.jsx`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-08-22T09:00:00.000Z",
    "overallAttendance": 92,
    "teamCoverage": 87,
    "leaveLoad": 8,
    "presentCount": 46,
    "absentCount": 4,
    "totalEmployees": 50,
    "absenceRisk": "MEDIUM",
    "alerts": [
      {
        "id": "alt-001",
        "type": "COVERAGE_WARNING",
        "severity": "high",
        "title": "Low Coverage Alert",
        "message": "Customer Support team coverage is at 60%, below the 75% minimum threshold.",
        "department": "Customer Support",
        "timestamp": "2026-08-22T08:30:00.000Z"
      },
      {
        "id": "alt-002",
        "type": "UPCOMING_ABSENCE",
        "severity": "medium",
        "title": "Upcoming Absence Clashing",
        "message": "3 senior engineers are scheduled on leave tomorrow (Aug 23).",
        "department": "Engineering",
        "timestamp": "2026-08-22T08:45:00.000Z"
      },
      {
        "id": "alt-003",
        "type": "ATTENDANCE_DROP",
        "severity": "low",
        "title": "Weekly Trend Dip",
        "message": "Company attendance dropped by 3.2% compared to last week average.",
        "department": "All",
        "timestamp": "2026-08-22T07:15:00.000Z"
      }
    ],
    "departmentBreakdown": [
      {
        "department": "Engineering",
        "total": 20,
        "present": 19,
        "onLeave": 1,
        "coveragePercent": 95,
        "risk": "LOW"
      },
      {
        "department": "Customer Support",
        "total": 10,
        "present": 6,
        "onLeave": 4,
        "coveragePercent": 60,
        "risk": "HIGH"
      },
      {
        "department": "Product & Design",
        "total": 8,
        "present": 7,
        "onLeave": 1,
        "coveragePercent": 87.5,
        "risk": "LOW"
      },
      {
        "department": "Marketing & Sales",
        "total": 12,
        "present": 10,
        "onLeave": 2,
        "coveragePercent": 83.3,
        "risk": "MEDIUM"
      }
    ]
  }
}
```

---

### `GET /api/workforce/trends`
Retrieves historical and projected attendance trends over a rolling window.

- **Access**: Admin / HR (`role: 'admin'`)
- **Query Parameters**:
  - `days` (optional, default: `7`): Number of past days to query.
- **Frontend Service**: `getWorkforceTrends(days)` in `frontend/src/features/workforce/workforce.service.js`
- **Consumer**: `WorkforcePulse.jsx`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "trend": [
      { "date": "2026-08-16", "day": "Mon", "attendanceRate": 95.0, "presentCount": 48, "leaveCount": 2 },
      { "date": "2026-08-17", "day": "Tue", "attendanceRate": 96.0, "presentCount": 48, "leaveCount": 2 },
      { "date": "2026-08-18", "day": "Wed", "attendanceRate": 92.0, "presentCount": 46, "leaveCount": 4 },
      { "date": "2026-08-19", "day": "Thu", "attendanceRate": 94.0, "presentCount": 47, "leaveCount": 3 },
      { "date": "2026-08-20", "day": "Fri", "attendanceRate": 90.0, "presentCount": 45, "leaveCount": 5 },
      { "date": "2026-08-21", "day": "Sat", "attendanceRate": 98.0, "presentCount": 49, "leaveCount": 1 },
      { "date": "2026-08-22", "day": "Sun", "attendanceRate": 92.0, "presentCount": 46, "leaveCount": 4 }
    ]
  }
}
```

---

## 2. Differentiator 2: Smart Leave Impact

### `GET /api/leave-impact/:leaveId`
Calculates deterministic team coverage impact, overlap conflicts, and staffing risk before approving a leave request.

- **Access**: Admin / HR (`role: 'admin'`)
- **URL Parameter**: `leaveId` (string)
- **Frontend Service**: `getLeaveImpact(leaveId)` in `frontend/src/features/leaveImpact/leaveImpact.service.js`
- **Consumer**: `LeaveImpact.jsx`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "leaveId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "employeeId": "EMP-104",
    "employeeName": "Priya Sharma",
    "department": "Customer Support",
    "position": "Senior Support Specialist",
    "leaveType": "Annual Leave",
    "startDate": "2026-08-25",
    "endDate": "2026-08-27",
    "days": 3,
    "reason": "Family function and travel",
    "teamSize": 10,
    "currentTeamCoverage": 90,
    "projectedTeamCoverage": 60,
    "coverageDrop": 30,
    "unavailableCount": 3,
    "overlappingLeaves": [
      {
        "employeeId": "EMP-107",
        "employeeName": "Rahul Verma",
        "department": "Customer Support",
        "position": "Support Lead",
        "startDate": "2026-08-24",
        "endDate": "2026-08-26",
        "status": "Approved"
      },
      {
        "employeeId": "EMP-109",
        "employeeName": "Ananya Roy",
        "department": "Customer Support",
        "position": "Support Specialist",
        "startDate": "2026-08-25",
        "endDate": "2026-08-28",
        "status": "Approved"
      }
    ],
    "riskLevel": "HIGH",
    "riskReasons": [
      "Projected department coverage (60%) falls below the minimum required 75% threshold.",
      "2 team members in Customer Support already have approved overlapping leaves in this period.",
      "Support Lead Rahul Verma is unavailable simultaneously on Aug 25-26."
    ],
    "recommendation": "Suggest alternate window (e.g., Aug 28 - Aug 30) or require partial shift coverage before approval."
  }
}
```

---

### `GET /api/leaves/pending`
Retrieves all pending leave requests requiring review.

- **Access**: Admin / HR (`role: 'admin'`)
- **Frontend Service**: `getPendingLeaves()` in `frontend/src/features/leaveImpact/leaveImpact.service.js`
- **Consumer**: `LeaveImpact.jsx`, `LeaveApprovals.jsx`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "employeeId": "EMP-104",
      "employeeName": "Priya Sharma",
      "department": "Customer Support",
      "position": "Senior Support Specialist",
      "leaveType": "Annual Leave",
      "startDate": "2026-08-25",
      "endDate": "2026-08-27",
      "days": 3,
      "reason": "Family function and travel",
      "appliedAt": "2026-08-22T07:30:00.000Z",
      "status": "Pending"
    },
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "employeeId": "EMP-102",
      "employeeName": "Vikram Sethi",
      "department": "Engineering",
      "position": "Backend Developer",
      "leaveType": "Sick Leave",
      "startDate": "2026-08-24",
      "endDate": "2026-08-24",
      "days": 1,
      "reason": "Medical appointment",
      "appliedAt": "2026-08-22T08:15:00.000Z",
      "status": "Pending"
    }
  ]
}
```

---

### `POST /api/leaves/:id/approve`
Approves a pending leave request.

- **Access**: Admin / HR (`role: 'admin'`)
- **URL Parameter**: `id` (Leave ID)
- **Request Body**:
  ```json
  {
    "comments": "Approved after reviewing team schedule."
  }
  ```
- **Frontend Service**: `approveLeave(id, comments)` in `frontend/src/features/leaveImpact/leaveImpact.service.js`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Leave request approved successfully.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "status": "Approved",
    "reviewedBy": "Admin User",
    "reviewedAt": "2026-08-22T10:15:00.000Z",
    "comments": "Approved after reviewing team schedule."
  }
}
```

---

### `POST /api/leaves/:id/reject`
Rejects a pending leave request with a stated rationale.

- **Access**: Admin / HR (`role: 'admin'`)
- **URL Parameter**: `id` (Leave ID)
- **Request Body**:
  ```json
  {
    "comments": "Critical staffing deficit in Customer Support for Aug 25-27. Please consider rescheduling."
  }
  ```
- **Frontend Service**: `rejectLeave(id, comments)` in `frontend/src/features/leaveImpact/leaveImpact.service.js`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Leave request rejected.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "status": "Rejected",
    "reviewedBy": "Admin User",
    "reviewedAt": "2026-08-22T10:16:00.000Z",
    "comments": "Critical staffing deficit in Customer Support for Aug 25-27. Please consider rescheduling."
  }
}
```

---

## 3. Differentiator 3: HR Copilot

### `POST /api/copilot/query`
Processes natural language HR inquiries grounded in actual database metrics (attendance, staffing, leave trends, payroll).

- **Access**: Admin / HR (`role: 'admin'`)
- **Frontend Service**: `queryCopilot(question, context)` in `frontend/src/features/copilot/copilot.service.js`
- **Consumer**: `HRCopilot.jsx`

#### Request Body:
```json
{
  "question": "Which team has the lowest attendance rate this week?",
  "context": {
    "timeframe": "this_week",
    "department": "All"
  }
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "question": "Which team has the lowest attendance rate this week?",
    "answer": "The Customer Support team currently has the lowest attendance rate this week at 60.0% (6 out of 10 present, 4 on leave). By comparison, Engineering is at 95.0%, Product & Design is at 87.5%, and Marketing is at 83.3%.",
    "queryType": "ATTENDANCE_ANALYSIS",
    "confidence": 0.96,
    "relevantData": {
      "lowestDepartment": "Customer Support",
      "attendanceRate": 60.0,
      "headcount": 10,
      "present": 6,
      "onLeave": 4,
      "comparison": [
        { "department": "Customer Support", "rate": 60.0, "status": "Low" },
        { "department": "Marketing & Sales", "rate": 83.3, "status": "Moderate" },
        { "department": "Product & Design", "rate": 87.5, "status": "Good" },
        { "department": "Engineering", "rate": 95.0, "status": "Optimal" }
      ]
    },
    "suggestedFollowUps": [
      "Why is the Customer Support team's coverage low?",
      "Who is on leave in Customer Support next week?",
      "Show pending leave requests for Customer Support"
    ],
    "timestamp": "2026-08-22T10:30:00.000Z"
  }
}
```

---

### `GET /api/copilot/suggested-prompts`
Provides curated prompt chips that demonstrate high-value grounded HR queries.

- **Access**: Admin / HR (`role: 'admin'`)
- **Frontend Service**: `getCopilotPrompts()` in `frontend/src/features/copilot/copilot.service.js`
- **Consumer**: `HRCopilot.jsx`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "prompts": [
      {
        "id": "p-1",
        "category": "Attendance",
        "text": "Who has the highest absence rate this month?",
        "icon": "Users"
      },
      {
        "id": "p-2",
        "category": "Coverage",
        "text": "Which team has the lowest attendance rate this week?",
        "icon": "AlertTriangle"
      },
      {
        "id": "p-3",
        "category": "Forecasting",
        "text": "How many employees are absent next Monday?",
        "icon": "Calendar"
      },
      {
        "id": "p-4",
        "category": "Leave Risk",
        "text": "Which pending leaves could affect team staffing?",
        "icon": "ShieldAlert"
      },
      {
        "id": "p-5",
        "category": "Diagnostics",
        "text": "Why is the Customer Support team's coverage low?",
        "icon": "HelpCircle"
      }
    ]
  }
}
```

---

## 4. Core HRMS Endpoints Reference (For Hamza & Saksham)

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/login` | Email/password login, returns JWT token & user object |
| **Auth** | `POST` | `/api/auth/signup` | Register new user account |
| **Auth** | `GET` | `/api/auth/me` | Current authenticated user profile & permissions |
| **Employees** | `GET` | `/api/employees` | List all employees with filters (department, status) |
| **Employees** | `GET` | `/api/employees/:id` | Individual employee profile & job details |
| **Attendance** | `POST` | `/api/attendance/check-in` | Employee daily check-in timestamp |
| **Attendance** | `POST` | `/api/attendance/check-out` | Employee daily check-out timestamp |
| **Attendance** | `GET` | `/api/attendance/my` | Authenticated employee's attendance log |
| **Attendance** | `GET` | `/api/attendance/all` | Admin view of all organization attendance records |
| **Leaves** | `POST` | `/api/leaves/apply` | Employee applies for leave (type, start, end, reason) |
| **Leaves** | `GET` | `/api/leaves/my` | Authenticated employee's leave request history |
| **Leaves** | `GET` | `/api/leaves` | Admin view of all organization leaves with filter |
| **Payroll** | `GET` | `/api/payroll/my` | Employee payslip summary |
| **Payroll** | `GET` | `/api/payroll/all` | Admin payroll overview, salaries, and disbursements |

---

## 5. Team Coordination Matrix

```
┌────────────────────────────────────────────────────────┐
│                        HAMZA                           │
│  Backend Express Routes & Mongoose Models             │
│  ├── /api/workforce/*                                  │
│  ├── /api/leave-impact/*                               │
│  └── /api/copilot/*                                    │
└──────────────────────────┬─────────────────────────────┘
                           │ Consumed by
┌──────────────────────────▼─────────────────────────────┐
│                       SAKSHAM                          │
│  Frontend Service Layer & Axios Clients                │
│  ├── workforce.service.js   --> exports getWorkforcePulse │
│  ├── leaveImpact.service.js --> exports getLeaveImpact  │
│  └── copilot.service.js     --> exports queryCopilot   │
└──────────────────────────┬─────────────────────────────┘
                           │ Imported by
┌──────────────────────────▼─────────────────────────────┐
│                      KAUSTUBH                          │
│  Differentiator Pages (Strict Boundary)                │
│  ├── WorkforcePulse.jsx                                │
│  ├── LeaveImpact.jsx                                   │
│  └── HRCopilot.jsx                                     │
└────────────────────────────────────────────────────────┘
```
