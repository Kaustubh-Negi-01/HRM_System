# ◈ DayFlow — Intelligent Workforce Operating System

<div align="center">

![DayFlow Banner](https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80)

**An intelligent, proactive Human Resource Management & Decision-Support System with Real-Time Staffing Intelligence, AI Copilot, and Departmental Budget Planning.**

### 🚀 **[Live Web App (Login)](https://humanresourcemanagement-theta.vercel.app/login)**
👉 **Production URL**: **[https://humanresourcemanagement-theta.vercel.app](https://humanresourcemanagement-theta.vercel.app)**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Login_Portal-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://humanresourcemanagement-theta.vercel.app/login)
[![Repository](https://img.shields.io/badge/GitHub-saksham--2x7%2Fhumanresourcemanagement-38BDF8?style=for-the-badge&logo=github)](https://github.com/saksham-2x7/humanresourcemanagement)
[![Database](https://img.shields.io/badge/Supabase-Cloud_PostgreSQL-10B981?style=for-the-badge&logo=supabase)](https://supabase.com)
[![AI Engine](https://img.shields.io/badge/Google_Gemini-HR_Copilot-0284C7?style=for-the-badge&logo=google)](https://ai.google.dev)
[![Theme](https://img.shields.io/badge/Theme-Jet_Black_Obsidian-000000?style=for-the-badge)](https://github.com/saksham-2x7/humanresourcemanagement)

</div>

---

## 🌟 The Vision

Traditional HRMS tools are passive record containers: employees fill forms, managers blindly click approve, and critical staffing bottlenecks emerge undetected.

**DayFlow** reimagines workforce management as an **Intelligent Workforce Operating System** equipped with:
* 📡 **Proactive Staffing Risk Radar**: Predicts burnout and capacity drops before they occur.
* 🔮 **Smart Leave Impact Simulation**: Deterministic mathematical modeling of team coverage before time-off approval.
* 🤖 **AI-Powered HR Copilot**: Conversational intelligence grounded directly in live organizational data.
* 💰 **Manager & HR Budget Planner (INR ₹)**: Real-time department compensation runways and headcount allocations.
* ⏱️ **Live Digital Punch Clock & Cross-Role Sprint Tracker**: Ticking seconds, active shift timer, and real-time task completion feeds.

---

## 🚀 Key Architectural Differentiators

```
                       ┌──────────────────────────────────────┐
                       │          DAYFLOW WORKFORCE OS        │
                       └──────────────────┬───────────────────┘
                                          │
       ┌──────────────────────────────────┼──────────────────────────────────┐
       ▼                                  ▼                                  ▼
┌──────────────┐                 ┌─────────────────┐                ┌──────────────────┐
│  Workforce   │                 │   Smart Leave   │                │    AI Copilot    │
│    Pulse™    │                 │     Impact™     │                │    Assistant     │
├──────────────┤                 ├─────────────────┤                ├──────────────────┤
│ Burnout      │                 │ Staffing        │                │ Real-time        │
│ telemetry,   │                 │ simulations,    │                │ queries, data    │
│ capacity &   │                 │ conflict alerts │                │ synthesis &      │
│ risk radar   │                 │ & mitigations   │                │ instant tables   │
└──────────────┘                 └─────────────────┘                └──────────────────┘
```

### 1. 📡 Workforce Pulse™ (`/admin/workforce-pulse`)
A live visual telemetry feed of organizational vitality:
* **Health Index Score**: Real-time composite score (e.g. `88/100`) tracking overall workforce stability.
* **Proactive Burnout Alerts**: Automatic detection when team overtime crosses critical thresholds.
* **Capacity Indicators**: Visual breakdown of operational bandwidth across Engineering, Customer Support, Product, Marketing, and HR.
* **7-Day Rolling Trend**: Interactive visual chart showing attendance consistency.
* **Employee Sentiment & eNPS**: Live eNPS score (`+64`) with 91.4% retention stability index.

### 2. 🔮 Smart Leave Impact™ (`/admin/leave-impact`)
Predictive decision-support engine for time-off requests:
* **Coverage Simulation**: Visualizes Current Team Coverage vs. Projected Coverage after approval.
* **Concurrent Absence Radar**: Highlights overlapping leave requests among members in the same department.
* **Deterministic Risk Classifier**: Categorizes risk (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) using mathematical staffing thresholds rather than vague guesswork.
* **One-Click Mitigation & AI Safe-Approve**: Instant approval with structured audit rationale logged to the cloud.

### 3. 🤖 AI HR Copilot (`/admin/copilot`)
Natural-language intelligence engine powered by Google Gemini and database telemetry:
* **Data-Grounded Queries**: Answers complex questions like *"Which team has the highest absence rate this month?"*, *"What is our projected Q3 payroll run?"*, or *"Show employee leave breakdown for Engineering."*
* **Dynamic Markdown Tables**: Generates interactive data tables and recommendation action chips on the fly.
* **Deterministic Guardrails**: Grounded in live Supabase records to eliminate hallucinations.

### 4. 💰 Department Budget & Headcount Planner (`/admin/payroll`)
Enterprise-grade compensation & budget planning in Indian Rupees (INR ₹):
* **Live Department Runways**: Real-time progress bars tracking budget allocation vs. spend across departments.
* **Interactive Budget Adjustment**: Allows HR Directors and Managers to reallocate annual budget limits on demand.
* **Statutory TDS & Statutory Reserve**: Automated deduction calculations and digital payslip generators.

### 5. ⏱️ Live Punch Clock & Cross-Role Sprint Tracker (`/employee`)
Real-time employee execution and attendance console:
* **Live Accurate Clock**: Real-time digital clock with ticking seconds (`HH:MM:SS AM/PM`).
* **Active Shift Timer**: Counts active shift hours with animated status pulses.
* **Interactive Tasks & Live Feed**: Employees tick tasks done; HR/Managers see live task progress in real-time.

---

## 🔐 Multi-Persona Authentication & Google Login

* **Google 1-Click Login**: Interactive Google Account Picker supporting Saksham Singh, Alex Chen, Priya Sharma, or any custom Gmail address with instant profile derivation.
* **Quick Demo Personas**: 1-click switcher between Admin (Saksham Singh), Engineering Lead (Alex Chen), and Support Manager (Priya Sharma).
* **Forgot Password Recovery**: Interactive password reset modal with instant database credential updates.
* **Session Persistence**: Sessions survive hard reloads (`Cmd+Shift+R` / `F5`) seamlessly.
* **Global Command Palette**: Instant `Cmd + K` navigation and shortcut engine.

---

## 👥 Demo Credentials

| Role | Name | Email | Default Password | Workspace Route |
|---|---|---|---|---|
| **Admin / HR Director** | Saksham Singh | `admin@dayflow.internal` | `Password123!` | Admin Command Center |
| **Lead Engineer** | Alex Chen | `alex.chen@dayflow.internal` | `Password123!` | Employee Portal |
| **Support Manager** | Priya Sharma | `priya.sharma@dayflow.internal` | `Password123!` | Employee Portal |

*(You can also click **"Continue with Google"** on the login page for instant 1-click access!)*

---

## 🛠️ Quick Start Guide (Run Locally)

### 1. Clone the Repository
```bash
git clone https://github.com/saksham-2x7/humanresourcemanagement.git
cd humanresourcemanagement
```

### 2. Install Dependencies
```bash
npm run setup
```

### 3. Start Application
```bash
# Starts Backend (Port 5001) & Frontend (Port 3000) concurrently
npm start
```

### 4. Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)** or use the live deployment at **[https://humanresourcemanagement-theta.vercel.app](https://humanresourcemanagement-theta.vercel.app)**!

---

## 📂 Project Architecture

```
humanresourcemanagement/
├── backend/                  # Node.js + Express REST API & Supabase Integration
│   ├── config/               # Database and Supabase Client config
│   ├── controllers/          # Business logic controllers
│   ├── middleware/           # Auth, JWT, RBAC middleware
│   ├── routes/               # Express endpoints (auth, employees, attendance, leave, payroll)
│   ├── services/             # Workforce calculation & AI Copilot services
│   └── server.js             # Backend server entrypoint (Port 5001)
├── frontend/                 # Vite + React 18 SPA (Port 3000)
│   ├── src/
│   │   ├── api/              # Supabase client & Axios configuration
│   │   ├── components/       # UI system (Cards, Modals, Tables, Buttons, Avatars, Topbar, Sidebar, CommandPalette)
│   │   ├── features/         # Service layers (auth, employee, attendance, leave, payroll, workforce)
│   │   ├── pages/admin/      # Admin Command Center, Pulse, Leave Impact, Copilot, Payroll & Budget
│   │   ├── pages/employee/   # Employee Workspace, Live Punch Clock, Sprint Tasks, Payslips, Profile
│   │   └── styles/           # Jet Black Obsidian design tokens & CSS variables
├── supabase/                 # Cloud PostgreSQL schema, migrations, and seed scripts
└── docs/                     # Authoritative specifications and judge walkthrough guides
```

---

## 🎨 Design System: Jet Black Obsidian

* **Background**: Pure Pitch Black (`#000000`) & Deep Onyx (`#040407`)
* **Surfaces**: Dark Charcoal Panels (`#0A0A0F`) with subtle `rgba(255, 255, 255, 0.08)` borders
* **Primary Accents**: High-Tech Electric Cyan (`#38BDF8`) & Sky Blue (`#0284C7`)
* **Status Indicators**: Emerald Green (`#10B981`), Amber Warning (`#F59E0B`), Rose Danger (`#EF4444`)
* **Typography**: Crisp Inter font with monospace timestamp accents.

---

## 📄 License & Ownership

Built for the **DayFlow Intelligent Workforce OS Hackathon**.  
Lead Development by **Saksham Singh** & Team.
