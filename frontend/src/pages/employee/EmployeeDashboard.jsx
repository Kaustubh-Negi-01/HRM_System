import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import StatCard from '../../components/dashboard/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../hooks/useAuth';
import attendanceService from '../../features/attendance/attendance.service';
import leaveService from '../../features/leave/leave.service';
import { LEAVE_TYPES } from '../../utils/constants';
import {
  Clock,
  Calendar,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  ListTodo,
  Plus,
  Play,
  Square,
  Sparkles,
} from 'lucide-react';

const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Complete Q3 Cloud Security Compliance Audit',
    assignee: 'Alex Chen',
    department: 'Engineering',
    priority: 'High',
    completed: false,
    completedAt: null,
  },
  {
    id: 't2',
    title: 'Submit Expense Receipts for Hackathon Travel',
    assignee: 'Alex Chen',
    department: 'Engineering',
    priority: 'Medium',
    completed: true,
    completedAt: 'Today at 02:15 PM',
  },
  {
    id: 't3',
    title: 'Resolve Escalated SLA Customer Support Tickets',
    assignee: 'Priya Sharma',
    department: 'Customer Support',
    priority: 'High',
    completed: false,
    completedAt: null,
  },
  {
    id: 't4',
    title: 'Review and Finalize August 2026 Payroll Batch',
    assignee: 'Saksham Singh',
    department: 'Human Resources',
    priority: 'High',
    completed: true,
    completedAt: 'Today at 11:30 AM',
  },
  {
    id: 't5',
    title: 'Review Pull Request #418: Supabase Cloud Sync Engine',
    assignee: 'Alex Chen',
    department: 'Engineering',
    priority: 'Medium',
    completed: false,
    completedAt: null,
  },
];

