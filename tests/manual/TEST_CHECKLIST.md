# DayFlow Comprehensive QA & Manual Test Checklist

This manual test suite ensures that **DAYFLOW - Intelligent Workforce OS** meets all functional, integration, role-based access, and UI resilience requirements from an end-to-end user perspective.

---

## 1. Authentication & Role-Based Access Control (RBAC)

| # | Test Case | Steps | Expected Result | Pass / Fail |
|---|---|---|---|---|
| **AUTH-01** | Employee Login | 1. Navigate to `/login`<br>2. Enter employee credentials (`priya@techcorp.com`)<br>3. Submit | Successfully redirected to `/employee/dashboard`. Admin sidebar options remain hidden. | [ ] |
| **AUTH-02** | Admin / HR Login | 1. Navigate to `/login`<br>2. Enter admin credentials (`admin@techcorp.com`)<br>3. Submit | Successfully redirected to `/admin/dashboard` or `/admin/workforce-pulse`. All differentiator tabs are visible in navigation. | [ ] |
| **AUTH-03** | Invalid Credentials | 1. Enter non-existent email or wrong password<br>2. Click Login | Form displays clear inline error message. No unhandled exceptions or token generation. | [ ] |
| **AUTH-04** | Role Restriction Enforcement | 1. Log in as an Employee (`role: employee`)<br>2. Manually navigate URL to `/admin/workforce-pulse` | System blocks access, redirects to `/unauthorized` or `/employee/dashboard` with a permission notice. | [ ] |
| **AUTH-05** | Logout & Token Invalidation | 1. Click Logout in topbar<br>2. Attempt to navigate back via browser | Session is cleared from local storage; protected routes redirect back to `/login`. | [ ] |

---

## 2. Differentiator 1: Workforce Pulse (`/admin/workforce-pulse`)

| # | Test Case | Steps | Expected Result | Pass / Fail |
|---|---|---|---|---|
| **WP-01** | Initial Data Loading | Navigate to `/admin/workforce-pulse` | Animated loading spinner is shown, followed by clean render of metrics, alerts, department capacity, and trends. | [ ] |
| **WP-02** | Metric Accuracy | Inspect Overall Attendance, Team Coverage, and Leave Load | Numbers match live backend calculations (e.g. Present / Total headcount formula). | [ ] |
| **WP-03** | Absence Risk Level | Check risk badge display | Renders deterministic badge (`LOW` in emerald, `MEDIUM` in amber, `HIGH` in red) with appropriate threshold hint. | [ ] |
| **WP-04** | Active Workforce Alerts | Verify alert cards | Active warnings show severity pills (`HIGH`, `MEDIUM`, `LOW`), department tags, timestamps, and actionable text. | [ ] |
| **WP-05** | Department Capacity Bars | Inspect department breakdown cards | Progress bars accurately reflect coverage percentages with colored status fills. | [ ] |
| **WP-06** | 7-Day Trend Visualization | Toggle between 7D and 14D timeframe filter | Trend bars resize and update with date and percentage tooltips. | [ ] |
| **WP-07** | Manual Refresh Button | Click "Refresh" in header | Triggers loading indicator and updates "Updated at hh:mm:ss" timestamp upon successful fetch. | [ ] |
| **WP-08** | API Failure Resilience | Disconnect backend server or simulate 500 error | Red error banner appears with message and working "Retry" button. No page crash. | [ ] |
| **WP-09** | Empty Dataset State | Clear attendance logs in database | Displays "No Workforce Records Found" empty state card with guidance. | [ ] |
| **WP-10** | Mobile Responsiveness | Resize browser to 375px viewport (mobile) | KPI grid and 2-column sections collapse gracefully into a single scrollable column. | [ ] |

---

## 3. Differentiator 2: Smart Leave Impact (`/admin/leave-impact`)

