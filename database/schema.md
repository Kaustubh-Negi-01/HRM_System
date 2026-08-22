# DayFlow Database Schema

This document details the 5 core data models for the DayFlow Intelligent Workforce OS backend.

---

## 1. `User` (Collection: `users`)
Represents system users (Employees and HR Administrators) and authentication credentials.

| Field | Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `_id` | ObjectId | Yes | Yes | auto | Primary Key |
| `employeeId` | String | Yes | Yes | - | Unique business ID (e.g., `EMP001`, `ADM001`) |
| `name` | String | Yes | No | - | Full name |
| `email` | String | Yes | Yes | - | Work email address (lowercase) |
| `passwordHash` | String | Yes | No | - | Bcrypt hashed password (10 rounds) |
| `role` | String | Yes | No | `EMPLOYEE` | Access role: `EMPLOYEE` or `ADMIN` |
| `department` | String | Yes | No | - | Department (e.g., `Engineering`, `Support`, `Human Resources`) |
| `createdAt` | Date | auto | No | - | Creation timestamp |
| `updatedAt` | Date | auto | No | - | Last update timestamp |

---

## 2. `EmployeeProfile` (Collection: `employeeprofiles`)
Contains extended personal and employment profile metadata.

| Field | Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `_id` | ObjectId | Yes | Yes | auto | Primary Key |
| `userId` | ObjectId | Yes | Yes | - | Reference to `User._id` |
| `employeeId` | String | Yes | Yes | - | Reference to `User.employeeId` |
| `phone` | String | No | No | `""` | Phone number |
| `address` | String | No | No | `""` | Residential address |
| `designation` | String | Yes | No | `Associate` | Job title (e.g. `Senior Support Specialist`) |
| `joiningDate` | Date | No | No | `now` | Company onboarding date |
| `profilePicture`| String | No | No | `""` | Avatar URL / image path |

---

## 3. `Attendance` (Collection: `attendances`)
Daily work and attendance records.

| Field | Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `_id` | ObjectId | Yes | Yes | auto | Primary Key |
| `employeeId` | String | Yes | No | - | Reference to employee |
| `date` | String | Yes | No | - | Calendar date string (`YYYY-MM-DD`) |
| `checkIn` | Date | No | No | `null` | First check-in timestamp |
| `checkOut` | Date | No | No | `null` | Final check-out timestamp |
| `status` | String | Yes | No | `PRESENT` | `PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE` |
| `workHours` | Number | No | No | `0` | Computed active hours |

> **Compound Index**: `(employeeId: 1, date: 1)` is unique to guarantee one attendance row per employee per day.

---

## 4. `LeaveRequest` (Collection: `leaverequests`)
Employee time-off requests and HR approval lifecycle.

| Field | Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `_id` | ObjectId | Yes | Yes | auto | Primary Key |
| `employeeId` | String | Yes | No | - | Requester's employee ID |
| `leaveType` | String | Yes | No | - | `PAID`, `SICK`, `UNPAID` |
| `startDate` | String | Yes | No | - | Start date (`YYYY-MM-DD`) |
| `endDate` | String | Yes | No | - | End date (`YYYY-MM-DD`) |
| `reason` | String | Yes | No | - | Request reason |
| `status` | String | Yes | No | `PENDING` | `PENDING`, `APPROVED`, `REJECTED` |
| `hrComment` | String | No | No | `""` | HR approval/rejection remarks |
| `reviewedBy` | String | No | No | `null` | Admin name / ID who reviewed |
| `reviewedAt` | Date | No | No | `null` | Review timestamp |

---

## 5. `Payroll` (Collection: `payrolls`)
Basic salary and compensation breakdown.

| Field | Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `_id` | ObjectId | Yes | Yes | auto | Primary Key |
| `employeeId` | String | Yes | Yes | - | Employee ID |
| `basicSalary` | Number | Yes | No | `0` | Base monthly salary |
| `allowances` | Number | No | No | `0` | Additional stipends/allowances |
| `deductions` | Number | No | No | `0` | Taxes/insurance deductions |
| `netSalary` | Number | auto | No | `0` | Computed: `max(0, basic + allowances - deductions)` |
| `updatedAt` | Date | auto | No | - | Last modified timestamp |
