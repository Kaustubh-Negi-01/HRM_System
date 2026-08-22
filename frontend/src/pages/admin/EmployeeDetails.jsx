import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Table from '../../components/ui/Table';
import EmployeeAvatar from '../../components/shared/EmployeeAvatar';
import StatusBadge from '../../components/shared/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/formatters';
import employeeService from '../../features/employee/employee.service';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Building,
  CreditCard,
  CalendarDays,
  Clock,
  Activity,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [employee, setEmployee] = useState({
    id: id || 'emp_01',
    name: 'Alex Chen',
    email: 'alex.chen@dayflow.internal',
    role: 'Lead Fullstack Engineer',
    department: 'Engineering',
    joinDate: '2023-03-01',
    status: 'active',
    salary: 8500,
    manager: 'Hamza Khan',
    healthScore: 88,
    burnoutRisk: 'Low',
    overtimeHours: 4.5,
    leaveBalance: {
      annual: 14,
      sick: 8,
      casual: 7,
    },
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await employeeService.getEmployeeById(id);
        if (data) {
          setEmployee((prev) => ({
            ...prev,
            ...data,
            name: data.name || prev.name,
            email: data.email || prev.email,
            role: data.designation || data.role || prev.role,
            department: data.department || prev.department,
            joinDate: data.joiningDate || data.joinDate || prev.joinDate,
            salary: data.payroll?.basicSalary || data.salary?.baseSalary || prev.salary,
          }));
        }
      } catch (err) {
        console.warn('Failed to load employee detail', err);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const attendanceHistory = [
    { date: '2026-08-22', checkIn: '08:58 AM', checkOut: '—', hours: 2.5, status: 'present' },
    { date: '2026-08-21', checkIn: '09:02 AM', checkOut: '05:30 PM', hours: 8.5, status: 'present' },
    { date: '2026-08-20', checkIn: '09:25 AM', checkOut: '05:40 PM', hours: 8.2, status: 'late' },
    { date: '2026-08-19', checkIn: '09:00 AM', checkOut: '05:00 PM', hours: 8.0, status: 'present' },
  ];

  const leaveHistory = [
    { leaveType: 'annual', startDate: '2026-09-01', endDate: '2026-09-04', days: 4, reason: 'Family vacation & recharge', status: 'pending' },
    { leaveType: 'sick', startDate: '2026-07-12', endDate: '2026-07-13', days: 2, reason: 'Viral fever', status: 'approved' },
  ];

  const tabs = [
    { id: 'overview', label: 'Profile Overview' },
    { id: 'attendance', label: 'Attendance & Hours' },
    { id: 'leaves', label: 'Leave History' },
    { id: 'payroll', label: 'Salary & Compensation' },
  ];

  return (
    <PageContainer
      title={employee.name}
      subtitle={`Employee Profile & Records • ID: ${employee.id}`}
      action={
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/admin/employees')}
          >
            Back to Directory
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={GitBranch}
            onClick={() => navigate(`/admin/leave-impact`)}
          >
            Simulate Leave Impact
          </Button>
        </div>
      }
    >
      {/* Header Profile Card */}
      <Card variant="elevated" style={{ marginBottom: '1.5rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-5">
            <EmployeeAvatar name={employee.name} size="xl" />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-primary">{employee.name}</h2>
                <StatusBadge status={employee.status} size="sm" />
              </div>
              <p className="text-sm font-medium text-secondary" style={{ marginTop: '0.25rem' }}>
                {employee.role} • <span className="text-indigo font-semibold">{employee.department}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-muted" style={{ marginTop: '0.5rem' }}>
                <span className="flex items-center gap-1"><Mail size={14} /> {employee.email}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {formatDate(employee.joinDate)}</span>
              </div>
            </div>
          </div>

          {/* Pulse Health Radar Metric */}
          <div
            style={{
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div style={{ color: 'var(--danger)' }}><AlertTriangle size={24} /></div>
            <div>
              <p className="text-xs font-bold text-muted uppercase">Burnout Risk Index</p>
              <p className="text-lg font-black text-rose">
                {employee.burnoutRisk} ({employee.healthScore}/100)
              </p>
              <span className="text-xs text-secondary">{employee.overtimeHours}h overtime logged this month</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          <Card title="Employment Particulars">
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-muted">Reports To</span>
                <span className="text-primary font-semibold">{employee.manager}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-muted">Work Authorization</span>
                <span className="text-primary font-semibold">Verified Citizen / Full-Time</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-muted">Monthly Base Compensation</span>
                <span className="text-emerald font-mono font-bold">{formatCurrency(employee.salary)} / mo</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted">Primary Work Location</span>
                <span className="text-primary font-semibold">San Francisco Engineering HQ</span>
              </div>
            </div>
          </Card>

          <Card title="Current Leave Allotment">
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold" style={{ marginBottom: '0.25rem' }}>
                  <span>Annual Paid Leave</span>
                  <span className="text-indigo">{employee.leaveBalance.annual} days remaining</span>
                </div>
                <div style={{ height: 6, backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 999 }}>
                  <div style={{ width: '70%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: 999 }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold" style={{ marginBottom: '0.25rem' }}>
                  <span>Sick / Medical Leave</span>
                  <span className="text-rose">{employee.leaveBalance.sick} days remaining</span>
                </div>
                <div style={{ height: 6, backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 999 }}>
                  <div style={{ width: '80%', height: '100%', backgroundColor: 'var(--danger)', borderRadius: 999 }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold" style={{ marginBottom: '0.25rem' }}>
                  <span>Casual Leave</span>
                  <span className="text-cyan">{employee.leaveBalance.casual} days remaining</span>
                </div>
                <div style={{ height: 6, backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 999 }}>
                  <div style={{ width: '87%', height: '100%', backgroundColor: 'var(--pulse-cyan)', borderRadius: 999 }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'attendance' && (
        <Card title="Recent Punch In & Timesheet Records">
          <Table
            columns={[
              { header: 'Date', key: 'date', render: (val) => formatDate(val) },
              { header: 'Clock In', key: 'checkIn' },
              { header: 'Clock Out', key: 'checkOut' },
              { header: 'Hours', key: 'hours', render: (val) => `${val} hrs` },
              { header: 'Status', key: 'status', render: (val) => <StatusBadge status={val} size="sm" /> },
            ]}
            data={attendanceHistory}
          />
        </Card>
      )}

      {activeTab === 'leaves' && (
        <Card title="Submitted Leave Applications">
          <Table
            columns={[
              { header: 'Type', key: 'leaveType', render: (val) => <span className="font-bold uppercase text-xs">{val}</span> },
              { header: 'Period', key: 'startDate', render: (_, r) => `${formatDate(r.startDate)} → ${formatDate(r.endDate)} (${r.days}d)` },
              { header: 'Reason', key: 'reason' },
              { header: 'Status', key: 'status', render: (val) => <StatusBadge status={val} size="sm" /> },
            ]}
            data={leaveHistory}
          />
        </Card>
      )}

      {activeTab === 'payroll' && (
        <Card title="Payroll Structure & Payouts">
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-muted">Monthly Base</span>
              <span className="text-primary font-mono">{formatCurrency(employee.salary)}</span>
            </div>
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-muted">Standard Monthly Allowances</span>
              <span className="text-primary font-mono">{formatCurrency(1200)}</span>
            </div>
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-muted">Tax Withholding Estimate (25%)</span>
              <span className="text-rose font-mono">-{formatCurrency(2425)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-sm">
              <span className="text-primary">Net Monthly Disbursed</span>
              <span className="text-emerald font-mono">{formatCurrency(7275)}</span>
            </div>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default EmployeeDetails;
