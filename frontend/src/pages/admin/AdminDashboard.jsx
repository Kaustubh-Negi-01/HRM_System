import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import StatCard from '../../components/dashboard/StatCard';
import AlertCard from '../../components/dashboard/AlertCard';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import ActivityList from '../../components/dashboard/ActivityList';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
  Users,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Activity,
  GitBranch,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListTodo,
  ShieldCheck,
} from 'lucide-react';
import workforceService from '../../features/workforce/workforce.service';

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

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pulseData, setPulseData] = useState(null);
  const [liveTasks, setLiveTasks] = useState(getStoredTasks);

  useEffect(() => {
    loadPulse();

    const handleTaskSync = () => {
      setLiveTasks(getStoredTasks());
    };
    window.addEventListener('dayflow_task_updated', handleTaskSync);
    return () => window.removeEventListener('dayflow_task_updated', handleTaskSync);
  }, []);

  const loadPulse = async () => {
    try {
      const data = await workforceService.getWorkforcePulse();
      setPulseData(data);
    } catch (err) {}
  };

  const completedCount = liveTasks.filter((t) => t.completed).length;
  const completionPercentage = Math.round((completedCount / (liveTasks.length || 1)) * 100);

  return (
    <PageContainer
      title="Executive Workforce Command"
      subtitle="Live enterprise operational status, workforce health intelligence, and AI management."
      action={
        <Button
          variant="primary"
          icon={Bot}
          onClick={() => navigate('/admin/copilot')}
        >
          Ask HR Copilot
        </Button>
      }
    >
      {/* 3 Key Differentiators Feature Hero Banner */}
      <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '2rem' }}>
        {/* Differentiator 1 */}
        <Card
          variant="pulse"
          className="interactive"
          onClick={() => navigate('/admin/workforce-pulse')}
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(10, 10, 15, 0.95) 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="pulse-indicator" />
              <h3 className="text-sm font-extrabold text-cyan uppercase tracking-wider">
                Workforce Pulse™
              </h3>
            </div>
            <Activity size={20} style={{ color: 'var(--pulse-cyan)' }} />
          </div>
          <p className="text-2xl font-black text-primary" style={{ marginTop: '0.5rem' }}>
            {pulseData?.healthIndex || 88}<span className="text-sm font-normal text-muted">/100 Health Index</span>
          </p>
          <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
            Live burnout & retention risk radar across 5 departments.
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-cyan" style={{ marginTop: '0.75rem' }}>
            <span>Explore Pulse Feed</span>
            <ArrowRight size={12} />
          </div>
        </Card>

        {/* Differentiator 2 */}
        <Card
          className="interactive"
          onClick={() => navigate('/admin/leave-impact')}
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(10, 10, 15, 0.95) 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                Smart Leave Impact™
              </h3>
            </div>
            <GitBranch size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <p className="text-2xl font-black text-primary" style={{ marginTop: '0.5rem' }}>
            3 Active Simulations
          </p>
          <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
            Predictive coverage analysis before approving time-off.
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-primary" style={{ marginTop: '0.75rem' }}>
            <span>Simulate Approvals</span>
            <ArrowRight size={12} />
          </div>
        </Card>

        {/* Differentiator 3 */}
        <Card
          className="interactive"
          onClick={() => navigate('/admin/copilot')}
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(10, 10, 15, 0.95) 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: '#10B981' }} />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald">
                AI HR Copilot
              </h3>
            </div>
            <Bot size={20} style={{ color: '#10B981' }} />
          </div>
          <p className="text-2xl font-black text-primary" style={{ marginTop: '0.5rem' }}>
            Natural Language
          </p>
          <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
            Ask complex questions over real HRMS attendance, leave, & payroll data.
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald" style={{ marginTop: '0.75rem' }}>
            <span>Start Conversation</span>
            <ArrowRight size={12} />
          </div>
        </Card>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Total Workforce"
          value="52 Active"
          change="+4 this quarter"
          changeType="positive"
          icon={Users}
          iconColor="var(--primary)"
          iconBg="var(--primary-bg)"
        />
        <StatCard
          title="Today's Attendance"
          value="94.2%"
          change="48 Present / 3 Leave"
          changeType="positive"
          icon={CalendarCheck}
          iconColor="var(--success)"
          iconBg="var(--success-bg)"
        />
        <StatCard
          title="Pending Approvals"
          value="3 Requests"
          change="2 Critical Overlaps"
          changeType="negative"
          icon={CalendarDays}
          iconColor="var(--warning)"
          iconBg="var(--warning-bg)"
        />
        <StatCard
          title="August Payroll Run"
          value="$382,400"
          change="Disbursing Aug 31"
          changeType="neutral"
          icon={CreditCard}
          iconColor="var(--pulse-cyan)"
          iconBg="var(--pulse-cyan-bg)"
        />
      </div>

      {/* Intelligence Alert Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <AlertCard
          type="pulse"
          title="AI Workforce Alert: Concurrent Leave Conflict Detected"
          message="Engineering squad has 2 overlapping leave applications (Alex Mercer & David Miller) between Sept 1 – Sept 4. Projected team coverage will drop to 58%, threatening the v2.5 Infrastructure Migration milestone."
          actionText="Run Smart Leave Simulation & Mitigate"
          actionLink="/admin/leave-impact"
        />
      </div>

      {/* Live Employee Task Completion Feed & Audit */}
      <div style={{ marginBottom: '2rem' }}>
        <Card
          title="Live Workforce Sprint & Task Deliverables Tracker"
          subtitle="Real-time employee execution feed showing who completed what task across all departments."
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="flex items-center justify-between text-xs font-semibold" style={{ marginBottom: '0.375rem' }}>
              <span className="text-secondary">Overall Sprint Completion Rate</span>
              <span className="text-primary font-mono">{completionPercentage}% ({completedCount} of {liveTasks.length} Completed)</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  backgroundColor: 'var(--success)',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'left' }}>
                  <th style={{ padding: '0.625rem 0.875rem', color: '#94A3B8' }}>Employee</th>
                  <th style={{ padding: '0.625rem 0.875rem', color: '#94A3B8' }}>Department</th>
                  <th style={{ padding: '0.625rem 0.875rem', color: '#94A3B8' }}>Task Description</th>
                  <th style={{ padding: '0.625rem 0.875rem', color: '#94A3B8' }}>Priority</th>
                  <th style={{ padding: '0.625rem 0.875rem', color: '#94A3B8' }}>Live Status</th>
                </tr>
              </thead>
              <tbody>
                {liveTasks.map((t) => (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      backgroundColor: t.completed ? 'rgba(16, 185, 129, 0.03)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.75rem 0.875rem', fontWeight: 600, color: '#F8FAFC' }}>
                      {t.assignee}
                    </td>
                    <td style={{ padding: '0.75rem 0.875rem', color: '#94A3B8' }}>
                      {t.department}
                    </td>
                    <td style={{ padding: '0.75rem 0.875rem', color: '#F8FAFC' }}>
                      <span style={{ textDecoration: t.completed ? 'line-through' : 'none', opacity: t.completed ? 0.7 : 1 }}>
                        {t.title}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.875rem' }}>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
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
                    </td>
                    <td style={{ padding: '0.75rem 0.875rem' }}>
                      {t.completed ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald">
                          <CheckCircle2 size={14} /> Done ({t.completedAt || 'Today'})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-muted">
                          <Clock size={14} /> In Progress
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Charts & Activity Stream */}
      <div className="grid grid-cols-3 gap-6">
        <div style={{ gridColumn: 'span 2' }}>
          <AttendanceChart />
        </div>
        <div>
          <ActivityList />
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
