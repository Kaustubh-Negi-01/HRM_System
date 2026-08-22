import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/shared/StatusBadge';
import EmployeeAvatar from '../../components/shared/EmployeeAvatar';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import payrollService from '../../features/payroll/payroll.service';
import { formatCurrency } from '../../utils/formatters';
import {
  CreditCard,
  DollarSign,
  PlayCircle,
  CheckCircle2,
  Download,
  Receipt,
  Users,
  ShieldCheck,
} from 'lucide-react';

export const PayrollManagement = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    totalMonthlyPayout: 382400,
    averageSalary: 7966,
    totalEmployeesProcessed: 48,
    taxDeductionsTotal: 72400,
  });
  const [loading, setLoading] = useState(true);
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState('August 2026');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    setLoading(true);
    try {
      const [recData, statData] = await Promise.all([
        payrollService.getAllRecords(),
        payrollService.getPayrollStats(),
      ]);
      setRecords(recData);
      if (statData) setStats(statData);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPayroll = async () => {
    setRunning(true);
    try {
      await payrollService.generatePayrollCycle({ cycle: selectedCycle });
      // Update all to paid/processing
      setRecords(records.map((r) => ({ ...r, status: 'paid' })));
      setRunModalOpen(false);
    } finally {
      setRunning(false);
    }
  };

  const columns = [
    {
      header: 'Employee',
      key: 'employeeName',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={row.employeeName} size="sm" />
          <div>
            <p className="text-xs font-bold text-primary">{row.employeeName}</p>
            <p className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      key: 'department',
      render: (val) => <span className="text-xs font-semibold text-secondary">{val}</span>,
    },
    {
      header: 'Base Salary',
      key: 'baseSalary',
      render: (val) => <span className="text-xs text-primary font-mono">{formatCurrency(val)}</span>,
    },
    {
      header: 'Bonuses & Overtime',
      key: 'bonuses',
      render: (val) => <span className="text-xs text-emerald font-mono">+{formatCurrency(val || 0)}</span>,
    },
    {
      header: 'Deductions & Tax',
      key: 'deductions',
      render: (val) => <span className="text-xs text-rose font-mono">-{formatCurrency(val || 0)}</span>,
    },
    {
      header: 'Net Payout',
      key: 'netSalary',
      render: (val) => <span className="text-xs font-bold text-emerald font-mono">{formatCurrency(val)}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
  ];

  return (
    <PageContainer
      title="Payroll & Compensation Operations"
      subtitle="Execute automated payroll runs, tax compliance calculations, and employee compensation disbursements."
      action={
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => alert('Downloading master payroll ledger (CSV)...')}
          >
            Export Master Ledger
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={PlayCircle}
            onClick={() => setRunModalOpen(true)}
          >
            Run Payroll Cycle
          </Button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Total Monthly Outflow"
          value={formatCurrency(stats.totalMonthlyPayout)}
          change="August 2026 Cycle"
          changeType="neutral"
          icon={DollarSign}
          iconColor="var(--primary)"
          iconBg="var(--primary-bg)"
        />
        <StatCard
          title="Average Employee Comp"
          value={formatCurrency(stats.averageSalary)}
          change="48 Active Staff"
          changeType="positive"
          icon={Users}
          iconColor="var(--pulse-cyan)"
          iconBg="var(--pulse-cyan-bg)"
        />
        <StatCard
          title="Taxes & Benefits Withheld"
          value={formatCurrency(stats.taxDeductionsTotal)}
          change="100% Tax Compliant"
          changeType="positive"
          icon={ShieldCheck}
          iconColor="var(--warning)"
          iconBg="var(--warning-bg)"
        />
        <StatCard
          title="Cycle Status"
          value="48 Processed"
          change="Ready to Disburse"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="var(--success)"
          iconBg="var(--success-bg)"
        />
      </div>

      {/* Payroll Records Table */}
      <Card title="August 2026 Payroll Register" subtitle="Individual employee line items and disbursement calculation">
        <Table columns={columns} data={records} isLoading={loading} />
      </Card>

      {/* Run Payroll Modal */}
      <Modal
        isOpen={runModalOpen}
        onClose={() => setRunModalOpen(false)}
        title="Execute Payroll Disbursement"
        subtitle="Finalize calculations and trigger direct deposit batch"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setRunModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleRunPayroll} isLoading={running}>
              Authorize & Disburse $382,400
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Select
            label="Payroll Cycle"
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            options={[
              { value: 'August 2026', label: 'August 2026 (Aug 1 - Aug 31)' },
              { value: 'September 2026', label: 'September 2026 (Scheduled)' },
            ]}
          />

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex justify-between text-xs py-1">
              <span className="text-secondary">Total Employees:</span>
              <span className="text-primary font-bold">48</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-secondary">Gross Salaries:</span>
              <span className="text-primary font-mono font-bold">$454,800.00</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-secondary">Tax & Statutory Deductions:</span>
              <span className="text-rose font-mono font-bold">-$72,400.00</span>
            </div>
            <div className="flex justify-between text-xs font-bold py-1 border-t border-subtle mt-2 pt-2">
              <span className="text-primary">Net Total Transfer:</span>
              <span className="text-emerald font-mono text-sm">$382,400.00</span>
            </div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default PayrollManagement;
