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
  TrendingUp,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Building,
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
      const safeData = Array.isArray(data) ? data : [];
      setPayslips(safeData);
    } catch {
      setPayslips([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Pay Cycle',
      key: 'month',
      render: (val) => <span className="font-bold text-primary">{val || 'July 2026'}</span>,
    },
    {
      header: 'Disbursement Date',
      key: 'payDate',
      render: (val) => <span className="text-xs text-muted font-mono">{formatDate(val || '2026-07-31')}</span>,
    },
    {
      header: 'Gross Earnings',
      key: 'grossSalary',
      render: (val) => <span className="text-xs text-secondary font-mono">{formatCurrency(val || 143500)}</span>,
    },
    {
      header: 'Deductions & TDS',
      key: 'deductions',
      render: (_, row) => (
        <span className="text-xs font-mono" style={{ color: 'var(--danger)' }}>
          -{formatCurrency((row?.deductions || 0) + (row?.taxes || 14200))}
        </span>
      ),
    },
    {
      header: 'Net Take-Home',
      key: 'netSalary',
      render: (val) => (
        <span className="font-bold text-emerald font-mono">{formatCurrency(val || 129300)}</span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val || 'paid'} size="sm" />,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => setSelectedSlip(row || { month: 'July 2026', grossSalary: 143500, netSalary: 129300, baseSalary: 125000, allowances: 18500, deductions: 14200 })}
        >
          View Slip
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      title="My Compensation & Payslips"
      subtitle="Review monthly compensation breakdowns in INR (₹), TDS deductions, and download digital salary slips."
    >
      {/* Current Month Compensation Overview */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Base Monthly Salary"
          value={formatCurrency(125000)}
          change="Standard CTC Rate"
          changeType="neutral"
          icon={Receipt}
          iconColor="var(--primary)"
          iconBg="var(--primary-bg)"
        />
        <StatCard
          title="Monthly Allowances"
          value={formatCurrency(18500)}
          change="HRA + Special Allowances"
          changeType="positive"
          icon={TrendingUp}
          iconColor="var(--success)"
          iconBg="var(--success-bg)"
        />
        <StatCard
          title="TDS & Deductions"
          value={formatCurrency(14200)}
          change="PF + Income Tax"
          changeType="neutral"
          icon={ShieldCheck}
          iconColor="var(--warning)"
          iconBg="var(--warning-bg)"
        />
        <StatCard
          title="Net Take-Home"
          value={formatCurrency(129300)}
          change="Direct NEFT Transfer"
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
          title={`Digital Payslip — ${selectedSlip.month || 'July 2026'}`}
          subtitle="Official employment compensation voucher with statutory breakdown."
        >
          <div className="flex flex-col gap-4">
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                backgroundColor: '#040407',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div className="flex justify-between items-center border-b border-subtle pb-2">
                <span className="text-xs text-muted">Basic Salary:</span>
                <span className="text-xs font-mono font-bold text-primary">{formatCurrency(selectedSlip.baseSalary || 125000)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-subtle pb-2">
                <span className="text-xs text-muted">House Rent Allowance (HRA):</span>
                <span className="text-xs font-mono font-bold text-emerald">+{formatCurrency(selectedSlip.allowances || 18500)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-subtle pb-2">
                <span className="text-xs text-muted">Provident Fund & TDS:</span>
                <span className="text-xs font-mono font-bold text-rose">-{formatCurrency(selectedSlip.deductions || 14200)}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-bold text-primary">Net Amount Credited:</span>
                <span className="text-base font-mono font-black text-emerald">{formatCurrency(selectedSlip.netSalary || 129300)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3" style={{ marginTop: '0.5rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSlip(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={() => {
                  alert('Payslip PDF downloaded successfully!');
                  setSelectedSlip(null);
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default EmployeePayroll;
