# DayFlow — UI Architecture & Design System Plan

Owner: **Santhosh** (UI/UX + Frontend Architecture + Design System)
Goal: Saksham builds every page from our components **without making a single visual decision**.

---

## 0. Repo facts

- Repo root: `/home/santosh/Documents/HRM_System`
- Frontend app: `frontend/` (React + Vite, currently EMPTY — no deps installed)
- Our ownership: `frontend/src/components/`, `frontend/src/layout/`, `frontend/src/styles/`
- Domain (from backend): auth, employees, attendance, leave, payroll, workforce analytics, AI copilot

---

## 1. Visual identity (LOCKED — do not deviate)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F8FAFC` | App background |
| `--surface` | `#FFFFFF` | Cards, sidebar, topbar |
| `--primary` | `#4F46E5` | Buttons, active nav, links, focus |
| `--primary-hover` | `#4338CA` | Button hover |
| `--primary-soft` | `#EEF2FF` | Active nav bg, selected rows, info badges |
| `--text` | `#0F172A` | Headings, primary text |
| `--text-muted` | `#64748B` | Secondary text, labels |
| `--border` | `#E2E8F0` | Card borders, dividers, input borders |
| `--success` | `#16A34A` (+ soft `#DCFCE7`) | Approved, present, positive trend |
| `--warning` | `#F59E0B` (+ soft `#FEF3C7`) | Pending, late, half-day |
| `--danger` | `#DC2626` (+ soft `#FEE2E2`) | Rejected, absent, destructive, errors |
| Font | **Inter** (400/500/600/700) | Everything |
| Radius | `--radius-sm: 6px`, `--radius-md: 10px`, `--radius-lg: 14px`, `--radius-full: 9999px` | inputs/buttons, cards, modals, pills |
| Shadow | `--shadow-sm: 0 1px 2px rgb(15 23 42 / .06)` · `--shadow-md: 0 4px 12px rgb(15 23 42 / .08)` · `--shadow-lg: 0 12px 32px rgb(15 23 42 / .14)` | hover, dropdown/modal |
| Spacing scale | `--space-1: 4px` … `--space-8: 64px` (4/8/12/16/24/32/48/64) | ONLY these values |

Vibe: Linear/Vercel-style clean SaaS. No gradients, no rainbow accents, no bounce animations.

## 2. Status → color mapping (single source of truth)

| Domain value | Badge variant |
|---|---|
| leave: `pending` | warning |
| leave: `approved` | success |
| leave: `rejected` / `cancelled` | danger / neutral |
| attendance: `present` / `wfh` | success / info |
| attendance: `late` / `half-day` | warning |
| attendance: `absent` | danger |
| payroll: `paid` | success · `processing` warning · `failed` danger |

## 3. File architecture (final)

```
frontend/src/
├── styles/
│   ├── theme.css        # ALL design tokens (single source of truth)
│   └── index.css        # reset + base typography + utilities (.page, .stack, .row)
├── components/
│   ├── ui/              # Button, Input, Select, Textarea, Field, Card, Badge,
│   │                    # Modal, Table(+Header/Row/Pagination), Loader, Skeleton,
│   │                    # EmptyState, ErrorState, Alert, Avatar, Tabs, Dropdown, SearchBar
│   ├── navigation/      # Sidebar, Topbar, Breadcrumbs
│   └── dashboard/       # StatCard, ChartCard, ActivityItem
├── layout/
│   ├── AdminLayout.jsx      # Sidebar + Topbar shell for /admin/*
│   ├── EmployeeLayout.jsx   # slimmer shell for /employee/*
│   └── AuthLayout.jsx       # centered card shell for /login
└── pages/
    ├── admin/    Dashboard, Employees, EmployeeDetail, Attendance, Leave, Payroll, Reports, Settings
    ├── employee/ MyDashboard, MyAttendance, MyLeave, MyPayslips, MyProfile
    └── auth/     Login
```

## 4. Component contracts (Saksham builds pages against THESE)

