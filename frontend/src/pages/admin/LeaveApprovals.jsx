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
} from 'lucide-react';

export const LeaveApprovals = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decisionModal, setDecisionModal] = useState({ open: false, req: null, action: 'approve' });
  const [decisionNote, setDecisionNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getPendingApprovals();
      setRequests(data);
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
      setRequests(requests.filter((r) => r.id !== decisionModal.req.id));
      setDecisionModal({ open: false, req: null, action: 'approve' });
    } finally {
      setProcessing(false);
    }
  };

  const columns = [
    {
      header: 'Employee',
      key: 'employeeName',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={row.employeeName} size="md" />
          <div>
            <p className="text-sm font-bold text-primary">{row.employeeName}</p>
            <p className="text-xs text-muted">{row.role} • <span className="text-indigo">{row.department}</span></p>
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
            {formatDate(row.startDate)} → {formatDate(row.endDate)}
          </p>
          <span className="text-xs text-muted font-mono font-bold">{row.days} days ({row.leaveType})</span>
        </div>
      ),
    },
    {
      header: 'Reason',
      key: 'reason',
      render: (val) => <span className="text-xs text-secondary">{val}</span>,
    },
    {
      header: 'Smart Leave Impact™',
      key: 'impactRisk',
      render: (val, row) => {
        const isHigh = val === 'critical' || val === 'high';
        return (
          <div className="flex flex-col gap-1 items-start">
            <Badge variant={isHigh ? 'danger' : 'success'} size="sm">
              {isHigh ? '⚠️ Critical Conflict' : '✅ Low Impact'}
            </Badge>
            <span className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>
              {row.overlapCount > 0 ? `${row.overlapCount} overlapping leaves` : 'Zero coverage risk'}
            </span>
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
            variant="outline"
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
      title="Leave Approvals Queue"
      subtitle="Review pending employee time-off requests with real-time Smart Leave Impact simulation."
      action={
        <Button
          variant="secondary"
          size="sm"
          icon={GitBranch}
          onClick={() => navigate('/admin/leave-impact')}
        >
          Open Impact Simulator
        </Button>
      }
    >
      {/* Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
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
        <Badge variant="pulse" size="md">3 Queued Requests</Badge>
      </div>

      <Card>
        <Table columns={columns} data={requests} isLoading={loading} emptyMessage="No pending leave requests" />
      </Card>

      {/* Decision Modal */}
      {decisionModal.open && decisionModal.req && (
        <Modal
          isOpen={decisionModal.open}
          onClose={() => setDecisionModal({ open: false, req: null, action: 'approve' })}
          title={`${decisionModal.action === 'approve' ? 'Approve' : 'Reject'} Leave Request`}
          subtitle={`For ${decisionModal.req.employeeName} (${decisionModal.req.days} days)`}
          footer={
            <>
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
                onClick={handleConfirmDecision}
                isLoading={processing}
              >
                Confirm {decisionModal.action === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <p className="text-xs text-muted">LEAVE DURATION & REASON</p>
              <p className="text-sm font-bold text-primary" style={{ marginTop: '0.25rem' }}>
                {formatDate(decisionModal.req.startDate)} → {formatDate(decisionModal.req.endDate)} ({decisionModal.req.days} days)
              </p>
              <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
                "{decisionModal.req.reason}"
              </p>
            </div>

            <Input
              label="Manager / HR Notes (Optional)"
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="e.g. Approved with Priya covering critical bug escalations"
            />
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default LeaveApprovals;
