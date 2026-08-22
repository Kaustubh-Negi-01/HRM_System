import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/shared/StatusBadge';
import EmployeeAvatar from '../../components/shared/EmployeeAvatar';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import payrollService from '../../features/payroll/payroll.service';
import { formatCurrency } from '../../utils/formatters';
import {
  CreditCard,
  PlayCircle,
  CheckCircle2,
  Download,
  Receipt,
  Users,
  ShieldCheck,
  PieChart,
  Sliders,
  TrendingUp,
  AlertTriangle,
  Building,
  Check,
} from 'lucide-react';

const INITIAL_DEPARTMENT_BUDGETS = [
  {
    department: 'Engineering',
    allocated: 18500000,
    utilized: 14250000,
    headcount: 24,
    manager: 'Alex Chen',
  },
  {
    department: 'Customer Support',
    allocated: 4500000,
    utilized: 3220000,
    headcount: 12,
    manager: 'Priya Sharma',
  },
  {
    department: 'Product & Design',
    allocated: 5500000,
    utilized: 3890000,
    headcount: 8,
    manager: 'Jordan Vance',
  },
  {
    department: 'Marketing & Growth',
    allocated: 3500000,
    utilized: 2480000,
    headcount: 5,
    manager: 'Sophia Reynolds',
  },
  {
    department: 'Human Resources',
    allocated: 2500000,
    utilized: 1640000,
    headcount: 3,
    manager: 'Saksham Singh',
  },
];

