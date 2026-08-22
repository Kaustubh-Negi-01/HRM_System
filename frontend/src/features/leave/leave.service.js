import apiClient from '../../api/apiClient';
import { API_ENDPOINTS } from '../../api/endpoints';

const DEFAULT_MY_LEAVES = [
  {
    id: 'l1',
    leaveType: 'annual',
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    days: 4,
    reason: 'Family vacation & recharge',
    status: 'pending',
    appliedAt: '2026-08-20',
  },
  {
    id: 'l2',
    leaveType: 'sick',
    startDate: '2026-07-12',
    endDate: '2026-07-13',
    days: 2,
    reason: 'Viral fever & doctor rest',
    status: 'approved',
    appliedAt: '2026-07-11',
  },
  {
    id: 'l3',
    leaveType: 'casual',
    startDate: '2026-06-05',
    endDate: '2026-06-05',
    days: 1,
    reason: 'Personal paperwork at city office',
    status: 'approved',
    appliedAt: '2026-06-01',
  },
];

const DEFAULT_PENDING_APPROVALS = [
  {
    id: 'req_101',
    employeeId: 'EMP004',
    employeeName: 'Priya Sharma',
    department: 'Customer Support',
    role: 'Support Operations Lead',
    leaveType: 'annual',
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    days: 4,
    reason: 'Family emergency and personal travel',
    status: 'pending',
    appliedAt: '2026-08-20',
    impactScore: 88,
    impactRisk: 'critical',
    overlapCount: 2,
  },
  {
    id: 'req_102',
    employeeId: 'EMP003',
    employeeName: 'Marcus Vance',
    department: 'Engineering',
    role: 'DevOps Specialist',
    leaveType: 'casual',
    startDate: '2026-09-02',
    endDate: '2026-09-05',
    days: 4,
    reason: 'Personal relocation',
    status: 'pending',
    appliedAt: '2026-08-21',
    impactScore: 78,
    impactRisk: 'moderate',
    overlapCount: 1,
  },
  {
    id: 'req_103',
    employeeId: 'EMP009',
    employeeName: 'Zoe Martinez',
    department: 'Product & Design',
    role: 'Lead UI/UX Designer',
    leaveType: 'casual',
    startDate: '2026-08-28',
    endDate: '2026-08-29',
    days: 2,
    reason: 'Personal appointments',
    status: 'pending',
    appliedAt: '2026-08-21',
    impactScore: 25,
    impactRisk: 'low',
    overlapCount: 0,
  },
];

export const leaveService = {
  async applyLeave(leaveData) {
    try {
      return await apiClient.post(API_ENDPOINTS.LEAVE.APPLY, leaveData);
    } catch (err) {
      return {
        id: `leave_${Date.now()}`,
        ...leaveData,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };
    }
  },

  async getMyRequests() {
    try {
      const res = await apiClient.get(API_ENDPOINTS.LEAVE.MY_REQUESTS);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.leaves)) return res.leaves;
      if (Array.isArray(res?.requests)) return res.requests;
      return DEFAULT_MY_LEAVES;
    } catch (err) {
      return DEFAULT_MY_LEAVES;
    }
  },

  async getMyBalance() {
    try {
      return await apiClient.get(API_ENDPOINTS.LEAVE.MY_BALANCE);
    } catch (err) {
      return {
        annual: { total: 20, used: 8, remaining: 12 },
        sick: { total: 10, used: 2, remaining: 8 },
        casual: { total: 8, used: 3, remaining: 5 },
        unpaid: { total: 0, used: 0, remaining: 0 },
      };
    }
  },

  async getPendingApprovals() {
    try {
      const res = await apiClient.get(API_ENDPOINTS.LEAVE.PENDING_APPROVALS);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.leaves)) return res.leaves;
      if (Array.isArray(res?.requests)) return res.requests;
      return DEFAULT_PENDING_APPROVALS;
    } catch (err) {
      return DEFAULT_PENDING_APPROVALS;
    }
  },

  async getAllRequests(params = {}) {
    try {
      const res = await apiClient.get(API_ENDPOINTS.LEAVE.ALL_REQUESTS, params);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.leaves)) return res.leaves;
      if (Array.isArray(res?.requests)) return res.requests;
      return DEFAULT_PENDING_APPROVALS;
    } catch (err) {
      return DEFAULT_PENDING_APPROVALS;
    }
  },

  async updateLeaveStatus(leaveId, status, comment = '') {
    try {
      return await apiClient.put(API_ENDPOINTS.LEAVE.UPDATE_STATUS(leaveId), { status, comment });
    } catch (err) {
      return { success: true, id: leaveId, status };
    }
  },
};

export default leaveService;