```jsx
<Button variant="primary|secondary|ghost|danger" size="sm|md|lg" loading disabled icon>
<Input label error helper placeholder prefix>          // wrapped by <Field> internally
<Select label options={[{label,value}]} error>
<Card title subtitle actions footer padded>            // consistent 24px padding
<Badge variant="success|warning|danger|info|neutral">APPROVED</Badge>
<Modal open onClose title footer size="sm|md|lg">
<Table columns data loading empty onRowClick stickyHeader pagination pageSize={10}/>
  // columns: [{ key, header, align, width, render(row) }]
<StatCard label value delta deltaDirection icon/>
<ChartCard title subtitle actions><AreaChart|BarChart|Donut/></ChartCard>
<EmptyState icon title description actionLabel onAction/>
<ErrorState title description onRetry/>
<Alert variant title dismissible>children</Alert>
```

Rules every component follows:
- Label above input, helper below, error replaces helper in `--danger`.
- Focus ring: `outline: 2px solid var(--primary); outline-offset: 2px` — identical everywhere.
- Every list view supports loading (skeleton), empty (`EmptyState`), error (`ErrorState`).
- Numbers use tabular figures: `font-variant-numeric: tabular-nums`.

## 5. Navigation map

**Admin sidebar** (grouped):
- MAIN: Dashboard · Employees · Attendance · Leave
- MANAGEMENT: Payroll · Reports
- SYSTEM: Settings
- Footer card: logged-in user avatar + name + role

**Employee sidebar**: My Dashboard · My Attendance · My Leave · My Payslips · My Profile

Routes: `/login`, `/admin/*` (guarded, role=admin), `/employee/*` (role=employee).
Mobile (<1024px): sidebar becomes slide-over drawer opened from Topbar hamburger; overlay closes it.

## 6. Responsive breakpoints

- `≥1280` full layout · `1024–1279` sidebar collapses to icons · `<1024` drawer nav · tables scroll horizontally inside Card · StatCards grid 4→2→1.

## 7. Build order (today)

| # | Task | Time |
|---|---|---|
| 1 | Scaffold deps, router, fonts, theme.css, index.css | 20 min |
| 2 | `ui/` primitives (Button→Table) | 90 min |
| 3 | navigation/ + layouts | 60 min |
| 4 | dashboard/ composites | 30 min |
| 5 | **Admin Dashboard reference page** (make it 🔥) | 60 min |
| 6 | `/design` styleguide route showcasing every component+state | 30 min |
| 7 | Commit on branch `feat/design-system`, PR → merge | 15 min |
| 8 | Handoff: Saksham builds pages using catalog; you review PRs | ongoing |

Git discipline (judges check!): work on `feat/*` branches, small commits (`feat(ui): add Table component`), open PRs, let teammates review/merge.

---

## 8. ANTIGRAVITY PROMPTS (paste in order, one phase at a time)

