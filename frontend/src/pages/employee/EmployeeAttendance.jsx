import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/shared/StatusBadge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import attendanceService from '../../features/attendance/attendance.service';
import { calculateAttendanceStats } from '../../features/attendance/attendance.utils';
import { formatDate } from '../../utils/formatters';
import {
  CalendarCheck,
  Clock,
  AlertTriangle,
  FileCheck,
  Filter,
  PlusCircle,
} from 'lucide-react';

export const EmployeeAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [regularizeModal, setRegularizeModal] = useState(false);
  const [regForm, setRegForm] = useState({ date: '', punchType: 'check_in', time: '', reason: '' });

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getMyAttendance({ month: selectedMonth });
      const safeData = Array.isArray(data) ? data : Array.isArray(data?.records) ? data.records : [];
      setRecords(safeData);
    } finally {
      setLoading(false);
    }
  };

  const stats = calculateAttendanceStats(Array.isArray(records) ? records : []);

  const columns = [
    {
      header: 'Date',
      key: 'date',
      render: (val) => (
        <span className="font-semibold text-primary">
          {formatDate(val, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Clock In',
      key: 'checkIn',
      render: (val) => <span className="font-mono text-xs text-secondary">{val || '—'}</span>,
    },
    {
      header: 'Clock Out',
      key: 'checkOut',
      render: (val) => <span className="font-mono text-xs text-secondary">{val || '—'}</span>,
    },
    {
      header: 'Hours Worked',
      key: 'hours',
      render: (val) => (
        <span className="font-semibold" style={{ color: val >= 8 ? 'var(--success)' : 'var(--text-primary)' }}>
          {val ? `${val} hrs` : '0 hrs'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
  ];

  const handleRegularizeSubmit = (e) => {
    e.preventDefault();
    setRegularizeModal(false);
    setRegForm({ date: '', punchType: 'check_in', time: '', reason: '' });
  };

  return (
    <PageContainer
      title="My Attendance & Timesheets"
      subtitle="View your daily clock-in records, working hours distribution, and regularizations."
      action={
        <Button
          variant="secondary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setRegularizeModal(true)}
        >
          Request Punch Correction
        </Button>
      }
    >
      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Presence Rate"
          value={`${stats.presentRate}%`}
          change="Standard: 90%+"
          changeType="positive"
          icon={CalendarCheck}
          iconColor="var(--success)"
          iconBg="var(--success-bg)"
        />
        <StatCard
          title="Total Hours Logged"
          value={`${stats.totalHours} hrs`}
          change={`Avg ${stats.averageDailyHours}h / day`}
          changeType="neutral"
          icon={Clock}
          iconColor="var(--primary)"
          iconBg="var(--primary-bg)"
        />
        <StatCard
          title="Late Arrivals"
          value={`${stats.lateCount}`}
          change={stats.lateCount > 1 ? 'Needs Attention' : 'Excellent'}
          changeType={stats.lateCount > 1 ? 'negative' : 'positive'}
          icon={AlertTriangle}
          iconColor="var(--warning)"
          iconBg="var(--warning-bg)"
        />
        <StatCard
          title="Absent / Unlogged"
          value={`${stats.absentCount}`}
          change="Zero unexcused"
          changeType="positive"
          icon={FileCheck}
          iconColor="var(--info)"
          iconBg="var(--info-bg)"
        />
      </div>

      {/* Logs Table Card */}
      <Card
        title="Attendance Records Log"
        subtitle="Full breakdown of clock in and clock out timestamps"
        action={
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
            </select>
          </div>
        }
      >
        <Table columns={columns} data={records} isLoading={loading} />
      </Card>

      {/* Regularize Modal */}
      <Modal
        isOpen={regularizeModal}
        onClose={() => setRegularizeModal(false)}
        title="Attendance Regularization Request"
        subtitle="Submit a correction if you forgot to clock in or had a technical issue"
      >
        <form onSubmit={handleRegularizeSubmit} className="flex flex-col gap-4">
          <Input
            label="Date of Missing Punch"
            type="date"
            value={regForm.date}
            onChange={(e) => setRegForm({ ...regForm, date: e.target.value })}
            required
          />

          <Select
            label="Correction Type"
            value={regForm.punchType}
            onChange={(e) => setRegForm({ ...regForm, punchType: e.target.value })}
            options={[
              { value: 'check_in', label: 'Missing Clock-In' },
              { value: 'check_out', label: 'Missing Clock-Out' },
              { value: 'both', label: 'Entire Day Time Adjustment' },
            ]}
          />

          <Input
            label="Corrected Time"
            type="time"
            value={regForm.time}
            onChange={(e) => setRegForm({ ...regForm, time: e.target.value })}
            required
          />

          <Input
            label="Reason"
            value={regForm.reason}
            onChange={(e) => setRegForm({ ...regForm, reason: e.target.value })}
            placeholder="e.g. Card reader was offline / Client offsite meeting"
            required
          />

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setRegularizeModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Regularization
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default EmployeeAttendance;
