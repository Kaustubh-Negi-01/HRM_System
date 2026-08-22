import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import StatCard from '../../components/dashboard/StatCard';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/shared/StatusBadge';
import EmployeeAvatar from '../../components/shared/EmployeeAvatar';
import workforceService from '../../features/workforce/workforce.service';
import {
  Activity,
  Flame,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Zap,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const WorkforcePulse = () => {
  const [pulse, setPulse] = useState(null);
  const [burnoutList, setBurnoutList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPulseData();
  }, []);

  const loadPulseData = async () => {
    setLoading(true);
    try {
      const [pulseData, burnoutData] = await Promise.all([
        workforceService.getWorkforcePulse(),
        workforceService.getBurnoutRisks(),
      ]);
      setPulse(pulseData);
      setBurnoutList(burnoutData);
    } finally {
      setLoading(false);
    }
  };

  const burnoutColumns = [
    {
      header: 'Employee & Role',
      key: 'employeeName',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={row.employeeName} size="md" />
          <div>
            <p className="text-xs font-bold text-primary">{row.employeeName}</p>
            <p className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>{row.role} • {row.department}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Burnout Risk',
      key: 'riskScore',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '42px',
              height: '6px',
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${val}%`,
                height: '100%',
                backgroundColor: val > 80 ? 'var(--danger)' : 'var(--warning)',
              }}
            />
          </div>
          <span className="text-xs font-bold font-mono" style={{ color: val > 80 ? 'var(--danger)' : 'var(--warning)' }}>
            {val}%
          </span>
        </div>
      ),
    },
    {
      header: 'Overtime (30d)',
      key: 'overtimeHours',
      render: (val) => (
        <span className="text-xs font-mono font-bold text-rose">
          {val} hrs
        </span>
      ),
    },
    {
      header: 'Streak Without Rest',
      key: 'consecutiveDaysWithoutBreak',
      render: (val) => (
        <span className="text-xs text-primary font-semibold">
          {val} consecutive days
        </span>
      ),
    },
    {
      header: 'AI Diagnostics',
      key: 'flaggedReason',
      render: (val) => (
        <span className="text-xs text-secondary" style={{ maxWidth: '280px', display: 'inline-block' }}>
          {val}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Workforce Pulse™ Analytics"
      subtitle="Continuous real-time organizational health monitoring, burnout radar, and retention intelligence."
      action={
        <div className="flex items-center gap-2">
          <span className="pulse-indicator" />
          <span className="text-xs font-bold text-cyan font-mono">LIVE ENGINE RUNNING</span>
        </div>
      }
    >
      {/* Top Banner: Organizational Health Gauge */}
      <div
        className="glass-panel animate-fade-in"
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(99, 102, 241, 0.12) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: 'var(--shadow-glow-cyan)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div style={{ maxWidth: '540px' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
              <Zap size={18} style={{ color: 'var(--pulse-cyan)' }} />
              <span className="text-xs font-bold text-cyan uppercase tracking-widest">
                Overall Workforce Vitality
              </span>
            </div>
            <h2 className="text-2xl font-black text-primary" style={{ letterSpacing: '-0.02em' }}>
              Organizational Health is at <span className="text-cyan">88% (Optimal)</span>
            </h2>
            <p className="text-sm text-secondary" style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
              Telemetry aggregated from 52 employee timesheets, sprint velocities, and leave patterns.
              Engineering requires intervention due to post-launch overtime strain.
            </p>
          </div>

          {/* Large Vitality Index Score Ring */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.8) 70%)',
              border: '3px solid var(--pulse-cyan)',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.35)',
              flexShrink: 0,
            }}
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-primary font-mono">
                {pulse?.healthIndex || 88}
              </span>
              <span className="text-xs font-bold text-cyan uppercase" style={{ fontSize: '0.625rem' }}>
                Pulse Score
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Vitality Breakdown Cards */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 className="text-base font-bold text-primary" style={{ marginBottom: '1rem' }}>
          Department Vitality & Strain Breakdown
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(pulse?.departmentHealth || [
            { name: 'Engineering', headcount: 22, healthScore: 82, burnoutRisk: 'High', avgOvertime: 5.8, status: 'warning' },
            { name: 'Product & Design', headcount: 8, healthScore: 94, burnoutRisk: 'Low', avgOvertime: 1.2, status: 'optimal' },
            { name: 'Human Resources', headcount: 5, healthScore: 96, burnoutRisk: 'Low', avgOvertime: 0.8, status: 'optimal' },
            { name: 'Sales & Growth', headcount: 11, healthScore: 86, burnoutRisk: 'Moderate', avgOvertime: 4.1, status: 'optimal' },
            { name: 'Customer Support', headcount: 6, healthScore: 78, burnoutRisk: 'High', avgOvertime: 6.2, status: 'danger' },
          ]).map((dept, idx) => (
            <Card key={idx} variant={dept.status === 'danger' ? 'bordered' : 'default'}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-primary">{dept.name}</h4>
                <StatusBadge status={dept.status === 'optimal' ? 'healthy' : dept.status} size="sm" />
              </div>
              <div className="flex items-baseline gap-2" style={{ marginTop: '0.75rem' }}>
                <span className="text-2xl font-black text-primary">{dept.healthScore}</span>
                <span className="text-xs text-muted">/100 Score</span>
              </div>

              <div className="flex flex-col gap-2 text-xs text-secondary" style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div className="flex justify-between">
                  <span>Headcount:</span>
                  <span className="text-primary font-semibold">{dept.headcount} active</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Overtime:</span>
                  <span className="text-rose font-mono font-bold">{dept.avgOvertime}h / week</span>
                </div>
                <div className="flex justify-between">
                  <span>Burnout Risk:</span>
                  <span className={`font-bold ${dept.burnoutRisk === 'High' ? 'text-rose' : 'text-emerald'}`}>
                    {dept.burnoutRisk}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Burnout Risk Radar Table */}
      <div style={{ marginBottom: '2rem' }}>
        <Card
          title="Burnout Radar & Early Intervention"
          subtitle="Employees flagged with sustained excessive overtime or continuous on-call shifts"
          icon={Flame}
        >
          <Table columns={burnoutColumns} data={burnoutList} isLoading={loading} />
        </Card>
      </div>

      {/* AI Prescriptive Recommendations */}
      <div>
        <h3 className="text-base font-bold text-primary" style={{ marginBottom: '1rem' }}>
          Real-time Workforce Pulse Anomalies & HR Actions
        </h3>
        <div className="flex flex-col gap-3">
          {(pulse?.alerts || [
            {
              id: '1',
              title: 'Critical Overtime Anomaly: Engineering Squad',
              description: 'Backend & DevOps subteams logged 140+ cumulative overtime hours in 14 days following the v2.4 launch.',
              recommendedAction: 'Rotate on-call schedules & reallocate 2 sprint tickets to next milestone.',
            },
          ]).map((alert, idx) => (
            <div
              key={alert.id || idx}
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
              }}
            >
              <div style={{ color: 'var(--pulse-cyan)', marginTop: '2px' }}>
                <Sparkles size={22} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-primary">{alert.title}</h4>
                <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
                  {alert.description}
                </p>
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.625rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(6, 182, 212, 0.08)',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="text-xs font-semibold text-cyan">
                    💡 Recommended Action: {alert.recommendedAction}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert(`Applying recommendation: ${alert.recommendedAction}`)}
                  >
                    Execute Mitigation
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default WorkforcePulse;