### PROMPT 1 — Scaffold & tokens
```
You are working in frontend/ of a React HRM dashboard called DayFlow. Set up the foundation ONLY — no pages yet.

1. Install dependencies: react, react-dom, react-router-dom, recharts, lucide-react, @fontsource/inter, and devDeps: vite, @vitejs/plugin-react.
2. Configure vite.config.js with the react plugin and a proxy: '/api' -> 'http://localhost:5000'.
3. Create src/styles/theme.css defining CSS custom properties EXACTLY:
   Colors: --bg:#F8FAFC; --surface:#FFFFFF; --primary:#4F46E5; --primary-hover:#4338CA; --primary-soft:#EEF2FF;
   --text:#0F172A; --text-muted:#64748B; --border:#E2E8F0;
   --success:#16A34A; --success-soft:#DCFCE7; --warning:#F59E0B; --warning-soft:#FEF3C7;
   --danger:#DC2626; --danger-soft:#FEE2E2; --info:#2563EB; --info-soft:#DBEAFE;
   Radii: --radius-sm:6px; --radius-md:10px; --radius-lg:14px; --radius-full:9999px.
   Shadows: --shadow-sm:0 1px 2px rgb(15 23 42/.06); --shadow-md:0 4px 12px rgb(15 23 42/.08); --shadow-lg:0 12px 32px rgb(15 23 42/.14).
   Spacing: --space-1:4px through --space-8:64px (4,8,12,16,24,32,48,64).
   Typography: font-family Inter; sizes --text-xs:12px, --text-sm:13px, --text-md:14px, --text-lg:16px, --text-xl:20px, --text-2xl:24px, --text-3xl:30px; weights 400/500/600/700.
4. Create src/styles/index.css with: a modern CSS reset, body{background:var(--bg);color:var(--text);font-family:'Inter'}, focus-visible ring (2px solid var(--primary), offset 2px), utility classes .page (max-width 1200px, margin auto, padding var(--space-6)), .stack (display:flex;flex-direction:column;gap:var(--space-4)), .row (flex, gap var(--space-4), align-center), .grid-cards (responsive grid, min 240px columns), and .table-num {font-variant-numeric:tabular-nums}.
5. Import '@fontsource/inter/{400,500,600,700}.css' and both css files in src/main.jsx. Render <App/> with BrowserRouter in main.jsx; make App.jsx set up routes: /login, /admin/*, /employee/* each rendering a temporary placeholder div so the app runs.
ACCEPTANCE: npm run dev shows a page with Inter font, #F8FAFC background, no console errors.
Do NOT create any components yet. Do NOT invent extra colors or spacing values.
```

### PROMPT 2 — UI primitives
```
In frontend/src/components/ui/, create these React components. Plain CSS co-located as ComponentName.css next to each JSX file. Use ONLY the CSS variables from src/styles/theme.css — never hardcode colors/sizes. Every component needs loading/disabled/error states where relevant and must be keyboard accessible.

1. Button.jsx — variant: primary|secondary|ghost|danger; size sm|md|lg; props: loading (shows spinner, disables), icon (left), fullWidth. Primary = solid indigo; secondary = white bg + border; ghost = transparent, text-muted hover surface; danger = red.
2. Field.jsx — wrapper rendering label (13px, 600, text color), control, helper text (12px muted), error text (12px danger) when error prop present.
3. Input.jsx — uses Field; props label, error, helper, prefix (e.g. ₹), suffix; height 40px, radius-sm, border var(--border), focus border primary.
4. Textarea.jsx — same conventions, min-height 96px.
5. Select.jsx — native select styled identically to Input, chevron icon right.
6. Card.jsx — white surface, radius-lg, border 1px var(--border), shadow-sm; props: title, subtitle, actions (right side of header), footer, padded=true (24px). Header only renders if title/actions given.
7. Badge.jsx — pill, 12px/600 uppercase tracking 0.02em, soft bg + strong text color; variants success|warning|danger|info|neutral mapping to the *-soft bg and solid text tokens.
8. Modal.jsx — portal-based, overlay rgba(15,23,42,.5), centered panel radius-lg shadow-lg, sizes sm 400/md 560/lg 720; props open,onClose,title,footer; close on ESC + overlay click; focus trap; entrance animation 150ms fade+scale .98→1.
9. Table.jsx — compound: <Table columns data loading empty pagination pageSize onRowClick stickyHeader/>. Column def {key,header,align,width,render}. Renders: thead (12px uppercase muted, bottom border), tbody rows with 1px borders and hover bg #F8FAFC, numeric cells get .table-num. loading→8 skeleton rows; empty→<EmptyState>; pagination→footer with "Showing X–Y of Z" + Prev/Next buttons. Wrap in overflow-x:auto for mobile.
10. Loader.jsx — spinner (primary, 20px) and Skeleton.jsx — shimmer block with configurable width/height/radius.
11. EmptyState.jsx — centered: 48px muted icon, title (16px/600), description (14px muted), optional action Button. Default icon inbox.
12. ErrorState.jsx — danger-tinted variant of EmptyState with Try Again button.
13. Alert.jsx — variants success|warning|danger|info: soft bg, left border 3px solid color, icon, title+children, optional dismiss X.
14. Avatar.jsx — initials fallback from name, sizes sm 28/md 36/lg 44, bg primary-soft text primary.
15. Tabs.jsx — underline style tabs, active = primary text + 2px primary underline, animated indicator.
16. Dropdown.jsx — button + menu panel (surface, radius-md, shadow-lg, 8px item padding, hover bg #F8FAFC), closes on outside click/ESC.
17. SearchBar.jsx — input with search icon left, clear button when non-empty, debounced onChange (300ms).
18. Create components/ui/index.js exporting all of them.
ACCEPTANCE: temporarily render one of each in App.jsx — visually consistent, aligned to the 4/8/12/16/24/32 rhythm, keyboard-navigable Modal/Dropdown/Tabs. Then REMOVE the demo markup before finishing.
```

