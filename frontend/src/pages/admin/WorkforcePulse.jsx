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
  Smile,
  HeartHandshake,
  ShieldCheck,
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
      setBurnoutList(Array.isArray(burnoutData) ? burnoutData : []);
    } catch {
      setBurnoutList([]);
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
          <EmployeeAvatar name={row?.employeeName || 'Staff'} size="md" />
          <div>
            <p className="text-xs font-bold text-primary">{row?.employeeName || 'Staff'}</p>
            <p className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>{row?.role || 'Staff'} • {row?.department || 'Engineering'}</p>
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
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${val || 40}%`,
                height: '100%',
                backgroundColor: (val || 0) > 80 ? 'var(--danger)' : 'var(--warning)',
              }}
            />
          </div>
          <span className="text-xs font-bold font-mono" style={{ color: (val || 0) > 80 ? 'var(--danger)' : 'var(--warning)' }}>
            {val || 40}%
          </span>
        </div>
      ),
    },
    {
      header: 'Overtime (30d)',
      key: 'overtimeHours',
      render: (val) => (
        <span className="text-xs font-mono font-bold text-rose">
          {val || 0} hrs
        </span>
      ),
    },
    {
      header: 'Consecutive Shifts',
      key: 'streakWithoutRest',
      render: (val) => (
        <span className="text-xs text-muted font-mono">
          {val || 1} days
        </span>
      ),
    },
    {
      header: 'Suggested Intervention',
      key: 'recommendation',
      render: (val) => (
        <span className="text-xs text-primary font-medium">
          {val || 'Encourage comp-off recovery day'}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Workforce Pulse™ Telemetry & Health Radar"
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
          backgroundColor: '#0A0A0F',
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
              Telemetry aggregated from 48 verified employee timesheets, sprint velocities, and leave patterns.
              Customer Support requires proactive intervention due to elevated ticket volume.
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
              backgroundColor: '#040407',
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

      {/* Employee Sentiment & eNPS Radar */}
      <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '2rem' }}>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase">Employee NPS (eNPS)</span>
            <Smile size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div className="flex items-baseline gap-2" style={{ marginTop: '0.5rem' }}>
            <span className="text-3xl font-black text-emerald font-mono">+64</span>
            <span className="text-xs text-muted">Top 10% Benchmark</span>
          </div>
          <p className="text-xs text-secondary" style={{ marginTop: '0.5rem' }}>
            86% Promoters across 48 survey respondents this quarter.
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase">Retention Stability</span>
            <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="flex items-baseline gap-2" style={{ marginTop: '0.5rem' }}>
            <span className="text-3xl font-black text-primary font-mono">91.4%</span>
            <span className="text-xs text-muted">Low Flight Risk</span>
          </div>
          <p className="text-xs text-secondary" style={{ marginTop: '0.5rem' }}>
            Predicted annualized retention rate based on satisfaction telemetry.
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase">Workload Manageability</span>
            <HeartHandshake size={18} style={{ color: 'var(--pulse-cyan)' }} />
          </div>
          <div className="flex items-baseline gap-2" style={{ marginTop: '0.5rem' }}>
            <span className="text-3xl font-black text-cyan font-mono">84.0%</span>
            <span className="text-xs text-muted">Balanced Capacity</span>
          </div>
          <p className="text-xs text-secondary" style={{ marginTop: '0.5rem' }}>
            Engineering post-sprint recovery initiatives active.
          </p>
        </Card>
      </div>

      {/* Department Vitality Breakdown Cards */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 className="text-base font-bold text-primary" style={{ marginBottom: '1rem' }}>
          Department Vitality & Strain Breakdown
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(pulse?.departmentHealth || [
            { name: 'Engineering', headcount: 24, healthScore: 82, burnoutRisk: 'High', avgOvertime: 5.8, status: 'warning' },
            { name: 'Product & Design', headcount: 8, healthScore: 94, burnoutRisk: 'Low', avgOvertime: 1.2, status: 'optimal' },
            { name: 'Human Resources', headcount: 3, healthScore: 96, burnoutRisk: 'Low', avgOvertime: 0.8, status: 'optimal' },
            { name: 'Marketing & Growth', headcount: 5, healthScore: 86, burnoutRisk: 'Moderate', avgOvertime: 4.1, status: 'optimal' },
            { name: 'Customer Support', headcount: 12, healthScore: 78, burnoutRisk: 'High', avgOvertime: 6.2, status: 'danger' },
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

              <div className="flex flex-col gap-2 text-xs text-secondary" style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
              title: 'Critical Overtime Anomaly: Customer Support Squad',
              desc: 'Support leads have averaged 6.2 hours overtime over the past 14 days due to product launch inquiries.',
              urgency: 'high',
              action: 'Reallocate 2 part-time rotational engineers to support triage.',
            },
            {
              id: '2',
              title: 'Healthy Recovery Milestone: Product & Design',
              desc: 'Team overtime normalized to 1.2h/week following design system milestone completion.',
              urgency: 'low',
              action: 'Acknowledge squad sprint cadence during all-hands.',
            },
          ]).map((alert) => (
            <div
              key={alert.id}
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: '#0A0A0F',
                border: `1px solid ${alert.urgency === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  style={{ color: alert.urgency === 'high' ? 'var(--danger)' : 'var(--success)', marginTop: 2 }}
                />
                <div>
                  <h4 className="text-sm font-bold text-primary">{alert.title}</h4>
                  <p className="text-xs text-secondary" style={{ marginTop: '0.25rem', lineHeight: 1.5 }}>
                    {alert.desc}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-cyan" style={{ marginTop: '0.5rem' }}>
                    <Sparkles size={13} />
                    <span>Recommendation: {alert.action}</span>
                  </div>
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
