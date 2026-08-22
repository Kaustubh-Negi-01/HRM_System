# DayFlow Hackathon Demo Flow & Presentation Script

This document details the live end-to-end demonstration flow for judges, designed to showcase **DAYFLOW - Intelligent Workforce OS** not as a standard CRUD tool, but as a proactive, intelligent decision-support system.

---

## 1. Demo Narrative: "The Aug 25th Customer Support Crisis"

### The Storyline:
> *"Meet Priya, a Senior Customer Support Specialist at TechCorp. She applies for a 3-day leave for a family event on August 25th. In a typical HRMS, HR Manager Alex would click 'Approve' without knowing that two other support agents and the team lead are already away that same week. The result? A 40% support deficit and angry customers. With DayFlow, Alex instantly sees the projected coverage drop, evaluates risk, makes an informed decision, and consults HR Copilot to solve the staffing bottleneck."*

---

## 2. Step-by-Step 10-Stage Walkthrough

### Step 1: Employee Authentication & Access
- **Action**: Log in as Priya Sharma (`priya@techcorp.com` / `employee`).
- **Showcase**: Clean role-based navigation. Employee view is focused strictly on personal productivity without exposing sensitive admin controls or organization-wide salaries.

### Step 2: Employee Daily Attendance
- **Action**: Navigate to Employee Attendance portal. Click **"Check In"** for the day.
- **Showcase**: Instant timestamp recording, status transitions to `Present`, and daily hours counter starts ticking.

### Step 3: Employee Submits Leave Request
- **Action**: Navigate to Leave Portal. Apply for **Annual Leave** from **August 25 to August 27** (3 days) with reason *"Family function & travel"*.
- **Showcase**: Submission succeeds and status updates to `Pending Review`.

### Step 4: HR / Admin Logs In & Opens Pending Queue
- **Action**: Log out of Priya's account and log in as HR Admin Alex (`admin@techcorp.com` / `admin`).
- **Showcase**: Admin portal unlocks executive features: Workforce Pulse, Smart Leave Impact, HR Copilot, and Payroll.
- **Action**: Navigate to **Smart Leave Impact** (`/admin/leave-impact`).

### Step 5: Smart Leave Impact Evaluates Staffing Effect (Differentiator 2)
- **Action**: Select Priya Sharma's pending request from the queue.
- **What the Judge Sees**:
  - **Coverage Delta**: Current Support Coverage (90%) drops sharply to **60%** (a 30% drop!).
  - **Conflict Detection**: Automatically highlights that **Rahul Verma (Support Lead)** and **Ananya Roy** are already on approved leave for those exact dates.
  - **Deterministic Risk Rating**: Badged as **HIGH RISK** with explicit backend reasons.
  - **Backend Recommendation**: *"Suggest alternate window (e.g., Aug 28 - Aug 30) or require partial shift coverage before approval."*

### Step 6: HR Makes a Data-Informed Decision
- **Action**: HR clicks **"Reject"** with rationale *"Critical staffing deficit in Customer Support for Aug 25-27. Please consider rescheduling to Aug 28."* OR approves with documented coverage override.
- **Showcase**: Status updates instantly in the database with audit timestamps.

### Step 7: Live Workforce Pulse Snapshot (Differentiator 1)
- **Action**: Navigate to **Workforce Pulse** (`/admin/workforce-pulse`).
- **What the Judge Sees**:
  - **Overall Attendance**: 92% across all 50 staff members.
  - **Team Coverage**: 87% company-wide.
  - **Workforce Risk**: Badged as `MEDIUM`.
  - **Live Workforce Alerts**: High-severity alert flagged: *"Customer Support coverage is at 60%, below the 75% minimum threshold."*
  - **Department Capacity Breakdown**: Clear visual comparison bars across Engineering (95%), Support (60%), Product (87.5%), and Marketing (83.3%).
  - **7-Day Attendance Trend**: Rolling curve showing attendance stability.

### Step 8: Interrogating HR Copilot (Differentiator 3)
- **Action**: Navigate to **HR Copilot** (`/admin/copilot`).
- **Action**: Click the suggested prompt chip: *"Which team has the lowest attendance rate this week?"*
- **What the Judge Sees**:
  - Copilot responds instantly with precise, data-grounded metrics.
  - **Answer**: *"The Customer Support team currently has the lowest attendance rate this week at 60.0% (6 out of 10 present, 4 on leave)..."*
  - **Supporting Data Card**: Interactive department comparison table rendered right alongside the text response.
  - **Confidence Indicator**: 96% Grounding Confidence.

### Step 9: Natural Language Deep-Dive with Copilot
- **Action**: Type a follow-up question: *"Why is the Customer Support team's coverage low?"*
- **What the Judge Sees**:
  - Copilot cross-references active approved leaves and identifies that 4 support specialists are simultaneously out of office, validating the exact scenario from Step 5.

### Step 10: Conclusion & Judge Summary
- **Action**: Wrap up by showing how DayFlow transforms HR from reactive paperwork into proactive workforce strategy.

---

## 3. What the Judges Should Notice

1. **Not a Generic CRUD**: The system provides active decision support before decisions are executed.
2. **Deterministic Risk Calculations**: Risk is calculated using rigorous business rules and staffing thresholds, not hallucinated by an unconstrained LLM.
3. **True Data Grounding**: HR Copilot reads actual MongoDB data; it is an intelligent lens into the company's live state.
4. **Seamless Integration**: A unified, responsive design where employee actions directly propagate to executive intelligence dashboards.
