import apiClient from '../../api/apiClient';
import { API_ENDPOINTS } from '../../api/endpoints';

export const employeeService = {
  async getAllEmployees(params = {}) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.EMPLOYEES.LIST, params);
      return Array.isArray(data) ? data : data?.employees || data || [];
    } catch (err) {
      return [
        {
          id: '6a8955197071cef844c0d579',
          employeeId: 'ADM001',
          name: 'Hamza Khan',
          email: 'admin@dayflow.internal',
          department: 'Human Resources',
          role: 'admin',
          designation: 'HR Director',
          joinDate: '2023-01-15',
          status: 'active',
          location: 'San Francisco, CA',
        },
        {
          id: '6a8955197071cef844c0d580',
          employeeId: 'EMP001',
          name: 'Alex Chen',
          email: 'alex.chen@dayflow.internal',
          department: 'Engineering',
          role: 'employee',
          designation: 'Lead Fullstack Engineer',
          joinDate: '2023-03-01',
          status: 'active',
          location: 'San Francisco, CA',
        },
        {
          id: '6a8955197071cef844c0d581',
          employeeId: 'EMP002',
          name: 'Elena Rostova',
          email: 'elena.rostova@dayflow.internal',
          department: 'Engineering',
          role: 'employee',
          designation: 'Senior Backend Engineer',
          joinDate: '2023-05-15',
          status: 'active',
          location: 'Austin, TX',
        },
        {
          id: '6a8955197071cef844c0d582',
          employeeId: 'EMP003',
          name: 'Marcus Vance',
          email: 'marcus.vance@dayflow.internal',
          department: 'Engineering',
          role: 'employee',
          designation: 'Frontend Engineer',
          joinDate: '2023-08-01',
          status: 'active',
          location: 'Chicago, IL',
        },
        {
          id: '6a8955197071cef844c0d583',
          employeeId: 'EMP004',
          name: 'Priya Sharma',
          email: 'priya.sharma@dayflow.internal',
          department: 'Support',
          role: 'employee',
          designation: 'Support Team Lead',
          joinDate: '2023-02-10',
          status: 'active',
          location: 'Seattle, WA',
        },
      ];
    }
  },

  async getEmployeeById(id) {
    try {
      return await apiClient.get(API_ENDPOINTS.EMPLOYEES.DETAIL(id));
    } catch (err) {
      return {
        id: id || 'emp_01',
        employeeId: 'EMP001',
        name: 'Alex Chen',
        email: 'alex.chen@dayflow.internal',
        department: 'Engineering',
        role: 'employee',
        designation: 'Lead Fullstack Engineer',
        phone: '+1 (555) 014-9922',
        address: '240 Spear Street, San Francisco, CA',
        joinDate: '2023-03-01',
        status: 'active',
        salary: {
          baseSalary: 110000,
          allowances: 12000,
          deductions: 5000,
          netSalary: 117000,
        },
      };
    }
  },

  async getOwnProfile() {
    try {
      return await apiClient.get(API_ENDPOINTS.EMPLOYEES.ME_PROFILE);
    } catch (err) {
      return {
        id: 'usr_emp_01',
        employeeId: 'EMP001',
        name: 'Alex Chen',
        email: 'alex.chen@dayflow.internal',
        department: 'Engineering',
        role: 'employee',
        designation: 'Lead Fullstack Engineer',
        phone: '+1 (555) 014-9922',
        address: '240 Spear Street, San Francisco, CA',
        joinDate: '2023-03-01',
        status: 'active',
      };
    }
  },

  async updateEmployee(id, payload) {
    return apiClient.put(API_ENDPOINTS.EMPLOYEES.UPDATE_PROFILE(id), payload);
  },

  async createEmployee(payload) {
    return apiClient.post(API_ENDPOINTS.EMPLOYEES.CREATE, payload);
  },
};

export default employeeService;
