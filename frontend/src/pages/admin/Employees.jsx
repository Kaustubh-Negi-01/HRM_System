import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import EmployeeAvatar from '../../components/shared/EmployeeAvatar';
import StatusBadge from '../../components/shared/StatusBadge';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatters';
import { DEPARTMENTS } from '../../utils/constants';
import employeeService from '../../features/employee/employee.service';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  Eye,
  Mail,
  Building,
} from 'lucide-react';

export const Employees = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: 'Fullstack Engineer',
    salary: '8500',
  });

  const debouncedSearch = useDebounce(searchTerm, 250);
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const name = emp.name || '';
    const email = emp.email || '';
    const role = emp.role || emp.designation || '';
    const matchesSearch =
      name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      role.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        employeeId: `EMP${String(employees.length + 10).padStart(3, '0')}`,
        name: newEmployee.name,
        email: newEmployee.email,
        password: 'Password123!',
        department: newEmployee.department,
        designation: newEmployee.role,
        role: 'EMPLOYEE',
      };
      await employeeService.createEmployee(payload);
    } catch (err) {
      console.warn('Backend create fallback');
    }
    const created = {
      id: `emp_${Date.now()}`,
      name: newEmployee.name,
      email: newEmployee.email,
      department: newEmployee.department,
      role: newEmployee.role,
      designation: newEmployee.role,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      location: 'San Francisco, CA',
    };
    setEmployees([created, ...employees]);
    setModalOpen(false);
    setNewEmployee({ name: '', email: '', department: 'Engineering', role: '', salary: '8500' });
  };

  const columns = [
    {
      header: 'Employee',
      key: 'name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={row.name} size="md" />
          <div>
            <p className="text-sm font-bold text-primary">{row.name}</p>
            <p className="text-xs text-muted">{row.email}</p>
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
      header: 'Designation / Role',
      key: 'role',
      render: (val) => <span className="text-xs text-primary">{val}</span>,
    },
    {
      header: 'Join Date',
      key: 'joinDate',
      render: (val) => <span className="text-xs text-muted font-mono">{formatDate(val)}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      header: 'Action',
      key: 'actions',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/employees/${row.id}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      title="Employee Directory"
      subtitle="Manage your workforce profiles, roles, departments, and onboarding records."
      action={
        <Button
          variant="primary"
          icon={UserPlus}
          onClick={() => setModalOpen(true)}
        >
          Add New Employee
        </Button>
      }
    >
      {/* Search & Filter Controls */}
      <Card style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <Input
              icon={Search}
              placeholder="Search by name, role, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted flex items-center gap-1">
              <Filter size={14} /> Department:
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              <option value="all">All Departments ({employees.length})</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Directory Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredEmployees}
          onRowClick={(row) => navigate(`/admin/employees/${row.id}`)}
        />
      </Card>

      {/* Add Employee Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Onboard New Employee"
        subtitle="Create an employee profile and generate login access"
      >
        <form onSubmit={handleAddEmployee} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            placeholder="e.g. Jordan Hayes"
            required
          />

          <Input
            label="Work Email"
            type="email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            placeholder="jordan.hayes@dayflow.os"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              options={DEPARTMENTS}
            />
            <Input
              label="Designation / Role"
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              placeholder="e.g. Frontend Engineer"
              required
            />
          </div>

          <Input
            label="Monthly Base Salary ($)"
            type="number"
            value={newEmployee.salary}
            onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
            placeholder="8500"
            required
          />

          <div className="flex justify-end gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Employee Profile
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Employees;