| # | Test Case | Steps | Expected Result | Pass / Fail |
|---|---|---|---|---|
| **LI-01** | Pending Queue Loading | Navigate to `/admin/leave-impact` | Left sidebar lists all pending leave requests with applicant name, department, days, and date range. | [ ] |
| **LI-02** | Request Auto-Selection | Open page with pending requests present | The first pending leave in the list is automatically selected and analyzed in the right panel. | [ ] |
| **LI-03** | Coverage Delta Calculation | Select a leave request (e.g., Priya Sharma) | Displays Current Team Coverage (e.g., 90%), Projected Coverage (e.g., 60%), and Projected Drop (-30%). | [ ] |
| **LI-04** | Overlap Conflict Detection | Review Concurrent Team Leaves section | Lists existing approved colleagues in the same department who are away during the overlapping window. | [ ] |
| **LI-05** | Deterministic Risk Display | Check risk assessment container | Badged with computed risk level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) along with explicit bulleted backend reasons. | [ ] |
| **LI-06** | Backend Recommendation | Review recommendation box | Actionable guidance displayed (e.g. suggested alternate window or shift swap requirement). | [ ] |
| **LI-07** | Leave Approval Flow | 1. Click "Approve Leave"<br>2. Enter optional comment in modal<br>3. Confirm | Success banner appears, request status updates, and queue refreshes automatically. | [ ] |
| **LI-08** | Leave Rejection Flow | 1. Click "Reject Request"<br>2. Provide rejection reason<br>3. Confirm | Rejection reason is saved, success notification confirms rejection, and queue updates. | [ ] |
| **LI-09** | Empty Queue Handling | Approve/Reject all pending requests | Left sidebar displays "All Caught Up" state; right panel shows empty guidance illustration. | [ ] |
| **LI-10** | API Failure Handling | Simulate network failure during impact query | Displays error banner with retry option without breaking UI layout. | [ ] |

---

## 4. Differentiator 3: HR Copilot (`/admin/copilot`)

| # | Test Case | Steps | Expected Result | Pass / Fail |
|---|---|---|---|---|
| **COP-01** | Onboarding & Starter Chips | Open `/admin/copilot` | Shows onboarding banner, example query cards, and top starter prompt chips. | [ ] |
| **COP-02** | Click-to-Ask Prompt Chip | Click *"Which team has the lowest attendance rate this week?"* | Query is sent automatically; typing animation displays *"Interrogating workforce database..."*. | [ ] |
| **COP-03** | Grounded Data Response | Inspect response bubble | Natural language answer accurately quotes live numbers (e.g., Support at 60.0%). Badged with query type and grounding confidence (e.g. 96%). | [ ] |
| **COP-04** | Supporting Data Evidence | Check supporting data container | Displays structured comparison table or key-value summary extracted directly from MongoDB. | [ ] |
| **COP-05** | Follow-Up Prompt Action | Click a suggested follow-up question chip | Follow-up query is appended to chat stream and answered by Copilot. | [ ] |
| **COP-06** | Manual Textarea Input | Type custom question and press Enter ↵ | Submits question, clears input field, and scrolls to bottom of conversation stream. | [ ] |
| **COP-07** | Multi-Line Input | Press Shift + Enter | Inserts newline without prematurely submitting question. | [ ] |
| **COP-08** | Empty Submission Prevention | Click Ask Copilot with empty text | Button is disabled; no empty request is dispatched. | [ ] |
| **COP-09** | Service Failure Fallback | Disconnect backend during Copilot query | System posts an error message bubble and logs failure without crashing chat component. | [ ] |
| **COP-10** | Clear Conversation | Click "Clear Conversation" | Chat history resets back to initial onboarding state. | [ ] |

---

## 5. General Usability, UI Consistency & Cross-Platform

| # | Test Case | Steps | Expected Result | Pass / Fail |
|---|---|---|---|---|
| **GEN-01** | Browser Console Cleanliness | Open browser DevTools console (F12) across all pages | Zero unhandled exceptions, zero duplicate React key warnings, zero undefined prop errors. | [ ] |
| **GEN-02** | Responsive Layout (Desktop) | View on 1920x1080 and 1440x900 screens | Balanced max-width containers, proper padding, and readable typography. | [ ] |
| **GEN-03** | Responsive Layout (Tablet) | View on iPad / 768px viewport | Sidebar collapses to mobile drawer or icon menu; grids adapt smoothly. | [ ] |
| **GEN-04** | Responsive Layout (Mobile) | View on iPhone / 375px viewport | All cards, buttons, and inputs fit without horizontal overflow. | [ ] |
| **GEN-05** | Browser Refresh Persistence | Refresh browser (F5) on `/admin/leave-impact` | Page re-fetches cleanly and retains user's authenticated session. | [ ] |
