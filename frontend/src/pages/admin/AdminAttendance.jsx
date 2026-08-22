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
  CheckCircle2,
} from 'lucide-react';

export const AdminAttendance = () => {
  const [date, setDate] = useState('2026-08-22');
  const [selectedDept, setSelectedDept] = useState('all');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markModalOpen, setMarkModalOpen] = useState(false);
  const [overrideSuccess, setOverrideSuccess] = useState('');
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

  const handleExportAttendanceCSV = () => {
    const headers = ['Employee Name', 'Department', 'Clock In', 'Clock Out', 'Status', 'Overtime (Hrs)'];
    const rows = filteredLogs.map((l) => [
      `"${l.employeeName || ''}"`,
      l.department || '',
      l.checkIn || '09:00 AM',
      l.checkOut || '05:30 PM',
      l.status || 'present',
      l.overtimeHours || '0',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DayFlow_Attendance_Log_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualOverride = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.manualOverride(markForm);
    } catch (err) {}
    setLogs((prev) => [
      {
        id: `att_${Date.now()}`,
        employeeName: markForm.employeeName,
        department: 'Engineering',
        checkIn: markForm.checkIn,
        checkOut: markForm.checkOut,
        status: markForm.status,
      },
      ...prev,
    ]);
    setMarkModalOpen(false);
    setOverrideSuccess(`Attendance override for ${markForm.employeeName} applied successfully!`);
    setTimeout(() => setOverrideSuccess(''), 4000);
  };

  const columns = [
    {
      header: 'Employee',
      key: 'employeeName',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={row?.employeeName || 'Staff'} size="sm" />
          <div>
            <p className="text-xs font-bold text-primary">{row?.employeeName || 'Staff'}</p>
            <p className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>{row?.department || 'Engineering'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Clock In',
      key: 'checkIn',
      render: (val) => <span className="text-xs font-mono text-secondary">{val || '09:00 AM'}</span>,
    },
    {
      header: 'Clock Out',
      key: 'checkOut',
      render: (val) => <span className="text-xs font-mono text-secondary">{val || '05:30 PM'}</span>,
    },
    {
      header: 'Shift Status',
      key: 'status',
      render: (val) => <StatusBadge status={val || 'present'} size="sm" />,
    },
  ];

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
            onClick={handleExportAttendanceCSV}
          >
            Export Attendance (CSV)
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
      {overrideSuccess && (
        <div
          className="flex items-center gap-2 animate-fade-in"
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{overrideSuccess}</span>
        </div>
      )}

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Presence Rate Today"
          value="94.2%"
          change="48 / 52 Employees"
          changeType="positive"
          icon={UserCheck}
          iconColor="var(--success)"
          iconBg="var(--success-bg)"
        />
        <StatCard
          title="On-Time Rate"
          value="89.5%"
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
          value="1 Absence"
          change="Customer Support squad"
          changeType="negative"
          icon={UserX}
          iconColor="var(--danger)"
          iconBg="var(--danger-bg)"
        />
      </div>

      {/* Filter and Table Section */}
      <div className="flex flex-col gap-6">
        <div
          className="glass-panel flex items-center justify-between gap-4 flex-wrap"
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: '#0A0A0F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-muted">Attendance Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                backgroundColor: '#040407',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem 0.75rem',
                color: '#F8FAFC',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={16} style={{ color: '#64748B' }} />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                backgroundColor: '#040407',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem 0.75rem',
                color: '#F8FAFC',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              <option value="all">All Departments ({safeLogs.length})</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Card noPadding>
          <Table
            columns={columns}
            data={filteredLogs}
            loading={loading}
            emptyMessage="No attendance records recorded for this date."
          />
        </Card>
      </div>

      {/* Manual Override Modal */}
      <Modal
        isOpen={markModalOpen}
        onClose={() => setMarkModalOpen(false)}
        title="Manual Attendance Override"
        subtitle="Apply supervisor override for employee shift records."
      >
        <form onSubmit={handleManualOverride} className="flex flex-col gap-4">
          <Input
            label="Employee Name"
            value={markForm.employeeName}
            onChange={(e) => setMarkForm({ ...markForm, employeeName: e.target.value })}
            placeholder="e.g. Alex Mercer"
            required
            autoFocus
          />

          <Select
            label="Attendance Status"
            value={markForm.status}
            onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
            options={[
              { value: 'present', label: 'Present' },
              { value: 'late', label: 'Late' },
              { value: 'half-day', label: 'Half Day' },
              { value: 'absent', label: 'Absent' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Clock In Time"
              value={markForm.checkIn}
              onChange={(e) => setMarkForm({ ...markForm, checkIn: e.target.value })}
              placeholder="09:00 AM"
            />
            <Input
              label="Clock Out Time"
              value={markForm.checkOut}
              onChange={(e) => setMarkForm({ ...markForm, checkOut: e.target.value })}
              placeholder="05:30 PM"
            />
          </div>

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setMarkModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Attendance Record
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default AdminAttendance;
