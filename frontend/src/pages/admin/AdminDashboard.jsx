import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  CalendarDays,
  Clock,
  Download,
  Plus,
  Eye,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Card,
  Table,
} from '../../components/ui';
import {
  StatusBadge,
  RiskBadge,
  EmployeeAvatar,
} from '../../components/shared';
import {
  StatCard,
  AttendanceChart,
  ActivityList,
} from '../../components/dashboard';
import { PageHeader } from '../../components/layout/PageContainer';

const MOCK_STATS = {
  totalEmployees: { value: '248', delta: '+12%', direction: 'up', subtitle: 'vs last month' },
  presentToday: { value: '231', delta: '94%', direction: 'up', subtitle: 'attendance rate' },
  onLeave: { value: '17', delta: '-3%', direction: 'down', subtitle: 'vs yesterday' },
  pendingApprovals: { value: '12', delta: 'Requires Review', direction: 'flat', subtitle: '3 high risk' },
};

const MOCK_ACTIVITIES = [
  { id: 1, name: 'Priya Sharma', action: 'applied for sick leave', target: '(Aug 24-25)', timestamp: '10m ago', badge: 'PENDING', badgeVariant: 'warning' },
  { id: 2, name: 'Rahul Verma', action: 'clocked in at 09:02 AM', target: '', timestamp: '45m ago', badge: 'PRESENT', badgeVariant: 'success' },
  { id: 3, name: 'Finance System', action: 'processed July payroll batch', target: '(#PAY-2026-07)', timestamp: '2h ago', badge: 'PAID', badgeVariant: 'success' },
  { id: 4, name: 'Aisha Khan', action: 'joined as Senior PM in Product team', target: '', timestamp: '4h ago', badge: 'ACTIVE', badgeVariant: 'info' },
  { id: 5, name: 'Vikram Singh', action: 'leave request approved by HR', target: '', timestamp: '6h ago', badge: 'APPROVED', badgeVariant: 'success' },
];

const MOCK_LEAVE_REQUESTS = [
  {
    id: 'LR-101',
    name: 'Priya Sharma',
    email: 'priya.s@dayflow.io',
    dept: 'Engineering',
    role: 'Staff Engineer',
    type: 'Sick Leave',
    dates: 'Aug 24 – Aug 26',
    days: '3 days',
    status: 'Pending',
    risk: 'High',
  },
  {
    id: 'LR-102',
    name: 'Rahul Verma',
    email: 'rahul.v@dayflow.io',
    dept: 'Design',
    role: 'Product Designer',
    type: 'Casual Leave',
    dates: 'Aug 28 – Aug 29',
    days: '2 days',
    status: 'Pending',
    risk: 'Low',
  },
  {
    id: 'LR-103',
    name: 'Aisha Khan',
    email: 'aisha.k@dayflow.io',
    dept: 'Product',
    role: 'Product Manager',
    type: 'Earned Leave',
    dates: 'Sep 01 – Sep 05',
    days: '5 days',
    status: 'Pending',
    risk: 'Medium',
  },
  {
    id: 'LR-104',
    name: 'Vikram Singh',
    email: 'vikram.s@dayflow.io',
    dept: 'Engineering',
    role: 'Backend Lead',
    type: 'Vacation',
    dates: 'Sep 10 – Sep 15',
    days: '6 days',
    status: 'Approved',
    risk: 'Low',
  },
  {
    id: 'LR-105',
    name: 'Devon Miles',
    email: 'devon.m@dayflow.io',
    dept: 'Support',
    role: 'Support Lead',
    type: 'Emergency',
    dates: 'Aug 22 – Aug 23',
    days: '2 days',
    status: 'Rejected',
    risk: 'Critical',
  },
];

export const AdminDashboard = () => {
  const [demoLoading, setDemoLoading] = useState(false);

  const leaveTableColumns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (row) => (
        <EmployeeAvatar
          name={row.name}
          subtitle={row.dept}
          status={row.status === 'Approved' ? 'leave' : 'present'}
          size="sm"
        />
      ),
    },
    { key: 'type', header: 'Leave Type' },
    { key: 'dates', header: 'Date Range' },
    { key: 'days', header: 'Duration', align: 'center', numeric: true },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'risk',
      header: 'Staffing Risk',
      render: (row) => <RiskBadge level={row.risk} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={14} />}
            title="View Details"
            aria-label="View Details"
          />
          {row.status === 'Pending' && (
            <>
              <Button
                variant="success"
                size="sm"
                icon={<Check size={14} />}
                title="Approve"
                aria-label="Approve"
              />
              <Button
                variant="danger"
                size="sm"
                icon={<X size={14} />}
                title="Reject"
                aria-label="Reject"
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page stack-lg">
      <PageHeader
        title="Good morning, Admin 👋"
        subtitle="Here's a real-time overview of workforce attendance, staffing risks, and pending approvals."
        actions={
          <div className="row">
            <Button
              variant="secondary"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => setDemoLoading(!demoLoading)}
            >
              {demoLoading ? 'Show Normal' : 'Simulate Loading'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => alert('Exporting Report...')}
            >
              Export Report
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => alert('Add Employee modal triggered')}
            >
              Add Employee
            </Button>
          </div>
        }
      />

      {/* Row of 4 StatCards */}
      <div className="grid-4">
        <StatCard
          label="Total Employees"
          value={MOCK_STATS.totalEmployees.value}
          delta={MOCK_STATS.totalEmployees.delta}
          deltaDirection={MOCK_STATS.totalEmployees.direction}
          deltaText={MOCK_STATS.totalEmployees.subtitle}
          icon={<Users size={18} />}
          iconVariant="primary"
          loading={demoLoading}
        />
        <StatCard
          label="Present Today"
          value={MOCK_STATS.presentToday.value}
          delta={MOCK_STATS.presentToday.delta}
          deltaDirection={MOCK_STATS.presentToday.direction}
          deltaText={MOCK_STATS.presentToday.subtitle}
          icon={<CheckCircle2 size={18} />}
          iconVariant="success"
          loading={demoLoading}
        />
        <StatCard
          label="On Leave"
          value={MOCK_STATS.onLeave.value}
          delta={MOCK_STATS.onLeave.delta}
          deltaDirection={MOCK_STATS.onLeave.direction}
          deltaText={MOCK_STATS.onLeave.subtitle}
          icon={<CalendarDays size={18} />}
          iconVariant="warning"
          loading={demoLoading}
        />
        <StatCard
          label="Pending Approvals"
          value={MOCK_STATS.pendingApprovals.value}
          delta={MOCK_STATS.pendingApprovals.delta}
          deltaDirection={MOCK_STATS.pendingApprovals.direction}
          deltaText={MOCK_STATS.pendingApprovals.subtitle}
          icon={<Clock size={18} />}
          iconVariant="danger"
          loading={demoLoading}
        />
      </div>

      {/* 2-Column Grid: Attendance Overview & Recent Activity */}
      <div className="grid-2-1">
        <AttendanceChart loading={demoLoading} />
        <ActivityList
          items={MOCK_ACTIVITIES}
          title="Recent Activity"
          subtitle="Realtime updates across company"
        />
      </div>

      {/* Pending Leave Requests Table */}
      <Card
        title="Pending Leave Requests & Impact Risk"
        subtitle="Review staff leave requests with projected workforce impact calculations"
        actions={
          <Button variant="ghost" size="sm">
            View All Requests
          </Button>
        }
      >
        <Table
          columns={leaveTableColumns}
          data={MOCK_LEAVE_REQUESTS}
          loading={demoLoading}
          pagination
          pageSize={5}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
