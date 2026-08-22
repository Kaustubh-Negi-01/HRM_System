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
  TrendingUp,
} from 'lucide-react';
import workforceService from '../../features/workforce/workforce.service';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pulseData, setPulseData] = useState(null);

  useEffect(() => {
    loadPulse();
  }, []);

  const loadPulse = async () => {
    try {
      const data = await workforceService.getWorkforcePulse();
      setPulseData(data);
    } catch (err) {
      // Handled by service
    }
  };

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
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)' }}
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
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              <h3 className="text-sm font-extrabold text-indigo uppercase tracking-wider">
                Smart Leave Impact™
              </h3>
            </div>
            <GitBranch size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <p className="text-2xl font-black text-primary" style={{ marginTop: '0.5rem' }}>
            3 Active Simulations
          </p>
          <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
            Simulate staffing deficit and milestone risks before approving leave.
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-indigo" style={{ marginTop: '0.75rem' }}>
            <span>Simulate Coverage</span>
            <ArrowRight size={12} />
          </div>
        </Card>

        {/* Differentiator 3 */}
        <Card
          className="interactive"
          onClick={() => navigate('/admin/copilot')}
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: '#C084FC' }} />
              <h3 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: '#C084FC' }}>
                AI HR Copilot
              </h3>
            </div>
            <Bot size={20} style={{ color: '#C084FC' }} />
          </div>
          <p className="text-2xl font-black text-primary" style={{ marginTop: '0.5rem' }}>
            Natural Language
          </p>
          <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
            Ask complex questions over real HRMS attendance, leave, & payroll data.
          </p>
          <div className="flex items-center gap-1 text-xs font-bold" style={{ marginTop: '0.75rem', color: '#C084FC' }}>
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
