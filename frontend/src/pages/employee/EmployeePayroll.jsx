import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/shared/StatusBadge';
import payrollService from '../../features/payroll/payroll.service';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  CreditCard,
  Download,
  DollarSign,
  TrendingUp,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const EmployeePayroll = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    loadPayslips();
  }, []);

  const loadPayslips = async () => {
    setLoading(true);
    try {
      const data = await payrollService.getMyPayslips();
      setPayslips(data);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Pay Cycle',
      key: 'month',
      render: (val) => <span className="font-bold text-primary">{val}</span>,
    },
    {
      header: 'Disbursement Date',
      key: 'payDate',
      render: (val) => <span className="text-xs text-muted font-mono">{formatDate(val)}</span>,
    },
    {
      header: 'Gross Earnings',
      key: 'grossSalary',
      render: (val) => <span className="text-xs text-secondary">{formatCurrency(val)}</span>,
    },
    {
      header: 'Deductions & Taxes',
      key: 'deductions',
      render: (_, row) => (
        <span className="text-xs" style={{ color: 'var(--danger)' }}>
          -{formatCurrency((row.deductions || 0) + (row.taxes || 0))}
        </span>
      ),
    },
    {
      header: 'Net Take-Home',
      key: 'netSalary',
      render: (val) => (
        <span className="font-bold text-emerald">{formatCurrency(val)}</span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => setSelectedSlip(row)}
        >
          View Slip
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      title="My Compensation & Payslips"
      subtitle="Review monthly compensation breakdowns, tax deductions, and download digital payslips."
    >
      {/* Current Month Compensation Overview */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Base Monthly Salary"
          value="$8,500.00"
          change="Standard Rate"
          changeType="neutral"
          icon={DollarSign}
          iconColor="var(--primary)"
          iconBg="var(--primary-bg)"
        />
        <StatCard
          title="Monthly Allowances"
          value="$1,200.00"
          change="Health + WFH"
          changeType="positive"
          icon={TrendingUp}
          iconColor="var(--success)"
          iconBg="var(--success-bg)"
        />
        <StatCard
          title="Estimated Deductions"
          value="$3,950.00"
          change="Tax & Benefits"
          changeType="neutral"
          icon={ShieldCheck}
          iconColor="var(--warning)"
          iconBg="var(--warning-bg)"
        />
        <StatCard
          title="Net Take-Home"
          value="$6,250.00"
          change="Processed monthly"
          changeType="positive"
          icon={CreditCard}
          iconColor="var(--pulse-cyan)"
          iconBg="var(--pulse-cyan-bg)"
        />
      </div>

      {/* Payslips Table */}
      <Card title="Payment History & Digital Slips" subtitle="Official records of previous salary disbursements">
        <Table columns={columns} data={payslips} isLoading={loading} />
      </Card>

      {/* Payslip View Modal */}
      {selectedSlip && (
        <Modal
          isOpen={Boolean(selectedSlip)}
          onClose={() => setSelectedSlip(null)}
          title={`Payslip — ${selectedSlip.month}`}
          subtitle={`Disbursement ID: ${selectedSlip.id}`}
          maxWidth="600px"
          footer={
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              onClick={() => alert(`Downloading payslip for ${selectedSlip.month}...`)}
            >
              Download Official PDF
            </Button>
          }
        >
          <div className="flex flex-col gap-4">
            {/* Header info */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <p className="text-xs text-muted">EMPLOYEE NAME</p>
                <p className="text-sm font-bold text-primary">Alex Mercer</p>
                <p className="text-xs text-secondary">Senior Fullstack Engineer (Engineering)</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">PAYMENT DATE</p>
                <p className="text-sm font-bold text-primary">{formatDate(selectedSlip.payDate)}</p>
                <StatusBadge status={selectedSlip.status} size="sm" />
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h4 className="text-xs font-bold text-muted uppercase" style={{ marginBottom: '0.75rem' }}>
                  Earnings
                </h4>
                <div className="flex justify-between text-xs" style={{ marginBottom: '0.5rem' }}>
                  <span className="text-secondary">Base Salary</span>
                  <span className="text-primary font-mono">{formatCurrency(selectedSlip.baseSalary)}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ marginBottom: '0.5rem' }}>
                  <span className="text-secondary">Allowances & Perks</span>
                  <span className="text-primary font-mono">{formatCurrency(selectedSlip.allowances)}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ marginBottom: '0.5rem' }}>
                  <span className="text-secondary">Performance Bonus</span>
                  <span className="text-primary font-mono">{formatCurrency(selectedSlip.bonus || 0)}</span>
                </div>
                <div
                  className="flex justify-between text-xs font-bold"
                  style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}
                >
                  <span className="text-primary">Gross Pay</span>
                  <span className="text-primary font-mono">{formatCurrency(selectedSlip.grossSalary)}</span>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h4 className="text-xs font-bold text-muted uppercase" style={{ marginBottom: '0.75rem' }}>
                  Deductions & Taxes
                </h4>
                <div className="flex justify-between text-xs" style={{ marginBottom: '0.5rem' }}>
                  <span className="text-secondary">Income Tax (Federal/State)</span>
                  <span className="font-mono text-rose">-{formatCurrency(selectedSlip.taxes)}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ marginBottom: '0.5rem' }}>
                  <span className="text-secondary">Health Insurance & 401(k)</span>
                  <span className="font-mono text-rose">-{formatCurrency(selectedSlip.deductions)}</span>
                </div>
                <div
                  className="flex justify-between text-xs font-bold"
                  style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}
                >
                  <span className="text-primary">Total Deductions</span>
                  <span className="font-mono text-rose">
                    -{formatCurrency((selectedSlip.taxes || 0) + (selectedSlip.deductions || 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Net Banner */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success-bg)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div>
                <p className="text-xs font-bold text-emerald uppercase">Net Take-Home Pay</p>
                <p className="text-xs text-secondary">Directly transferred to checking account ending in ••8492</p>
              </div>
              <span className="text-2xl font-extrabold text-emerald font-mono">
                {formatCurrency(selectedSlip.netSalary)}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default EmployeePayroll;