export const PayrollManagement = () => {
  const [activeTab, setActiveTab] = useState('payroll'); // 'payroll' or 'budget'
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    totalMonthlyPayout: 2548000,
    averageSalary: 53083,
    totalEmployeesProcessed: 48,
    taxDeductionsTotal: 382000,
  });
  const [loading, setLoading] = useState(true);
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState('August 2026');
  const [running, setRunning] = useState(false);

  // Budget Planner State
  const [deptBudgets, setDeptBudgets] = useState(() => {
    try {
      const cached = localStorage.getItem('dayflow_dept_budgets');
      return cached ? JSON.parse(cached) : INITIAL_DEPARTMENT_BUDGETS;
    } catch {
      return INITIAL_DEPARTMENT_BUDGETS;
    }
  });
  const [editingBudget, setEditingBudget] = useState(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [budgetSuccess, setBudgetSuccess] = useState('');

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
      const safeRecs = Array.isArray(recData) ? recData : [];
      setRecords(safeRecs);
      if (statData) setStats(statData);
    } catch (err) {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPayroll = async () => {
    setRunning(true);
    try {
      await payrollService.generatePayrollCycle({ cycle: selectedCycle });
      setRecords((prev) => prev.map((r) => ({ ...r, status: 'paid' })));
      setRunModalOpen(false);
    } finally {
      setRunning(false);
    }
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    if (!editingBudget || !newBudgetAmount) return;
    const updated = deptBudgets.map((d) => {
      if (d.department === editingBudget.department) {
        return { ...d, allocated: Number(newBudgetAmount) };
      }
      return d;
    });
    setDeptBudgets(updated);
    localStorage.setItem('dayflow_dept_budgets', JSON.stringify(updated));
    setEditingBudget(null);
    setBudgetSuccess(`Budget for ${editingBudget.department} updated to ${formatCurrency(Number(newBudgetAmount))}!`);
    setTimeout(() => setBudgetSuccess(''), 4000);
  };

  const totalAllocated = deptBudgets.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalUtilized = deptBudgets.reduce((acc, curr) => acc + curr.utilized, 0);
  const overallUtilization = Math.round((totalUtilized / (totalAllocated || 1)) * 100);

  const columns = [
    {
      header: 'Employee',
      key: 'employeeName',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={row?.employeeName || 'Staff'} size="sm" />
          <div>
            <p className="text-xs font-bold text-primary">{row?.employeeName || 'Staff'}</p>
            <p className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>{row?.role || 'Engineer'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      key: 'department',
      render: (val) => <span className="text-xs font-semibold text-secondary">{val || 'Engineering'}</span>,
    },
    {
      header: 'Base Salary',
      key: 'baseSalary',
      render: (val) => <span className="text-xs text-primary font-mono">{formatCurrency(val || 65000)}</span>,
    },
    {
      header: 'Bonuses & Allowances',
      key: 'bonuses',
      render: (val) => <span className="text-xs text-emerald font-mono">+{formatCurrency(val || 8500)}</span>,
    },
    {
      header: 'TDS & Deductions',
      key: 'deductions',
      render: (val) => <span className="text-xs text-rose font-mono">-{formatCurrency(val || 6200)}</span>,
    },
    {
      header: 'Net Monthly Payout',
      key: 'netSalary',
      render: (val) => <span className="text-xs font-bold text-emerald font-mono">{formatCurrency(val || 67300)}</span>,
    },
    {
      header: 'Disbursal Status',
      key: 'status',
      render: (val) => <StatusBadge status={val || 'paid'} size="sm" />,
    },
  ];

  return (
    <PageContainer
      title="Payroll & Workforce Budget Operations"
      subtitle="Execute automated INR payroll cycles, TDS compliance calculations, and departmental headcount budget allocation."
      action={
        <div className="flex items-center gap-3">
          <div
            style={{
              display: 'flex',
              backgroundColor: '#040407',
              padding: '0.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('payroll')}
              style={{
                padding: '0.4rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                backgroundColor: activeTab === 'payroll' ? '#38BDF8' : 'transparent',
                color: activeTab === 'payroll' ? '#000000' : '#94A3B8',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Payroll Ledger (INR)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('budget')}
              style={{
                padding: '0.4rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                backgroundColor: activeTab === 'budget' ? '#38BDF8' : 'transparent',
                color: activeTab === 'budget' ? '#000000' : '#94A3B8',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Manager Budget Planner
            </button>
          </div>

          <Button
            variant="primary"
            icon={PlayCircle}
            onClick={() => setRunModalOpen(true)}
          >
            Run Payroll Cycle
          </Button>
        </div>
      }
    >
      {budgetSuccess && (
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
          <span>{budgetSuccess}</span>
        </div>
      )}

      {/* Primary KPI Metrics (INR) */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Monthly Workforce Payout"
          value={formatCurrency(stats.totalMonthlyPayout)}
          change="Cycle: August 2026"
          changeType="neutral"
          icon={CreditCard}
          iconColor="var(--primary)"
          iconBg="var(--primary-bg)"
        />
        <StatCard
          title="Average Monthly CTC"
          value={formatCurrency(stats.averageSalary)}
          change="Across 48 Employees"
          changeType="neutral"
          icon={Users}
          iconColor="var(--pulse-cyan)"
          iconBg="var(--pulse-cyan-bg)"
        />
        <StatCard
          title="Annual Budget Allocated"
          value={formatCurrency(totalAllocated)}
          change={`${overallUtilization}% Utilized`}
          changeType="positive"
          icon={PieChart}
          iconColor="var(--emerald)"
          iconBg="var(--success-bg)"
        />
        <StatCard
          title="TDS & Statutory Reserve"
          value={formatCurrency(stats.taxDeductionsTotal)}
          change="Auto-calculated"
          changeType="neutral"
          icon={Receipt}
          iconColor="var(--indigo)"
          iconBg="var(--primary-bg)"
        />
      </div>

      {activeTab === 'payroll' ? (
        <div className="flex flex-col gap-6">
          <Card
            title="August 2026 Compensation Disbursement Ledger"
            subtitle="Verified compensation records calculated in Indian Rupees (INR ₹) with automated tax deductions."
            noPadding
          >
            <Table
              columns={columns}
              data={records}
              loading={loading}
              emptyMessage="No compensation records found."
            />
          </Card>
        </div>
      ) : (
        /* Manager & HR Budget Allocation Planner */
        <div className="flex flex-col gap-6">
          <Card
            title="Departmental Workforce Budget & Headcount Allocation"
            subtitle="Real-time runway telemetry, compensation utilization, and manager spending limits."
          >
            <div className="flex flex-col gap-5">
              {deptBudgets.map((dept) => {
                const percent = Math.round((dept.utilized / dept.allocated) * 100);
                const remaining = dept.allocated - dept.utilized;
                return (
                  <div
                    key={dept.department}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      backgroundColor: '#0A0A0F',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                      <div className="flex items-center gap-3">
                        <Building size={18} style={{ color: 'var(--primary)' }} />
                        <div>
                          <h4 className="text-sm font-bold text-primary">{dept.department}</h4>
                          <span className="text-xs text-muted">
                            Manager: <strong>{dept.manager}</strong> • Headcount: {dept.headcount} Members
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-muted block">Budget Utilization</span>
                          <span className="text-xs font-mono font-bold text-primary">
                            {formatCurrency(dept.utilized)} / {formatCurrency(dept.allocated)}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Sliders}
                          onClick={() => {
                            setEditingBudget(dept);
                            setNewBudgetAmount(String(dept.allocated));
                          }}
                        >
                          Adjust Budget
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(percent, 100)}%`,
                          height: '100%',
                          backgroundColor: percent > 90 ? 'var(--danger)' : percent > 75 ? 'var(--warning)' : 'var(--success)',
                          transition: 'width 300ms ease',
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{percent}% allocated funds consumed</span>
                      <span className="font-semibold" style={{ color: remaining > 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {formatCurrency(remaining)} remaining runway
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Adjust Budget Modal */}
      <Modal
        isOpen={Boolean(editingBudget)}
        onClose={() => setEditingBudget(null)}
        title={`Adjust ${editingBudget?.department || ''} Budget`}
        subtitle="Set authorized annual workforce compensation budget in INR (₹)."
      >
        <form onSubmit={handleSaveBudget} className="flex flex-col gap-4">
          <Input
            label="Annual Budget Allocation (INR ₹)"
            type="number"
            value={newBudgetAmount}
            onChange={(e) => setNewBudgetAmount(e.target.value)}
            placeholder="e.g., 20000000"
            required
            autoFocus
          />

          <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
            Preview: <strong>{formatCurrency(Number(newBudgetAmount) || 0)}</strong>
          </div>

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setEditingBudget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Allocation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Run Payroll Modal */}
      <Modal
        isOpen={runModalOpen}
        onClose={() => setRunModalOpen(false)}
        title="Execute Scheduled Payroll Cycle"
        subtitle="Disburse monthly compensation across 48 employees via direct bank transfer."
      >
        <div className="flex flex-col gap-4">
          <Select
            label="Select Payroll Cycle"
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            options={[
              { value: 'August 2026', label: 'August 2026 (Scheduled: Aug 31)' },
              { value: 'September 2026', label: 'September 2026 (Upcoming)' },
            ]}
          />

          <div
            style={{
              padding: '1rem',
              backgroundColor: '#040407',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.8125rem',
            }}
          >
            <div className="flex justify-between">
              <span className="text-muted">Total Net Disbursal:</span>
              <span className="font-bold text-primary font-mono">{formatCurrency(stats.totalMonthlyPayout)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Statutory TDS Reserve:</span>
              <span className="font-bold text-rose font-mono">{formatCurrency(stats.taxDeductionsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Banking Settlement Gateway:</span>
              <span className="font-semibold text-emerald">IMPS / NEFT Instant Batch</span>
            </div>
          </div>

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setRunModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={ShieldCheck}
              isLoading={running}
              onClick={handleRunPayroll}
            >
              Confirm & Disburse Batch
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default PayrollManagement;