### PROMPT 3 — Navigation & layouts
```
Create the app shells in frontend/src/components/navigation/ and frontend/src/layout/.

1. Sidebar.jsx — 260px fixed white surface, right border. Structure:
   - Top: logo mark (◈ in a 32px primary-soft rounded square) + "DayFlow" wordmark (18px/700).
   - Nav groups with 11px uppercase letter-spaced muted section labels: MAIN (Dashboard, Employees, Attendance, Leave), MANAGEMENT (Payroll, Reports), SYSTEM (Settings).
   - Items: 36px height, 10px radius, icon (lucide, 18px) + 14px/500 label; default text-muted; hover bg #F8FAFC text-primary; ACTIVE = primary-soft bg + primary text + 600 weight (use NavLink end/responsive so nested routes stay highlighted).
   - Bottom: user card (Avatar + name 14px/600 + role 12px muted) inside a bordered rounded box.
   - Props: items=[{section, items:[{label,to,icon}]}], user={name,role}, collapsed (icons-only 72px mode), onNavigate (closes mobile drawer).
2. Topbar.jsx — 64px white surface, bottom border, sticky. Left: hamburger (mobile only) + Breadcrumbs from route. Right: SearchBar (desktop), notification bell button with tiny danger dot, Avatar Dropdown (Profile, Settings, divider, Logout in danger).
3. PageHeader.jsx — title 24px/700, subtitle 14px muted, actions slot right-aligned; margin-bottom space-6.
4. AdminLayout.jsx — grid: Sidebar fixed left, content area with Topbar top; content wrapper = .page container; <Outlet/> inside. Accepts sidebar config via props with defaults for admin nav.
5. EmployeeLayout.jsx — same shell, employee nav (My Dashboard, My Attendance, My Leave, My Payslips, My Profile).
6. AuthLayout.jsx — full-screen bg, centered Card max-width 400px with logo on top; used by Login.
7. Responsive: <1024px sidebar hidden, opens as fixed drawer (translateX animation 200ms) + overlay; Topbar hamburger toggles it. 1024–1279px sidebar auto-collapses to icon rail with tooltips.
8. Wire routes in App.jsx: /admin/* → AdminLayout, /employee/* → EmployeeLayout, /login → AuthLayout, each with placeholder child pages under src/pages/admin/, employee/, auth/.
ACCEPTANCE: navigating placeholders keeps correct sidebar item active; resizing to mobile shows drawer; no layout shift; logout/menu buttons are real buttons with aria-labels.
```

### PROMPT 4 — Dashboard composites
```
In frontend/src/components/dashboard/ create:
1. StatCard.jsx — Card containing: row [label 13px muted + icon in 36px primary-soft rounded square], value 28px/700 tabular-nums, optional delta line ("+12%" 13px/600 colored success/danger by direction + "vs last month" muted). Props: label,value,delta,deltaDirection('up'|'down'|'flat'),icon,loading (skeleton).
2. ChartCard.jsx — Card wrapper with title/subtitle/actions header and a content area min-height 280px; children = chart; loading state = Skeleton.
3. ActivityItem.jsx — row: Avatar, text (14px, name bolded via <strong>), timestamp 12px muted, optional trailing Badge. Used in a "Recent Activity" Card list with 12px row gaps and dividers.
Export all from components/dashboard/index.js. Verify they compose inside a Card grid without custom margins (spacing comes from parent .grid-cards/.stack utilities).
```

