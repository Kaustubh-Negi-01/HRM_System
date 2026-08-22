import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import StatCard from '../../components/dashboard/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import attendanceService from '../../features/attendance/attendance.service';
import leaveService from '../../features/leave/leave.service';
import {
  CalendarDays,
  Clock,
  CheckCircle,
  CreditCard,
  PlusCircle,
  PlayCircle,
  StopCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { LEAVE_TYPES } from '../../utils/constants';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:00 AM');
  const [elapsedSeconds, setElapsedSeconds] = useState(7200); // 2 hours
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [submittingLeave, setSubmittingLeave] = useState(false);

  // Timer simulation for active work session
  useEffect(() => {
    let interval = null;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggleAttendance = async () => {
    if (isCheckedIn) {
      await attendanceService.checkOut();
      setIsCheckedIn(false);
    } else {
      const res = await attendanceService.checkIn();
      setIsCheckedIn(true);
      setCheckInTime(res.checkInTime || 'Now');
      setElapsedSeconds(0);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setSubmittingLeave(true);
    try {
      await leaveService.applyLeave(leaveForm);
      setLeaveModalOpen(false);
      setLeaveForm({ leaveType: 'annual', startDate: '', endDate: '', reason: '' });
    } finally {
      setSubmittingLeave(false);
    }
  };

  return (
    <PageContainer
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'Alex'} 👋`}
      subtitle="Here is your personal workspace overview, daily punch clock, and leave balance."
      action={
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => setLeaveModalOpen(true)}
        >
          Request Time Off
        </Button>
      }
    >
      {/* Top Banner: Real-time Punch Clock Widget */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem 2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isCheckedIn ? 'var(--success-bg)' : 'var(--bg-surface-elevated)',
              color: isCheckedIn ? 'var(--success)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${isCheckedIn ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
            }}
          >
            <Clock size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`pulse-indicator ${isCheckedIn ? 'success' : 'danger'}`} />
              <h3 className="text-base font-bold text-primary">
                {isCheckedIn ? 'Currently Clocked In' : 'Clocked Out'}
              </h3>
            </div>
            <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
              {isCheckedIn
                ? `Clocked in at ${checkInTime} • Active shift in progress`
                : 'You are currently off duty. Click button to clock in.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-muted">TODAY'S WORK TIME</span>
            <span className="text-2xl font-extrabold text-primary font-mono" style={{ color: 'var(--pulse-cyan)' }}>
              {formatTimer(elapsedSeconds)}
            </span>
          </div>

          <Button
            variant={isCheckedIn ? 'danger' : 'success'}
            size="md"
            icon={isCheckedIn ? StopCircle : PlayCircle}
            onClick={handleToggleAttendance}
          >
            {isCheckedIn ? 'Clock Out' : 'Clock In Now'}
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Leave Balance"
          value="14 Days"
          change="Annual Leave"
          changeType="positive"
          changeLabel="7 casual + 8 sick remaining"
          icon={CalendarDays}
          iconColor="var(--primary)"
          iconBg="var(--primary-bg)"
        />
        <StatCard
          title="Attendance Rate"
          value="96.5%"
          change="+1.2%"
          changeType="positive"
          changeLabel="This month (20/21 days)"
          icon={CheckCircle}
          iconColor="var(--success)"
          iconBg="var(--success-bg)"
        />
        <StatCard
          title="Hours Logged"
          value="38.5 hrs"
          change="On Track"
          changeType="neutral"
          changeLabel="Week of Aug 18 - 22"
          icon={Clock}
          iconColor="var(--pulse-cyan)"
          iconBg="var(--pulse-cyan-bg)"
        />
        <StatCard
          title="Next Payday"
          value="Aug 31"
          change="Processing"
          changeType="positive"
          changeLabel="Net Est. $7,150.00"
          icon={CreditCard}
          iconColor="var(--warning)"
          iconBg="var(--warning-bg)"
        />
      </div>

      {/* Bottom Section: Leave Status & Quick Links */}
      <div className="grid grid-cols-3 gap-6">
        <div className="grid-cols-2" style={{ gridColumn: 'span 2' }}>
          <Card
            title="Recent Leave Requests"
            subtitle="Track approval status for upcoming holidays and leaves"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/employee/leave')}>
                View All
              </Button>
            }
          >
            <div className="flex flex-col gap-3">
              <div
                className="flex items-center justify-between"
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">Annual Leave</span>
                    <span className="text-xs text-muted">• 4 Days (Sept 1 – Sept 4, 2026)</span>
                  </div>
                  <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
                    Reason: Family vacation & recharge
                  </p>
                </div>
                <StatusBadge status="pending" size="sm" />
              </div>

              <div
                className="flex items-center justify-between"
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">Sick Leave</span>
                    <span className="text-xs text-muted">• 2 Days (July 12 – July 13, 2026)</span>
                  </div>
                  <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
                    Reason: Viral fever & doctor rest
                  </p>
                </div>
                <StatusBadge status="approved" size="sm" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Tools Card */}
        <div>
          <Card title="Quick Shortcuts" subtitle="Fast access to your self-service tools">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/employee/payroll')}
                className="flex items-center justify-between text-xs font-semibold text-primary"
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} style={{ color: 'var(--primary)' }} />
                  <span>Download Latest Payslip (July)</span>
                </div>
                <span className="text-muted">→</span>
              </button>

              <button
                onClick={() => navigate('/employee/attendance')}
                className="flex items-center justify-between text-xs font-semibold text-primary"
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div className="flex items-center gap-3">
                  <Clock size={16} style={{ color: 'var(--pulse-cyan)' }} />
                  <span>Monthly Attendance Calendar</span>
                </div>
                <span className="text-muted">→</span>
              </button>

              <button
                onClick={() => navigate('/employee/profile')}
                className="flex items-center justify-between text-xs font-semibold text-primary"
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                  <span>Update Emergency Contacts</span>
                </div>
                <span className="text-muted">→</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title="Request Leave / Time Off"
        subtitle="Submit your time-off request for manager and HR approval"
      >
        <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
          <Select
            label="Leave Type"
            value={leaveForm.leaveType}
            onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
            options={LEAVE_TYPES}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={leaveForm.startDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={leaveForm.endDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
              required
            />
          </div>

          <Input
            label="Reason / Notes"
            value={leaveForm.reason}
            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
            placeholder="Brief description of your leave reason"
            required
          />

          <div
            className="flex items-start gap-2 text-xs text-muted"
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            <AlertCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>
              Smart Leave Impact will analyze team coverage to ensure fast approval without project bottlenecks.
            </span>
          </div>

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submittingLeave}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default EmployeeDashboard;
