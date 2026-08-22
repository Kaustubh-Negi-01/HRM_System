import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import StatusBadge from '../../components/shared/StatusBadge';
import leaveService from '../../features/leave/leave.service';
import { formatDate } from '../../utils/formatters';
import { LEAVE_TYPES } from '../../utils/constants';
import {
  CalendarDays,
  PlusCircle,
  Clock,
  HeartPulse,
  Sun,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const EmployeeLeave = () => {
  const [requests, setRequests] = useState([]);
  const [balances, setBalances] = useState({
    annual: { total: 20, used: 6, remaining: 14 },
    sick: { total: 10, used: 2, remaining: 8 },
    casual: { total: 8, used: 1, remaining: 7 },
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqData, balData] = await Promise.all([
        leaveService.getMyRequests(),
        leaveService.getMyBalance(),
      ]);
      setRequests(reqData);
      if (balData) setBalances(balData);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await leaveService.applyLeave(form);
      setRequests([created, ...requests]);
      setModalOpen(false);
      setForm({ leaveType: 'annual', startDate: '', endDate: '', reason: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Leave Type',
      key: 'leaveType',
      render: (val) => (
        <span className="font-bold text-primary" style={{ textTransform: 'capitalize' }}>
          {val} Leave
        </span>
      ),
    },
    {
      header: 'Duration',
      key: 'startDate',
      render: (_, row) => (
        <div>
          <p className="text-xs font-semibold text-primary">
            {formatDate(row.startDate)} → {formatDate(row.endDate)}
          </p>
          <span className="text-xs text-muted font-mono">{row.days} {row.days === 1 ? 'day' : 'days'}</span>
        </div>
      ),
    },
    {
      header: 'Reason',
      key: 'reason',
      render: (val) => <span className="text-xs text-secondary">{val || '—'}</span>,
    },
    {
      header: 'Applied On',
      key: 'appliedAt',
      render: (val) => <span className="text-xs text-muted">{formatDate(val)}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
  ];

  return (
    <PageContainer
      title="My Leave Management"
      subtitle="Track your leave allocations, submit new requests, and review approval history."
      action={
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => setModalOpen(true)}
        >
          Apply for Leave
        </Button>
      }
    >
      {/* Leave Balances Grid */}
      <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '2rem' }}>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted uppercase">Annual Leave</p>
              <h3 className="text-2xl font-extrabold text-primary" style={{ marginTop: '0.25rem' }}>
                {balances.annual?.remaining || 14} <span className="text-sm font-normal text-muted">/ {balances.annual?.total || 20} days left</span>
              </h3>
            </div>
            <div
              style={{
                padding: '0.625rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-bg)',
                color: 'var(--primary)',
              }}
            >
              <Sun size={24} />
            </div>
          </div>
          <div
            style={{
              height: '6px',
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: 'var(--radius-full)',
              marginTop: '1rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${((balances.annual?.remaining || 14) / (balances.annual?.total || 20)) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
              }}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted uppercase">Sick Leave</p>
              <h3 className="text-2xl font-extrabold text-primary" style={{ marginTop: '0.25rem' }}>
                {balances.sick?.remaining || 8} <span className="text-sm font-normal text-muted">/ {balances.sick?.total || 10} days left</span>
              </h3>
            </div>
            <div
              style={{
                padding: '0.625rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)',
              }}
            >
              <HeartPulse size={24} />
            </div>
          </div>
          <div
            style={{
              height: '6px',
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: 'var(--radius-full)',
              marginTop: '1rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${((balances.sick?.remaining || 8) / (balances.sick?.total || 10)) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--danger)',
              }}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted uppercase">Casual Leave</p>
              <h3 className="text-2xl font-extrabold text-primary" style={{ marginTop: '0.25rem' }}>
                {balances.casual?.remaining || 7} <span className="text-sm font-normal text-muted">/ {balances.casual?.total || 8} days left</span>
              </h3>
            </div>
            <div
              style={{
                padding: '0.625rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--pulse-cyan-bg)',
                color: 'var(--pulse-cyan)',
              }}
            >
              <CalendarDays size={24} />
            </div>
          </div>
          <div
            style={{
              height: '6px',
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: 'var(--radius-full)',
              marginTop: '1rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${((balances.casual?.remaining || 7) / (balances.casual?.total || 8)) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--pulse-cyan)',
              }}
            />
          </div>
        </Card>
      </div>

      {/* History Table */}
      <Card title="Leave Requests & Approval History" subtitle="Recent submissions and their current state">
        <Table columns={columns} data={requests} isLoading={loading} />
      </Card>

      {/* Modal for Applying */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Leave Application"
        subtitle="Specify leave type and dates for HR review"
      >
        <form onSubmit={handleApply} className="flex flex-col gap-4">
          <Select
            label="Leave Type"
            value={form.leaveType}
            onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
            options={LEAVE_TYPES}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </div>

          <Input
            label="Reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="e.g. Travel, Personal errand, Doctor checkup"
            required
          />

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Submit for Approval
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default EmployeeLeave;
