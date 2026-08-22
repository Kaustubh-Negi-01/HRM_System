# DayFlow API Contract & Documentation

> **Base URL**: `http://localhost:5000/api`  
> **Standard Response Formats**:
> - **Success**: `{ "success": true, "data": <payload>, "meta"?: <object> }`
> - **Error**: `{ "success": false, "error": { "code": "ERROR_CODE", "message": "Description" } }`

---

## 1. Authentication (`/api/auth`)

### 1.1 Sign Up
- **Method**: `POST`
- **Path**: `/api/auth/signup`
- **Auth Required**: No
- **Request Body**:
```json
{
  "employeeId": "EMP010",
  "name": "Jordan Lee",
  "email": "jordan.lee@dayflow.internal",
  "password": "Password123!",
  "role": "EMPLOYEE",
  "department": "Engineering",
  "designation": "Software Engineer",
  "phone": "+1 (555) 019-9999",
  "address": "123 Tech Blvd"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65e23a41...",
      "employeeId": "EMP010",
      "name": "Jordan Lee",
      "email": "jordan.lee@dayflow.internal",
      "role": "EMPLOYEE",
      "department": "Engineering",
      "profile": { ... }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
}
```

### 1.2 Log In
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "admin@dayflow.internal",
  "password": "Password123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65e23a41...",
      "employeeId": "ADM001",
      "name": "Hamza Khan",
      "email": "admin@dayflow.internal",
      "role": "ADMIN",
      "department": "Human Resources"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
}
```

### 1.3 Get Current User (`Me`)
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (200 OK)**: User profile, payroll, and role context.

---

## 2. Employees (`/api/employees`)

### 2.1 List Employees
- **Method**: `GET`
- **Path**: `/api/employees`
- **Query Params**: `department`, `role`
- **Auth Required**: Yes
- **Success Response (200 OK)**: Array of employee objects with nested profiles and payroll info.

### 2.2 Get Employee by ID
- **Method**: `GET`
- **Path**: `/api/employees/:id` (`id` can be Mongo `_id` or `employeeId` like `EMP001`)
- **Auth Required**: Yes

### 2.3 Update Employee
- **Method**: `PUT`
- **Path**: `/api/employees/:id`
- **Auth Required**: Yes (User can update own profile, ADMIN can update any profile)
- **Request Body**:
```json
{
  "name": "Alex Chen",
  "department": "Engineering",
  "designation": "Staff Engineer",
  "phone": "+1 (555) 012-3456",
  "address": "42 Silicon Avenue, Apt 3B"
}
```

### 2.4 Get Employee Profile
- **Method**: `GET`
- **Path**: `/api/employees/:id/profile`
- **Auth Required**: Yes

---

## 3. Attendance (`/api/attendance`)

### 3.1 Check In
- **Method**: `POST`
- **Path**: `/api/attendance/check-in`
- **Auth Required**: Yes (`EMPLOYEE` / `ADMIN`)
- **Request Body** (optional date override):
```json
{
  "date": "2026-08-22"
}
```
- **Error if already checked in (400)**: `ALREADY_CHECKED_IN`

### 3.2 Check Out
- **Method**: `POST`
- **Path**: `/api/attendance/check-out`
- **Auth Required**: Yes
- **Request Body** (optional date override): `{}`
- **Error if not checked in (400)**: `NOT_CHECKED_IN`
- **Error if already checked out (400)**: `ALREADY_CHECKED_OUT`

### 3.3 Get My Attendance History
- **Method**: `GET`
- **Path**: `/api/attendance/me`
- **Query Params**: `limit`, `startDate`, `endDate`
- **Auth Required**: Yes
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "records": [ ... ],
    "summary": {
      "total": 30,
      "present": 28,
      "halfDay": 1,
      "leave": 1,
      "absent": 0
    }
  }
}
```

### 3.4 Get Department / Team Attendance
- **Method**: `GET`
- **Path**: `/api/attendance/team`
- **Query Params**: `department`, `date`
- **Auth Required**: Yes

### 3.5 Get All Today's Attendance
- **Method**: `GET`
- **Path**: `/api/attendance/today`
- **Query Params**: `date`
- **Auth Required**: Yes (`ADMIN` role)

---

## 4. Leave Management (`/api/leave`)

