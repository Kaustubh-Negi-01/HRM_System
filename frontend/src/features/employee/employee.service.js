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
          name: 'Saksham Singh',
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
      const data = await apiClient.get(API_ENDPOINTS.EMPLOYEES.DETAIL(id));
      if (data) return data;
    } catch (err) {}

    const storedUser = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
    return {
      id: id || storedUser.id || 'emp_01',
      employeeId: storedUser.employeeId || 'EMP001',
      name: storedUser.name || 'Saksham Singh',
      email: storedUser.email || 'admin@dayflow.internal',
      department: storedUser.department || 'Human Resources',
      role: storedUser.role || 'admin',
      designation: storedUser.title || storedUser.profile?.designation || 'HR Director',
      phone: storedUser.phone || storedUser.profile?.phone || '+1 (555) 019-2831',
      address: storedUser.address || storedUser.profile?.address || '100 Innovation Way, Suite 400',
      joinDate: storedUser.profile?.joiningDate || '2023-01-15',
      status: 'active',
      salary: {
        baseSalary: 110000,
        allowances: 12000,
        deductions: 5000,
        netSalary: 117000,
      },
    };
  },

  async getOwnProfile() {
    try {
      const res = await apiClient.get(API_ENDPOINTS.EMPLOYEES.ME_PROFILE);
      if (res && (res.name || res.email || res.data)) {
        return res.data || res;
      }
    } catch (err) {}

    // Dynamic profile synchronized with currently logged in user session
    const storedUser = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
    const isAdmin = (storedUser.role || '').toLowerCase() === 'admin';
    return {
      id: storedUser.id || 'usr_current',
      employeeId: storedUser.employeeId || (isAdmin ? 'ADM001' : 'EMP001'),
      name: storedUser.name || (isAdmin ? 'Saksham Singh' : 'Alex Chen'),
      email: storedUser.email || (isAdmin ? 'admin@dayflow.internal' : 'alex.chen@dayflow.internal'),
      department: storedUser.department || (isAdmin ? 'Human Resources' : 'Engineering'),
      role: storedUser.role || (isAdmin ? 'admin' : 'employee'),
      designation:
        storedUser.title ||
        storedUser.profile?.designation ||
        (isAdmin ? 'HR Director' : 'Lead Fullstack Engineer'),
      phone: storedUser.phone || storedUser.profile?.phone || '+1 (555) 019-2831',
      address: storedUser.address || storedUser.profile?.address || '100 Innovation Way, Suite 400',
      joinDate: storedUser.profile?.joiningDate || '2023-01-15',
      avatarUrl: storedUser.avatarUrl,
      status: 'active',
    };
  },

  async updateEmployee(id, payload) {
    try {
      await apiClient.put(API_ENDPOINTS.EMPLOYEES.UPDATE_PROFILE(id), payload);
    } catch (err) {}

    // Update locally stored user profile
    const storedUser = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
    const updated = {
      ...storedUser,
      ...payload,
      profile: {
        ...(storedUser.profile || {}),
        ...payload,
      },
    };
    localStorage.setItem('dayflow_user', JSON.stringify(updated));
    return updated;
  },

  async createEmployee(payload) {
    return apiClient.post(API_ENDPOINTS.EMPLOYEES.CREATE, payload);
  },
};

export default employeeService;
