import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/shared/StatusBadge';
import EmployeeAvatar from '../../components/shared/EmployeeAvatar';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import attendanceService from '../../features/attendance/attendance.service';
import { DEPARTMENTS } from '../../utils/constants';
import {
  CalendarCheck,
  Clock,
  UserCheck,
  UserX,
  PlusCircle,
  Download,
  Filter,
} from 'lucide-react';

export const AdminAttendance = () => {
  const [date, setDate] = useState('2026-08-22');
  const [selectedDept, setSelectedDept] = useState('all');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markModalOpen, setMarkModalOpen] = useState(false);
  const [markForm, setMarkForm] = useState({
    employeeName: 'Alex Mercer',
    status: 'present',
    checkIn: '09:00 AM',
    checkOut: '05:30 PM',
  });

  useEffect(() => {
    loadAttendance();
  }, [date, selectedDept]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getOrganizationAttendance({ date, department: selectedDept });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.records)
        ? data.records
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setLogs(list);
    } catch (err) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];

  const filteredLogs = safeLogs.filter((item) => {
    if (!item) return false;
    if (selectedDept === 'all') return true;
    return item.department === selectedDept;
  });

  const columns = [
    {
      header: 'Employee',
      key: 'employeeName',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={row.employeeName} size="sm" />
          <div>
            <p className="text-xs font-bold text-primary">{row.employeeName}</p>
            <p className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>{row.department}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Clock In',
      key: 'checkIn',
      render: (val) => <span className="text-xs font-mono text-secondary">{val || '—'}</span>,
    },
    {
      header: 'Clock Out',
      key: 'checkOut',
      render: (val) => <span className="text-xs font-mono text-secondary">{val || '—'}</span>,
    },
    {
      header: 'Duration',
      key: 'hours',
      render: (val) => <span className="text-xs font-semibold text-primary">{val ? `${val} hrs` : '—'}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
  ];

  const handleManualMark = (e) => {
    e.preventDefault();
    const created = {
      id: `log_${Date.now()}`,
      employeeName: markForm.employeeName,
      department: 'Engineering',
      date,
      checkIn: markForm.checkIn,
      checkOut: markForm.checkOut,
      hours: 8.5,
      status: markForm.status,
    };
    setLogs([created, ...logs]);
    setMarkModalOpen(false);
  };

  return (
    <PageContainer
      title="Organization Attendance Management"
      subtitle="Real-time daily presence tracking, shift logs, and manual attendance overrides."
      action={
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => alert('Exporting attendance report to CSV...')}
          >
            Export Logs
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setMarkModalOpen(true)}
          >
            Manual Override
          </Button>
        </div>
      }
    >
      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Presence Rate Today"
          value="92.3%"
          change="48 / 52 Employees"
          changeType="positive"
          icon={UserCheck}
          iconColor="var(--success)"
          iconBg="var(--success-bg)"
        />
        <StatCard
          title="On-Time Rate"
          value="88.5%"
          change="43 On-Time / 5 Late"
          changeType="neutral"
          icon={Clock}
          iconColor="var(--primary)"
          iconBg="var(--primary-bg)"
        />
        <StatCard
          title="On Approved Leave"
          value="3 Staff"
          change="Planned Coverage"
          changeType="positive"
          icon={CalendarCheck}
          iconColor="var(--pulse-cyan)"
          iconBg="var(--pulse-cyan-bg)"
        />
        <StatCard
          title="Unplanned Absences"
          value="1 Staff"
          change="Elena Rostova (Design)"
          changeType="negative"
          icon={UserX}
          iconColor="var(--danger)"
          iconBg="var(--danger-bg)"
        />
      </div>

      {/* Filter and Date Bar */}
      <Card style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted">Log Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted flex items-center gap-1">
              <Filter size={14} /> Department:
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card>
        <Table columns={columns} data={filteredLogs} isLoading={loading} />
      </Card>

      {/* Manual Override Modal */}
      <Modal
        isOpen={markModalOpen}
        onClose={() => setMarkModalOpen(false)}
        title="Manual Attendance Override"
        subtitle="Manually record or update an employee clock-in status"
      >
        <form onSubmit={handleManualMark} className="flex flex-col gap-4">
          <Input
            label="Employee Name"
            value={markForm.employeeName}
            onChange={(e) => setMarkForm({ ...markForm, employeeName: e.target.value })}
            required
          />

          <Select
            label="Attendance Status"
            value={markForm.status}
            onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
            options={[
              { value: 'present', label: 'Present' },
              { value: 'late', label: 'Late Arrival' },
              { value: 'half_day', label: 'Half Day' },
              { value: 'absent', label: 'Absent' },
              { value: 'on_leave', label: 'On Approved Leave' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Clock-In Time"
              value={markForm.checkIn}
              onChange={(e) => setMarkForm({ ...markForm, checkIn: e.target.value })}
            />
            <Input
              label="Clock-Out Time"
              value={markForm.checkOut}
              onChange={(e) => setMarkForm({ ...markForm, checkOut: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setMarkModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Record
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default AdminAttendance;