### 4.1 Apply for Leave
- **Method**: `POST`
- **Path**: `/api/leave`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "leaveType": "SICK",
  "startDate": "2026-08-25",
  "endDate": "2026-08-27",
  "reason": "Scheduled medical checkup and recovery."
}
```
- **Allowed `leaveType`**: `PAID`, `SICK`, `UNPAID`

### 4.2 Get My Leave Requests
- **Method**: `GET`
- **Path**: `/api/leave/me`
- **Auth Required**: Yes

### 4.3 Get All Leave Requests
- **Method**: `GET`
- **Path**: `/api/leave/all`
- **Query Params**: `status` (`PENDING`, `APPROVED`, `REJECTED`), `department`
- **Auth Required**: Yes (`ADMIN` role)

### 4.4 Get Leave Request by ID
- **Method**: `GET`
- **Path**: `/api/leave/:id`
- **Auth Required**: Yes

### 4.5 Approve Leave Request
- **Method**: `PUT`
- **Path**: `/api/leave/:id/approve`
- **Auth Required**: Yes (`ADMIN` role)
- **Request Body**:
```json
{
  "comment": "Approved. Team coverage has been confirmed."
}
```

### 4.6 Reject Leave Request
- **Method**: `PUT`
- **Path**: `/api/leave/:id/reject`
- **Auth Required**: Yes (`ADMIN` role)
- **Request Body**:
```json
{
  "comment": "Rejected due to critical project launch."
}
```

---

## 5. Payroll (`/api/payroll`)

### 5.1 Get My Payroll
- **Method**: `GET`
- **Path**: `/api/payroll/me`
- **Auth Required**: Yes

### 5.2 Get All Payroll
- **Method**: `GET`
- **Path**: `/api/payroll/all`
- **Auth Required**: Yes (`ADMIN` role)

### 5.3 Update Employee Payroll
- **Method**: `PUT`
- **Path**: `/api/payroll/:employeeId`
- **Auth Required**: Yes (`ADMIN` role)
- **Request Body**:
```json
{
  "basicSalary": 95000,
  "allowances": 10000,
  "deductions": 4500
}
```

---

## 6. Workforce Pulse (`/api/workforce`)

### 6.1 Get Workforce Pulse Overview
- **Method**: `GET`
- **Path**: `/api/workforce/pulse`
- **Query Params**: `date` (`YYYY-MM-DD`, optional)
- **Auth Required**: Yes
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "date": "2026-08-22",
    "totalEmployees": 6,
    "presentToday": 5,
    "halfDayToday": 0,
    "absentToday": 0,
    "onLeaveToday": 1,
    "attendancePercentage": 83,
    "teamCoverage": 83,
    "leaveLoad": 17,
    "absenceRate": 0,
    "riskLevel": "LOW",
    "riskReasons": [
      "Workforce health is stable with healthy attendance and department coverage."
    ],
    "departmentBreakdown": [
      {
        "department": "Engineering",
        "totalEmployees": 3,
        "present": 3,
        "absent": 0,
        "onLeave": 0,
        "coveragePercentage": 100
      },
      {
        "department": "Support",
        "totalEmployees": 3,
        "present": 2,
        "absent": 0,
        "onLeave": 1,
        "coveragePercentage": 67
      }
    ],
    "alerts": [
      {
        "type": "WARNING",
        "title": "Low Staffing in Support",
        "message": "Support department is at 67% active coverage."
      }
    ]
  }
}
```

### 6.2 Get Workforce Alerts
- **Method**: `GET`
- **Path**: `/api/workforce/alerts`
- **Auth Required**: Yes

### 6.3 Get Attendance Trend
- **Method**: `GET`
- **Path**: `/api/workforce/attendance-trend`
- **Query Params**: `days` (default `7`)
- **Auth Required**: Yes

---

## 7. Smart Leave Impact (`/api/leave-impact`)

### 7.1 Calculate Leave Request Impact
- **Method**: `GET`
- **Path**: `/api/leave-impact/:leaveRequestId`
- **Auth Required**: Yes (`ADMIN` role)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "leaveRequestId": "65e23b...",
    "employee": "Priya Sharma",
    "employeeId": "EMP004",
    "team": "Support",
    "leaveType": "SICK",
    "startDate": "2026-08-22",
    "endDate": "2026-08-25",
    "teamSize": 3,
    "currentAvailable": 2,
    "projectedAvailable": 1,
    "currentCoverage": 67,
    "projectedCoverage": 33,
    "alreadyUnavailable": 1,
    "overlappingLeaves": 1,
    "approvedOverlapsCount": 1,
    "pendingOverlapsCount": 0,
    "riskLevel": "HIGH",
    "impactSummary": "Approval would reduce Support team coverage to 33%, breaching the critical 60% floor.",
    "overlappingLeaveDetails": [
      {
        "leaveId": "...",
        "employeeId": "EMP005",
        "employeeName": "David Kim",
        "leaveType": "PAID",
        "startDate": "2026-08-22",
        "endDate": "2026-08-25",
        "status": "APPROVED"
      }
    ]
  }
}
```

---

## 8. HR Copilot (`/api/copilot`)

### 8.1 Ask Copilot
- **Method**: `POST`
- **Path**: `/api/copilot/ask`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "question": "Which team has the lowest attendance?"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "question": "Which team has the lowest attendance?",
    "answer": "Support currently has the lowest workforce coverage at 67% (2/3 present, 0 absent).",
    "source": "attendance_and_department_data",
    "supportingData": {
      "team": "Support",
      "coveragePercentage": 67,
      "present": 2,
      "absent": 0,
      "total": 3
    }
  }
}
```
