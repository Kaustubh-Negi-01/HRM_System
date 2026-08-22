# DayFlow Features Overview

DayFlow is an Intelligent Workforce OS designed for human resource management, live workforce analytics, and AI-assisted HR decision-making.

---

## 1. Authentication & Security
- **Secure Password Hashing**: Bcrypt with 10 salt rounds.
- **JWT Authorization**: Token-based stateless authentication with 7-day expiry.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `EMPLOYEE` and `ADMIN` roles.
- **Protection**: Non-admin employees cannot access admin-only endpoints or view other employees' private payrolls.

## 2. Attendance Management
- **Check-in / Check-out Engine**:
  - Guards against duplicate check-in or checkout within the same calendar day.
  - Automatically calculates total daily working hours.
  - Automatically flags half-day (< 4 working hours) vs full-day presence.
- **Team & Today Views**: Live breakdown of present, absent, and on-leave staff.

## 3. Leave Lifecycle Management
- **Leave Applications**: Support for `PAID`, `SICK`, and `UNPAID` categories with date range validation.
- **Conflict Prevention**: Prevents overlapping leave applications for the same employee.
- **HR Approval / Rejection Workflow**: Instant status changes with remarks and review metadata.
- **Automated Attendance Synchronization**: Approving a leave automatically updates the employee's attendance ledger across the requested date span to status `LEAVE`.

## 4. Payroll System
- **Deterministic Compensation Formula**: `netSalary = max(0, basicSalary + allowances - deductions)`.
- **Pre-save Auto-Calculation**: Net salary automatically updates on any wage modification.

## 5. Workforce Pulse (Differentiator 1)
- **Live Aggregation**: Real-time workforce metrics computed directly from database entries (`attendancePercentage`, `teamCoverage`, `leaveLoad`, `absenceRate`).
- **Explainable Risk Engine**: Deterministic rules scoring risk as `LOW`, `MEDIUM`, or `HIGH` with transparent human-readable explanations.
- **Operational Alerts**: Automatically surfaces staffing warnings when department coverage drops below operational safety thresholds.
- **7-Day Trend Analysis**: Historical daily workforce attendance trajectory.

## 6. Smart Leave Impact (Differentiator 2)
- **Predictive Staffing Simulator**: Calculates exact projected team coverage drop before approving a leave.
- **Overlap Detection**: Discovers concurrent approved and pending leaves in the same department.
- **Risk Assessment**: Flags `HIGH` risk when department coverage falls below 60%.

## 7. HR Copilot Backend (Differentiator 3)
- **Natural Language HR Insights**: Processes questions against real-time database records (e.g. lowest attendance team, absent employees today, pending approvals, payroll summary).
- **Hybrid AI Fallback**: Responds with deterministic answers and structured data, with optional OpenAI refinement if configured.