### PROMPT 5 — Reference Admin Dashboard page
```
Build src/pages/admin/Dashboard.jsx as the QUALITY BAR page for DayFlow. Use ONLY existing components/utilities — no new colors, no ad-hoc margins outside the spacing variables.

Layout (top to bottom):
1. PageHeader: "Good morning, Admin 👋" + subtitle "Here's what's happening at your company today." Actions: secondary Button "Export Report", primary Button "+ Add Employee".
2. Row of 4 StatCards: Total Employees 248 (+12% up, Users icon), Present Today 231 (94% , up, CheckCircle), On Leave 17 (down, CalendarOff), Pending Approvals 12 (warning tint icon, Clock).
3. Two-column grid (2fr/1fr, stacks on <1024px):
   LEFT: ChartCard "Attendance Overview" subtitle "Last 7 days" with a recharts AreaChart (present vs absent, primary + danger strokes, soft area fills, no gridline clutter, rounded caps, custom tooltip styled like a mini Card).
   RIGHT: Card "Recent Activity" with 5 ActivityItems (e.g., "Priya Sharma applied for leave" Badge pending; "Rahul Verma clocked in 9:02" ; "Payroll for July processed" success; "New employee onboarded: Aisha Khan"; "Leave approved for Vikram Singh").
4. Below: Card "Pending Leave Requests" with Table: columns Employee (Avatar+name+id), Type, From–To, Days, Status(Badge), Actions(View ✓ ✗ ghost icon buttons). 5 mock rows mixing pending/approved/rejected. Row click → console.log placeholder.
All data = clearly-marked MOCK_DATA constant at top of file (backend integration comes later). Loading states: add a toggle in the corner that flips the whole page to skeletons so we can demo polish.
ACCEPTANCE: pixel-clean at 1440px, 1024px, 375px; every number tabular; hover states subtle; nothing bounces except modal/toast transitions defined earlier.
```

### PROMPT 6 — Styleguide route for Saksham
```
Create src/pages/admin/Styleguide.jsx mounted at /admin/design (nav item "Design System" visible only in dev). Sections, each in a Card with code-sample captions:
Colors (swatch grid of every token incl. soft variants) · Typography scale · Spacing scale visualized · Buttons (all variants × sizes × states incl. loading/disabled) · Form pattern (Input/Select/Textarea showing helper AND error states side by side) · Badges (all variants with real domain values: Approved/Pending/Rejected/Present/Absent/Late/WFH/Paid/Processing/Failed) · Table (loading, empty, populated) · Modal + Dropdown + Tabs + Alerts · StatCard/ChartCard/ActivityItem · EmptyState/ErrorState/Loader/Skeleton.
Purpose: Saksham copies patterns from here instead of inventing UI. Keep it updated whenever components change.
```

### PROMPT 7 — Review checklist (run yourself, not Antigravity)
- grep the codebase for hardcoded hex colors outside theme.css → must be zero
- grep for px values not in {2,4,6,8,10,12,14,16,20,24,28,32,40,48,56,64} → justify or fix
- every table/list has loading+empty+error handling
- Lighthouse quick pass: contrast ≥ 4.5:1, tap targets ≥ 40px, no horizontal scroll at 375px
- commit: feat(design-system): tokens, primitives, layouts, dashboard reference
```

---

## 9. Handoff message template for Saksham

> Pages must be composed ONLY from `components/ui`, `components/dashboard`, layouts, and the utilities in `index.css`. If you need something new, ping me — don't restyle. Copy patterns from `/admin/design`. Every list needs loading/empty/error. Spacing = only the `--space-*` variables.
