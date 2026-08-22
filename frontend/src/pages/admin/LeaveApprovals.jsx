import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/shared/StatusBadge';
import EmployeeAvatar from '../../components/shared/EmployeeAvatar';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import leaveService from '../../features/leave/leave.service';
import { formatDate } from '../../utils/formatters';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  GitBranch,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Zap,
} from 'lucide-react';

export const LeaveApprovals = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decisionModal, setDecisionModal] = useState({ open: false, req: null, action: 'approve' });
  const [decisionNote, setDecisionNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getPendingApprovals();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDecision = (req, action) => {
    setDecisionModal({ open: true, req, action });
    setDecisionNote('');
  };

  const handleConfirmDecision = async () => {
    if (!decisionModal.req) return;
    setProcessing(true);
    try {
      const newStatus = decisionModal.action === 'approve' ? 'approved' : 'rejected';
      await leaveService.updateLeaveStatus(decisionModal.req.id, newStatus, decisionNote);
      setRequests((prev) => prev.filter((r) => r.id !== decisionModal.req.id));
      setActionSuccess(`Leave request for ${decisionModal.req.employeeName} ${newStatus} successfully!`);
      setDecisionModal({ open: false, req: null, action: 'approve' });
      setTimeout(() => setActionSuccess(''), 4000);
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkApproveSafe = async () => {
    setLoading(true);
    try {
      const safeReqs = requests.filter((r) => r.impactRisk !== 'critical' && r.impactRisk !== 'high');
      for (const req of safeReqs) {
        await leaveService.updateLeaveStatus(req.id, 'approved', 'AI Bulk Safe Approval');
      }
      setRequests((prev) => prev.filter((r) => r.impactRisk === 'critical' || r.impactRisk === 'high'));
      setActionSuccess(`Successfully approved ${safeReqs.length} low-risk leave applications!`);
      setTimeout(() => setActionSuccess(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Employee',
      key: 'employeeName',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={row?.employeeName || 'Staff'} size="md" />
          <div>
            <p className="text-sm font-bold text-primary">{row?.employeeName || 'Staff'}</p>
            <p className="text-xs text-muted">{row?.role || 'Engineer'} • <span style={{ color: 'var(--primary)' }}>{row?.department || 'Engineering'}</span></p>
          </div>
        </div>
      ),
    },
    {
      header: 'Requested Period',
      key: 'startDate',
      render: (_, row) => (
        <div>
          <p className="text-xs font-semibold text-primary">
            {formatDate(row?.startDate || '2026-09-01')} → {formatDate(row?.endDate || '2026-09-04')}
          </p>
          <span className="text-xs text-muted font-mono font-bold">{row?.days || 3} days ({row?.leaveType || 'annual'})</span>
        </div>
      ),
    },
    {
      header: 'Reason / Purpose',
      key: 'reason',
      render: (val) => <span className="text-xs text-secondary">{val || 'Personal leave'}</span>,
    },
    {
      header: 'Smart Leave Impact™',
      key: 'impactRisk',
      render: (val, row) => {
        const isHigh = val === 'critical' || val === 'high';
        return (
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  backgroundColor: isHigh ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: isHigh ? '#EF4444' : '#10B981',
                  textTransform: 'uppercase',
                }}
              >
                {val || 'low'} risk
              </span>
              <span className="text-xs font-mono text-muted">
                {row?.projectedCoverage || '82%'} Coverage
              </span>
            </div>
            {row?.conflictWarning && (
              <p className="text-xs text-rose" style={{ marginTop: '2px', fontSize: '0.6875rem' }}>
                {row.conflictWarning}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={GitBranch}
            onClick={() => navigate('/admin/leave-impact')}
          >
            Simulate
          </Button>
          <Button
            variant="success"
            size="sm"
            icon={CheckCircle2}
            onClick={() => handleOpenDecision(row, 'approve')}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={XCircle}
            onClick={() => handleOpenDecision(row, 'reject')}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Leave Approvals Queue & Coverage Radar"
      subtitle="Review pending employee time-off requests with real-time Smart Leave Impact simulation."
      action={
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={Zap}
            onClick={handleBulkApproveSafe}
          >
            AI Safe-Approve All
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={GitBranch}
            onClick={() => navigate('/admin/leave-impact')}
          >
            Open Impact Simulator
          </Button>
        </div>
      }
    >
      {actionSuccess && (
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
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          backgroundColor: '#0A0A0F',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ color: 'var(--primary)' }}><Sparkles size={22} /></div>
          <div>
            <h4 className="text-sm font-bold text-primary">Smart Coverage Verification Active</h4>
            <p className="text-xs text-secondary" style={{ marginTop: '2px' }}>
              DayFlow automatically simulates team capacity and project milestone collisions before you approve.
            </p>
          </div>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.625rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            color: '#38BDF8',
          }}
        >
          {requests.length} Queued Requests
        </span>
      </div>

      <Card noPadding>
        <Table columns={columns} data={requests} isLoading={loading} emptyMessage="No pending leave requests in queue." />
      </Card>

      {/* Decision Confirmation Modal */}
      <Modal
        isOpen={decisionModal.open}
        onClose={() => setDecisionModal({ open: false, req: null, action: 'approve' })}
        title={`${decisionModal.action === 'approve' ? 'Approve' : 'Reject'} Leave Request`}
        subtitle={`Employee: ${decisionModal.req?.employeeName || 'Staff'} (${decisionModal.req?.days || 0} days)`}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Decision Audit Note / Rationale"
            value={decisionNote}
            onChange={(e) => setDecisionNote(e.target.value)}
            placeholder={
              decisionModal.action === 'approve'
                ? 'e.g. Coverage threshold confirmed above 75%'
                : 'e.g. Critical release sprint overlap in progress'
            }
            autoFocus
          />

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDecisionModal({ open: false, req: null, action: 'approve' })}
            >
              Cancel
            </Button>
            <Button
              variant={decisionModal.action === 'approve' ? 'success' : 'danger'}
              size="sm"
              isLoading={processing}
              onClick={handleConfirmDecision}
            >
              Confirm {decisionModal.action === 'approve' ? 'Approval' : 'Rejection'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default LeaveApprovals;
