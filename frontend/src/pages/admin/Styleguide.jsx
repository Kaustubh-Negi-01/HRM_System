import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Send,
  Search,
} from 'lucide-react';
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  Badge,
  Modal,
  Table,
  Tabs,
  Loader,
  Skeleton,
  EmptyState,
  ErrorMessage,
  ErrorState,
  Alert,
  Avatar,
  Dropdown,
  SearchBar,
  Tooltip,
} from '../../components/ui';
import {
  StatusBadge,
  RiskBadge,
  EmployeeAvatar,
  ConfirmDialog,
} from '../../components/shared';
import {
  StatCard,
  ChartCard,
  ActivityList,
  AlertCard,
  AttendanceChart,
} from '../../components/dashboard';
import {
  WorkforceMetricCard,
  CoverageIndicator,
  ImpactCard,
  CopilotContainer,
} from '../../components/intelligent';
import { PageHeader } from '../../components/layout/PageContainer';

export const Styleguide = () => {
  const [activeTab, setActiveTab] = useState('primitives');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello! I am Dayflow Copilot. Ask me about workforce presence, upcoming leave risks, or department staffing levels.',
      timestamp: '10:00 AM',
      suggestions: ['Who has the highest absence rate?', 'Show leave impact for Engineering'],
    },
  ]);

  const handleCopilotSend = (query) => {
    if (!query?.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };
    setCopilotMessages((prev) => [...prev, newMsg]);
    setCopilotInput('');

    // Simulate smart reply
    setTimeout(() => {
      setCopilotMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: `Analysis for "${query}": Engineering department currently has 87% coverage. There are 2 pending leave requests for next week. Approving both will decrease coverage to 67% (High Risk).`,
          timestamp: 'Just now',
        },
      ]);
    }, 600);
  };

  const sampleTableColumns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (_, row) => (
        <EmployeeAvatar
          name={row.name}
          subtitle={row.dept}
          status={row.status === 'Present' ? 'present' : row.status === 'On Leave' ? 'leave' : 'absent'}
          size="sm"
        />
      ),
    },
    { key: 'role', header: 'Role' },
    { key: 'type', header: 'Type' },
    {
      key: 'status',
      header: 'Status',
      render: (val, row) => <StatusBadge status={val || row.status} />,
    },
    {
      key: 'risk',
      header: 'Staffing Risk',
      render: (val, row) => <RiskBadge level={val || row.risk} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: () => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="sm">View</Button>
          <Button variant="secondary" size="sm">Edit</Button>
        </div>
      ),
    },
  ];

  const sampleTableData = [
    { id: 1, name: 'Priya Sharma', dept: 'Engineering', role: 'Staff Engineer', type: 'Full-time', status: 'Present', risk: 'Low' },
    { id: 2, name: 'Rahul Verma', dept: 'Design', role: 'Product Designer', type: 'Full-time', status: 'Present', risk: 'Low' },
    { id: 3, name: 'Aisha Khan', dept: 'Product', role: 'Product Manager', type: 'Full-time', status: 'Pending', risk: 'Medium' },
    { id: 4, name: 'Vikram Singh', dept: 'Engineering', role: 'Backend Lead', type: 'Full-time', status: 'Approved', risk: 'High' },
    { id: 5, name: 'Ananya Roy', dept: 'Marketing', role: 'Growth Specialist', type: 'Contract', status: 'Absent', risk: 'Moderate' },
  ];

  const sampleActivities = [
    { name: 'Priya Sharma', action: 'submitted a leave request for', target: 'Aug 24-28', timestamp: '12m ago', badge: 'PENDING', badgeVariant: 'warning' },
    { name: 'Rahul Verma', action: 'clocked in at', target: '09:02 AM', timestamp: '1h ago', badge: 'PRESENT', badgeVariant: 'success' },
    { name: 'Finance Bot', action: 'completed July payroll processing', timestamp: '3h ago', badge: 'PAID', badgeVariant: 'success' },
    { name: 'Aisha Khan', action: 'onboarded to Product Management', timestamp: '5h ago', badge: 'ACTIVE', badgeVariant: 'info' },
  ];

  return (
    <div className="page stack-lg">
      <PageHeader
        title="Dayflow Design System & UI Catalog"
        subtitle="Shared frontend component showcase and documentation for developers."
        badge={<Badge variant="primary">v1.0 Architecture</Badge>}
        actions={
          <div className="row">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTableLoading(!tableLoading)}
            >
              Toggle Loading State
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles size={15} />}
              onClick={() => setModalOpen(true)}
            >
              Open Sample Modal
            </Button>
          </div>
        }
      />

      {/* Tabs Switcher */}
      <Tabs
        tabs={[
          { id: 'primitives', label: '1. UI Primitives' },
          { id: 'badges', label: '2. Domain Badges & Controls' },
          { id: 'dashboard', label: '3. Dashboard Composites' },
          { id: 'intelligent', label: '4. Intelligent Features' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {/* TAB 1: UI PRIMITIVES */}
      {activeTab === 'primitives' && (
        <div className="stack-lg">
          {/* Buttons */}
          <Card title="Button Hierarchy" subtitle="Standard interactive buttons supporting variants, sizes, loading, and icons.">
            <div className="stack">
              <div className="row-wrap">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Action</Button>
                <Button variant="success">Success Action</Button>
                <Button variant="primary" loading>Loading</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
              <div className="row-wrap">
                <Button variant="primary" size="sm" icon={<Plus size={14} />}>Small Button</Button>
                <Button variant="secondary" size="md" icon={<Download size={15} />}>Medium Button</Button>
                <Button variant="primary" size="lg" iconRight={<Send size={16} />}>Large Button</Button>
              </div>
            </div>
          </Card>

          {/* Form Controls */}
          <Card title="Form System" subtitle="Input, Select, and Textarea with integrated Field wrappers and error states.">
            <div className="grid-3">
              <Input
                label="Employee Full Name"
                placeholder="e.g. Maya Patel"
                helper="Legal name as per passport"
                required
              />
              <Input
                label="Monthly Salary"
                prefix="₹"
                placeholder="1,20,000"
                helper="Base compensation"
              />
              <Input
                label="Work Email"
                placeholder="maya@dayflow.io"
                error="Please enter a valid company domain"
                defaultValue="invalid-email"
              />
              <Select
                label="Department"
                placeholder="Select Department"
                options={[
                  { value: 'eng', label: 'Engineering' },
                  { value: 'design', label: 'Design & UX' },
                  { value: 'product', label: 'Product' },
                  { value: 'hr', label: 'Human Resources' },
                ]}
                required
              />
              <Select
                label="Role Category"
                options={['Executive', 'Individual Contributor', 'Contractor']}
                defaultValue="Individual Contributor"
              />
              <Textarea
                label="Reason for Leave"
                placeholder="Describe your leave reason..."
                rows={2}
                helper="HR and your manager will review this"
              />
            </div>
          </Card>

          {/* Search & Tooltips & Dropdowns */}
          <Card title="Utility Primitives" subtitle="SearchBar, Dropdown menu, and accessible Tooltips.">
            <div className="row-wrap">
              <div style={{ width: '320px' }}>
                <SearchBar placeholder="Type to search..." />
              </div>
              <Dropdown
                trigger={<Button variant="secondary">Actions Menu ▾</Button>}
                items={[
                  { label: 'Export to CSV', icon: <Download size={14} />, onClick: () => {} },
                  { label: 'Manage Roles', onClick: () => {} },
                  { divider: true },
                  { label: 'Delete Records', icon: <Trash2 size={14} />, danger: true, onClick: () => setConfirmOpen(true) },
                ]}
              />
              <Tooltip content="Live calculated metric" position="top">
                <Button variant="ghost">Hover for Tooltip</Button>
              </Tooltip>
            </div>
          </Card>

          {/* Alerts & Messages */}
          <Card title="Alerts & System Feedback" subtitle="Contextual alerts and error banners.">
            <div className="stack">
              <Alert variant="info" title="System Update Scheduled" dismissible>
                Dayflow will undergo brief maintenance on Sunday at 02:00 AM UTC.
              </Alert>
              <Alert variant="success" title="Payroll Batch Processed">
                All 248 salary disbursements have been scheduled successfully.
              </Alert>
              <Alert variant="warning" title="Staffing Shortage Warning" dismissible>
                Frontend engineering has 3 overlapping leaves approved next week.
              </Alert>
              <Alert variant="danger" title="Unauthorized Access Attempt">
                Access to payroll settings requires Super Admin credentials.
              </Alert>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: DOMAIN BADGES & CONTROLS */}
      {activeTab === 'badges' && (
        <div className="stack-lg">
          <Card title="Status & Risk Badges" subtitle="Single source of truth for Attendance, Leave, Payroll, and Risk indicators.">
            <div className="stack">
              <div>
                <h5 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '8px' }}>Leave Statuses</h5>
                <div className="row-wrap">
                  <StatusBadge status="pending" />
                  <StatusBadge status="approved" />
                  <StatusBadge status="rejected" />
                  <StatusBadge status="cancelled" />
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '8px' }}>Attendance Statuses</h5>
                <div className="row-wrap">
                  <StatusBadge status="present" />
                  <StatusBadge status="absent" />
                  <StatusBadge status="half-day" />
                  <StatusBadge status="late" />
                  <StatusBadge status="wfh" />
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '8px' }}>Payroll Statuses</h5>
                <div className="row-wrap">
                  <StatusBadge status="paid" />
                  <StatusBadge status="processing" />
                  <StatusBadge status="failed" />
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '8px' }}>Workforce Risk Levels</h5>
                <div className="row-wrap">
                  <RiskBadge level="low" />
                  <RiskBadge level="medium" />
                  <RiskBadge level="high" />
                  <RiskBadge level="critical" />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Employee Identity & Avatars" subtitle="Initial avatars, photo placeholders, and composite metadata.">
            <div className="row-wrap">
              <EmployeeAvatar name="Alex Morgan" role="HR Administrator" status="online" size="md" />
              <EmployeeAvatar name="Sarah Jenkins" role="Staff Engineer" status="present" size="md" />
              <EmployeeAvatar name="Devon Miles" role="Product Lead" status="leave" size="md" />
              <EmployeeAvatar name="Carlos Ray" role="QA Analyst" status="absent" size="md" />
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: DASHBOARD COMPOSITES */}
      {activeTab === 'dashboard' && (
        <div className="stack-lg">
          {/* Stat Cards Grid */}
          <div className="grid-4">
            <StatCard
              label="Total Employees"
              value="248"
              delta="+12%"
              deltaDirection="up"
              deltaText="vs last month"
              icon={<Users size={18} />}
              iconVariant="primary"
            />
            <StatCard
              label="Present Today"
              value="231"
              delta="94%"
              deltaDirection="up"
              deltaText="attendance rate"
              icon={<CheckCircle2 size={18} />}
              iconVariant="success"
            />
            <StatCard
              label="On Leave"
              value="17"
              delta="-3%"
              deltaDirection="down"
              deltaText="vs yesterday"
              icon={<CalendarDays size={18} />}
              iconVariant="warning"
            />
            <StatCard
              label="Pending Approvals"
              value="12"
              delta="Action Req."
              deltaDirection="flat"
              icon={<Clock size={18} />}
              iconVariant="danger"
            />
          </div>

          {/* Chart & Activity Section */}
          <div className="grid-2-1">
            <AttendanceChart />
            <ActivityList items={sampleActivities} />
          </div>

          {/* Table */}
          <Card title="Interactive Data Table" subtitle="Responsive table with sorting, pagination, and skeleton loading.">
            <Table
              columns={sampleTableColumns}
              data={sampleTableData}
              loading={tableLoading}
              pagination
              pageSize={4}
            />
          </Card>
        </div>
      )}

      {/* TAB 4: INTELLIGENT FEATURES */}
      {activeTab === 'intelligent' && (
        <div className="stack-lg">
          {/* Workforce Pulse Section */}
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '16px' }}>
              1. Workforce Pulse UI System
            </h3>
            <div className="grid-4">
              <WorkforceMetricCard
                title="Attendance Rate"
                value="94.2%"
                target="95.0%"
                status="good"
                trend="+1.4%"
                trendDirection="up"
                statusLabel="OPTIMAL"
                description="231 of 248 staff checked in"
              />
              <WorkforceMetricCard
                title="Team Coverage"
                value="87.0%"
                target="85.0%"
                status="good"
                trend="+2.1%"
                trendDirection="up"
                statusLabel="HEALTHY"
                description="All core shifts staffed"
              />
              <WorkforceMetricCard
                title="Leave Load"
                value="6.8%"
                target="< 8.0%"
                status="warning"
                trend="+1.2%"
                trendDirection="up"
                statusLabel="MODERATE"
                description="17 employees on leave"
              />
              <WorkforceMetricCard
                title="Absence Risk"
                value="MEDIUM"
                status="warning"
                statusLabel="MONITOR"
                description="Engineering overlap detected"
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <Card title="Coverage Indicators by Department">
                <div className="stack">
                  <CoverageIndicator label="Engineering (Target: 80%)" percentage={88} threshold={80} />
                  <CoverageIndicator label="Product & Design (Target: 75%)" percentage={92} threshold={75} />
                  <CoverageIndicator label="Customer Support (Target: 85%)" percentage={68} threshold={85} />
                </div>
              </Card>
            </div>
          </div>

          {/* Smart Leave Impact Section */}
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '16px' }}>
              2. Smart Leave Impact Projection Cards
            </h3>
            <div className="grid-2">
              <ImpactCard
                employeeName="Vikram Singh"
                department="Backend Engineering"
                dates="Aug 24 – Aug 30 (5 working days)"
                currentCoverage={92}
                projectedCoverage={67}
                riskLevel="HIGH"
                overlappingLeaves={2}
                recommendation="Approving this leave will reduce backend on-call coverage below minimum SLA threshold (75%)."
                onApprove={() => alert('Approve triggered')}
                onReject={() => alert('Reject triggered')}
              />
              <ImpactCard
                employeeName="Aisha Khan"
                department="Product Management"
                dates="Sep 02 – Sep 03 (2 working days)"
                currentCoverage={95}
                projectedCoverage={88}
                riskLevel="LOW"
                overlappingLeaves={0}
                recommendation="Safe to approve. No conflicting team leaves found in this date window."
                onApprove={() => alert('Approve triggered')}
                onReject={() => alert('Reject triggered')}
              />
            </div>
          </div>

          {/* HR Copilot Section */}
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '16px' }}>
              3. HR Copilot Assistant UI
            </h3>
            <CopilotContainer
              messages={copilotMessages}
              inputValue={copilotInput}
              onInputChange={setCopilotInput}
              onSend={handleCopilotSend}
            />
          </div>
        </div>
      )}

      {/* Sample Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Employee Profile"
        subtitle="Add a team member to Dayflow database"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
              Save Employee
            </Button>
          </>
        }
      >
        <div className="stack">
          <Input label="Full Name" placeholder="e.g. Carlos Ray" required />
          <Input label="Email Address" placeholder="carlos@dayflow.io" required />
          <Select
            label="Department"
            options={['Engineering', 'Design', 'Product', 'Human Resources']}
          />
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          alert('Action confirmed');
        }}
        title="Delete Selected Records?"
        description="Are you sure you want to delete these records? This operation is permanent."
        confirmVariant="danger"
        confirmText="Yes, Delete"
      />
    </div>
  );
};

export default Styleguide;