function getStoredTasks() {
  try {
    const raw = localStorage.getItem('dayflow_live_tasks');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_TASKS;
}

function saveStoredTasks(tasks) {
  try {
    localStorage.setItem('dayflow_live_tasks', JSON.stringify(tasks));
    window.dispatchEvent(new Event('dayflow_task_updated'));
  } catch (e) {}
}

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Accurate Live Clock State
  const [currentLiveTime, setCurrentLiveTime] = useState(() => new Date());

  // Attendance Punch State
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    return localStorage.getItem('dayflow_clocked_in') === 'true';
  });
  const [checkInTime, setCheckInTime] = useState(() => {
    return localStorage.getItem('dayflow_clock_in_time') || '09:00 AM';
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(7200); // 2 hours initial
  const [punchMessage, setPunchMessage] = useState('');

  // Tasks State
  const [tasks, setTasks] = useState(getStoredTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [addTaskModal, setAddTaskModal] = useState(false);

  // Leave Modal State
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [submittingLeave, setSubmittingLeave] = useState(false);

  // Live real-time ticking clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentLiveTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Timer for active work shift
  useEffect(() => {
    let interval = null;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  // Listen for task changes
  useEffect(() => {
    const handleTaskSync = () => {
      setTasks(getStoredTasks());
    };
    window.addEventListener('dayflow_task_updated', handleTaskSync);
    return () => window.removeEventListener('dayflow_task_updated', handleTaskSync);
  }, []);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggleAttendance = async () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (isCheckedIn) {
      await attendanceService.checkOut();
      setIsCheckedIn(false);
      localStorage.setItem('dayflow_clocked_in', 'false');
      setPunchMessage(`Clocked out successfully at ${timeStr}`);
    } else {
      await attendanceService.checkIn();
      setIsCheckedIn(true);
      setCheckInTime(timeStr);
      setElapsedSeconds(0);
      localStorage.setItem('dayflow_clocked_in', 'true');
      localStorage.setItem('dayflow_clock_in_time', timeStr);
      setPunchMessage(`Clocked in successfully at ${timeStr}! Have a productive shift.`);
    }
    setTimeout(() => setPunchMessage(''), 4000);
  };

  const handleToggleTask = (taskId) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        return {
          ...t,
          completed: nextState,
          completedAt: nextState
            ? `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : null,
        };
      }
      return t;
    });
    setTasks(updated);
    saveStoredTasks(updated);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      assignee: user?.name || 'Alex Chen',
      department: user?.department || 'Engineering',
      priority: newTaskPriority,
      completed: false,
      completedAt: null,
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveStoredTasks(updated);
    setNewTaskTitle('');
    setAddTaskModal(false);
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

  const myTasks = tasks.filter(
    (t) =>
      !user?.name ||
      t.assignee.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]) ||
      t.assignee === 'Alex Chen'
  );

  return (
    <PageContainer
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'Alex'} 👋`}
      subtitle="Here is your personal workspace overview, daily punch clock, and live task manager."
      action={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => setAddTaskModal(true)}>
            New Task
          </Button>
          <Button variant="primary" size="sm" icon={PlusCircle} onClick={() => setLeaveModalOpen(true)}>
            Request Time Off
          </Button>
        </div>
      }
    >
      {punchMessage && (
        <div
          className="flex items-center gap-2 animate-fade-in"
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isCheckedIn ? 'var(--success-bg)' : 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${isCheckedIn ? 'var(--success)' : 'var(--primary)'}`,
            color: isCheckedIn ? 'var(--success)' : 'var(--primary)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{punchMessage}</span>
        </div>
      )}

      {/* Top Banner: Real-time Digital Punch Clock Widget */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          backgroundColor: '#0A0A0F',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isCheckedIn ? 'var(--success-bg)' : 'rgba(255, 255, 255, 0.05)',
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
                ? `Clocked in at ${checkInTime} • Shift timer active`
                : 'You are currently not checked in for today’s shift.'}
            </p>
          </div>
        </div>

        {/* Live Accurate Clock & Timer Center */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            padding: '0.625rem 1.5rem',
            backgroundColor: '#040407',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>
            <span className="text-xs font-bold text-muted uppercase" style={{ fontSize: '0.625rem' }}>
              Current Time
            </span>
            <div className="font-mono text-lg font-bold text-primary">
              {currentLiveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          <div>
            <span className="text-xs font-bold text-muted uppercase" style={{ fontSize: '0.625rem' }}>
              Active Session
            </span>
            <div className="font-mono text-lg font-bold" style={{ color: isCheckedIn ? 'var(--success)' : '#64748B' }}>
              {formatTimer(elapsedSeconds)}
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div>
          <Button
            variant={isCheckedIn ? 'danger' : 'primary'}
            size="md"
            icon={isCheckedIn ? Square : Play}
            onClick={handleToggleAttendance}
          >
            {isCheckedIn ? 'Clock Out Now' : 'Clock In for Shift'}
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Attendance Rate"
          value="96.2%"
          trend={{ value: 2.1, isPositive: true }}
          description="Past 30 days"
          icon={CalendarCheck}
          variant="success"
        />
        <StatCard
          title="Annual Leave Remaining"
          value="14 Days"
          description="Out of 20 days balance"
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Pending Approvals"
          value="1 Request"
          description="Annual leave in review"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Last Net Salary"
          value="₹1,29,300"
          description="Disbursed for July 2026"
          icon={CreditCard}
        />
      </div>

      {/* Main Content Layout: Tasks + Actions */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Tasks & Deliverables */}
        <div className="col-span-2 flex flex-col gap-6">
          <Card
            title="My Assigned Tasks & Deliverables"
            subtitle="Tick completed tasks to instantly sync progress with your manager and HR."
            action={
              <Button variant="ghost" size="sm" icon={Plus} onClick={() => setAddTaskModal(true)}>
                Add Task
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleTask(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: t.completed ? 'rgba(16, 185, 129, 0.06)' : '#0E0E14',
                    border: `1px solid ${t.completed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => {}} // Handled by div click
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--success)',
                        cursor: 'pointer',
                      }}
                    />
                    <div>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: t.completed ? '#94A3B8' : '#F8FAFC',
                          textDecoration: t.completed ? 'line-through' : 'none',
                        }}
                      >
                        {t.title}
                      </span>
                      <div className="flex items-center gap-2" style={{ marginTop: '0.25rem' }}>
                        <span className="text-xs text-muted">
                          {t.completed ? `Completed ${t.completedAt}` : `Assigned to ${t.assignee}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '999px',
                      backgroundColor:
                        t.priority === 'High'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(56, 189, 248, 0.15)',
                      color: t.priority === 'High' ? '#EF4444' : '#38BDF8',
                    }}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Quick Links */}
        <div className="flex flex-col gap-6">
          <Card title="Workspace Shortcuts">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate('/employee/payroll')}
                className="flex items-center justify-between text-xs font-semibold text-primary"
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#0E0E14',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
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
                type="button"
                onClick={() => navigate('/employee/attendance')}
                className="flex items-center justify-between text-xs font-semibold text-primary"
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#0E0E14',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
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
                type="button"
                onClick={() => navigate('/employee/profile')}
                className="flex items-center justify-between text-xs font-semibold text-primary"
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#0E0E14',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                  <span>Update Profile & Emergency Contacts</span>
                </div>
                <span className="text-muted">→</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={addTaskModal}
        onClose={() => setAddTaskModal(false)}
        title="Create New Sprint Task"
        subtitle="Add a deliverable to your personal and organizational tracker."
      >
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <Input
            label="Task Description"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g., Finalize Q3 API Documentation"
            required
            autoFocus
          />

          <Select
            label="Priority Level"
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            options={[
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' },
            ]}
          />

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setAddTaskModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title="Request Leave / Time Off"
        subtitle="Submit your time-off request for manager and HR approval."
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
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
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
