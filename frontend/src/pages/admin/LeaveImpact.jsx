import React, { useState } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/shared/StatusBadge';
import leaveImpactService from '../../features/leaveImpact/leaveImpact.service';
import { DEPARTMENTS } from '../../utils/constants';
import {
  GitBranch,
  Play,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Users,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

export const LeaveImpact = () => {
  const [simulationForm, setSimulationForm] = useState({
    employeeName: 'Alex Mercer',
    department: 'Engineering',
    role: 'Senior Fullstack Engineer',
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    days: 4,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    simulationId: 'sim_default_01',
    employeeName: 'Alex Mercer',
    department: 'Engineering',
    role: 'Senior Fullstack Engineer',
    dates: '2026-09-01 to 2026-09-04 (4 days)',
    riskLevel: 'critical',
    overallImpactScore: 88,
    staffingCoverage: {
      currentCoveragePercent: 100,
      projectedCoveragePercent: 58,
      minimumRequiredPercent: 75,
      isUnderStaffed: true,
    },
    overlappingLeaves: [
      { name: 'David Miller', role: 'DevOps Lead', dates: '2026-09-02 to 2026-09-08', status: 'Pending Approval' },
      { name: 'Lucas Grey', role: 'Infrastructure SRE', dates: '2026-09-01 to 2026-09-03', status: 'Approved' },
    ],
    criticalMilestonesAtRisk: [
      { project: 'v2.5 Cloud Infrastructure Migration', releaseDate: '2026-09-05', risk: 'High — No lead DevOps engineer on call' },
      { project: 'SOC2 Security Audit Handover', releaseDate: '2026-09-03', risk: 'Medium — Sign-off delegate required' },
    ],
    recommendations: [
      '⚠️ Concurrent absence with DevOps lead violates minimum 2-engineer on-call policy.',
      '🔄 Designate Priya Sharma as primary escalation proxy before approving.',
      '🗓️ Suggest shifting leave by 3 days (Starting Sept 7th) for 0% project conflict.',
    ],
  });

  const handleSimulate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await leaveImpactService.simulateLeaveImpact(simulationForm);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickScenario = (emp, dept, role, start, end, days) => {
    const updated = {
      employeeName: emp,
      department: dept,
      role,
      startDate: start,
      endDate: end,
      days,
    };
    setSimulationForm(updated);
    setLoading(true);
    leaveImpactService.simulateLeaveImpact(updated).then((res) => {
      setResult(res);
      setLoading(false);
    });
  };

  return (
    <PageContainer
      title="Smart Leave Impact™ Simulator"
      subtitle="Proactively model staffing coverage, milestone risks, and team concurrency before granting leave."
    >
      {/* Quick Scenario Preset Chips */}
      <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: '1.5rem' }}>
        <span className="text-xs font-bold text-muted uppercase">Sample Scenarios:</span>
        <button
          onClick={() => handleQuickScenario('Alex Mercer', 'Engineering', 'Senior Fullstack Engineer', '2026-09-01', '2026-09-04', 4)}
          className="text-xs font-semibold"
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: 'var(--danger)',
            cursor: 'pointer',
          }}
        >
          🚨 Alex Mercer (Critical Overlap Scenario)
        </button>

        <button
          onClick={() => handleQuickScenario('Elena Rostova', 'Product & Design', 'Lead UI/UX Designer', '2026-08-28', '2026-08-29', 2)}
          className="text-xs font-semibold"
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: 'var(--success)',
            cursor: 'pointer',
          }}
        >
          ✅ Elena Rostova (Safe Approval Scenario)
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Simulation Configurator */}
        <div>
          <Card title="Simulation Parameters" subtitle="Configure leave details to test coverage impact" icon={GitBranch}>
            <form onSubmit={handleSimulate} className="flex flex-col gap-4">
              <Input
                label="Employee Name"
                value={simulationForm.employeeName}
                onChange={(e) => setSimulationForm({ ...simulationForm, employeeName: e.target.value })}
                required
              />

              <Select
                label="Department"
                value={simulationForm.department}
                onChange={(e) => setSimulationForm({ ...simulationForm, department: e.target.value })}
                options={DEPARTMENTS}
              />

              <Input
                label="Role / Designation"
                value={simulationForm.role}
                onChange={(e) => setSimulationForm({ ...simulationForm, role: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date"
                  type="date"
                  value={simulationForm.startDate}
                  onChange={(e) => setSimulationForm({ ...simulationForm, startDate: e.target.value })}
                  required
                />
                <Input
                  label="End Date"
                  type="date"
                  value={simulationForm.endDate}
                  onChange={(e) => setSimulationForm({ ...simulationForm, endDate: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Play}
                isLoading={loading}
                style={{ marginTop: '0.5rem', width: '100%' }}
              >
                Run Impact Simulation
              </Button>
            </form>
          </Card>
        </div>

        {/* Right 2 Columns: Live Simulation Output */}
        <div style={{ gridColumn: 'span 2' }} className="flex flex-col gap-6">
          {/* Top Result Banner */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: result.riskLevel === 'critical' ? 'var(--danger-bg)' : 'var(--success-bg)',
              border: `1px solid ${result.riskLevel === 'critical' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {result.riskLevel === 'critical' ? (
                  <AlertTriangle size={32} style={{ color: 'var(--danger)' }} />
                ) : (
                  <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
                )}
                <div>
                  <h3 className="text-base font-extrabold text-primary">
                    {result.riskLevel === 'critical' ? 'High Operational Risk Detected' : 'Safe to Approve'}
                  </h3>
                  <p className="text-xs text-secondary" style={{ marginTop: '2px' }}>
                    Simulation for {result.employeeName} ({result.dates})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-muted">Impact Score</span>
                  <p className="text-2xl font-black font-mono" style={{ color: result.riskLevel === 'critical' ? 'var(--danger)' : 'var(--success)' }}>
                    {result.overallImpactScore}/100
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coverage Bar & Metrics */}
          <Card title="Team Coverage & Staffing Deficit">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-secondary">{result.department} Team Staffing Capacity:</span>
                <span className={`font-mono font-bold ${result.staffingCoverage.isUnderStaffed ? 'text-rose' : 'text-emerald'}`}>
                  {result.staffingCoverage.projectedCoveragePercent}% (Threshold: {result.staffingCoverage.minimumRequiredPercent}%)
                </span>
              </div>
              <div style={{ height: 10, backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 999, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${result.staffingCoverage.projectedCoveragePercent}%`,
                    height: '100%',
                    backgroundColor: result.staffingCoverage.isUnderStaffed ? 'var(--danger)' : 'var(--success)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            {/* Overlapping Leaves */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 className="text-xs font-bold text-muted uppercase" style={{ marginBottom: '0.75rem' }}>
                Concurrent Teammate Absences ({result.overlappingLeaves.length})
              </h4>
              <div className="flex flex-col gap-2">
                {result.overlappingLeaves.length === 0 ? (
                  <p className="text-xs text-emerald">✅ No concurrent absences detected during this period.</p>
                ) : (
                  result.overlappingLeaves.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                      style={{
                        padding: '0.625rem 1rem',
                        backgroundColor: 'rgba(30, 41, 59, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <span className="font-bold text-primary">{item.name}</span>
                        <span className="text-muted"> ({item.role})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-secondary font-mono">{item.dates}</span>
                        <Badge variant="warning" size="sm">{item.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Critical Milestones */}
            {result.criticalMilestonesAtRisk.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 className="text-xs font-bold text-rose uppercase" style={{ marginBottom: '0.75rem' }}>
                  Project Milestones at Risk ({result.criticalMilestonesAtRisk.length})
                </h4>
                <div className="flex flex-col gap-2">
                  {result.criticalMilestonesAtRisk.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                      style={{
                        padding: '0.625rem 1rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                      }}
                    >
                      <div>
                        <span className="font-bold text-primary">{m.project}</span>
                        <p className="text-secondary" style={{ marginTop: '2px' }}>{m.risk}</p>
                      </div>
                      <span className="text-muted font-mono">{m.releaseDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* AI Mitigations & Next Steps */}
          <Card title="Smart Mitigation Strategy" icon={Sparkles}>
            <div className="flex flex-col gap-2">
              {result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="text-xs font-medium text-primary"
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}
                >
                  {rec}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default LeaveImpact;
