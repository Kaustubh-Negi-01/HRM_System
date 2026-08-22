import apiClient from '../../api/apiClient';
import { API_ENDPOINTS } from '../../api/endpoints';

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
      return await apiClient.get(API_ENDPOINTS.LEAVE.MY_REQUESTS);
    } catch (err) {
      return [
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
    }
  },

  async getMyBalance() {
    try {
      return await apiClient.get(API_ENDPOINTS.LEAVE.MY_BALANCE);
    } catch (err) {
      return {
        annual: { total: 20, used: 6, remaining: 14 },
        sick: { total: 10, used: 2, remaining: 8 },
        casual: { total: 8, used: 1, remaining: 7 },
        unpaid: { used: 0 },
      };
    }
  },

  async getPendingApprovals() {
    try {
      return await apiClient.get(API_ENDPOINTS.LEAVE.PENDING_APPROVALS);
    } catch (err) {
      return [
        {
          id: 'req_101',
          employeeId: 'emp_01',
          employeeName: 'Alex Mercer',
          department: 'Engineering',
          role: 'Senior Fullstack Engineer',
          leaveType: 'annual',
          startDate: '2026-09-01',
          endDate: '2026-09-04',
          days: 4,
          reason: 'Family vacation & recharge',
          status: 'pending',
          appliedAt: '2026-08-20',
          impactScore: 78,
          impactRisk: 'moderate',
          overlapCount: 2,
          backupAssigned: 'David Miller',
        },
        {
          id: 'req_102',
          employeeId: 'emp_04',
          employeeName: 'Elena Rostova',
          department: 'Product & Design',
          role: 'Lead UI/UX Designer',
          leaveType: 'casual',
          startDate: '2026-08-28',
          endDate: '2026-08-29',
          days: 2,
          reason: 'Personal emergency',
          status: 'pending',
          appliedAt: '2026-08-21',
          impactScore: 25,
          impactRisk: 'low',
          overlapCount: 0,
          backupAssigned: 'Santhosh K.',
        },
        {
          id: 'req_103',
          employeeId: 'emp_03',
          employeeName: 'David Miller',
          department: 'Engineering',
          role: 'DevOps Lead',
          leaveType: 'annual',
          startDate: '2026-09-02',
          endDate: '2026-09-08',
          days: 5,
          reason: 'Relocation & travel',
          status: 'pending',
          appliedAt: '2026-08-21',
          impactScore: 92,
          impactRisk: 'critical',
          overlapCount: 3,
          backupAssigned: 'None',
        },
      ];
    }
  },

  async updateLeaveStatus(id, status, notes = '') {
    try {
      return await apiClient.patch(API_ENDPOINTS.LEAVE.UPDATE_STATUS(id), { status, notes });
    } catch (err) {
      return { id, status, notes, updatedAt: new Date().toISOString() };
    }
  },
};

export default leaveService;
