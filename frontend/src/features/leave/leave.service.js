import apiClient from '../../api/apiClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import supabase from '../../api/supabaseClient';

const STORAGE_KEY_PENDING = 'dayflow_pending_leaves';
const STORAGE_KEY_MY = 'dayflow_my_leaves';

const INITIAL_PENDING_APPROVALS = [
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

const INITIAL_MY_LEAVES = [
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

function getStoredLeaves(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return fallback;
}

function saveStoredLeaves(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

export const leaveService = {
  async applyLeave(leaveData) {
    const currentUser = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
    const newId = `req_${Date.now()}`;
    const newRecord = {
      id: newId,
      employeeId: currentUser.employeeId || 'EMP001',
      employeeName: currentUser.name || 'Alex Chen',
      department: currentUser.department || 'Engineering',
      role: currentUser.title || 'Lead Fullstack Engineer',
      leaveType: leaveData.leaveType || 'annual',
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      days: leaveData.days || 3,
      reason: leaveData.reason || 'Personal time off',
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
      impactScore: Math.floor(Math.random() * 40) + 40,
      impactRisk: 'moderate',
      overlapCount: 1,
    };

    // 1. Direct Supabase Cloud insert
    try {
      if (supabase && supabase.from) {
        await supabase.from('leave_requests').insert([
          {
            employee_id: newRecord.employeeId,
            leave_type: newRecord.leaveType,
            start_date: newRecord.startDate,
            end_date: newRecord.endDate,
            days: newRecord.days,
            reason: newRecord.reason,
            status: 'PENDING',
            impact_score: newRecord.impactScore,
            impact_risk: newRecord.impactRisk,
          },
        ]);
      }
    } catch (sbErr) {
      console.warn('[LeaveService] Supabase sync fallback:', sbErr.message);
    }

    // 2. API / LocalStorage sync
    try {
      await apiClient.post(API_ENDPOINTS.LEAVE.APPLY, leaveData);
    } catch (err) {}

    const myLeaves = getStoredLeaves(STORAGE_KEY_MY, INITIAL_MY_LEAVES);
    saveStoredLeaves(STORAGE_KEY_MY, [newRecord, ...myLeaves]);

    const pendingLeaves = getStoredLeaves(STORAGE_KEY_PENDING, INITIAL_PENDING_APPROVALS);
    saveStoredLeaves(STORAGE_KEY_PENDING, [newRecord, ...pendingLeaves]);

    window.dispatchEvent(new Event('dayflow_leave_updated'));
    return newRecord;
  },

  async getMyRequests() {
    try {
      if (supabase && supabase.from) {
        const { data, error } = await supabase
          .from('leave_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            leaveType: (d.leave_type || 'annual').toLowerCase(),
            startDate: d.start_date,
            endDate: d.end_date,
            days: d.days || 1,
            reason: d.reason || '—',
            status: (d.status || 'pending').toLowerCase(),
            appliedAt: d.created_at?.split('T')[0] || '2026-08-22',
          }));
        }
      }
    } catch (sbErr) {}

    try {
      const res = await apiClient.get(API_ENDPOINTS.LEAVE.MY_REQUESTS);
      if (Array.isArray(res) && res.length > 0) return res;
      if (Array.isArray(res?.data) && res.data.length > 0) return res.data;
    } catch (err) {}

    return getStoredLeaves(STORAGE_KEY_MY, INITIAL_MY_LEAVES);
  },

  async getMyBalance() {
    try {
      const res = await apiClient.get(API_ENDPOINTS.LEAVE.MY_BALANCE);
      if (res && res.annual) return res;
    } catch (err) {}
    return {
      annual: { total: 20, used: 8, remaining: 12 },
      sick: { total: 10, used: 2, remaining: 8 },
      casual: { total: 8, used: 3, remaining: 5 },
      unpaid: { total: 0, used: 0, remaining: 0 },
    };
  },

  async getPendingApprovals() {
    try {
      if (supabase && supabase.from) {
        const { data, error } = await supabase
          .from('leave_requests')
          .select('*')
          .eq('status', 'PENDING')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            employeeId: d.employee_id || 'EMP001',
            employeeName: d.employee_id === 'EMP004' ? 'Priya Sharma' : d.employee_id === 'EMP003' ? 'Marcus Vance' : 'Alex Chen',
            department: d.employee_id === 'EMP004' ? 'Customer Support' : 'Engineering',
            role: d.employee_id === 'EMP004' ? 'Support Operations Lead' : 'Engineer',
            leaveType: (d.leave_type || 'annual').toLowerCase(),
            startDate: d.start_date,
            endDate: d.end_date,
            days: d.days || 1,
            reason: d.reason || '—',
            status: 'pending',
            appliedAt: d.created_at?.split('T')[0] || '2026-08-22',
            impactScore: d.impact_score || 65,
            impactRisk: (d.impact_risk || 'moderate').toLowerCase(),
            overlapCount: 1,
          }));
        }
      }
    } catch (sbErr) {}

    try {
      const res = await apiClient.get(API_ENDPOINTS.LEAVE.PENDING_APPROVALS);
      if (Array.isArray(res) && res.length > 0) return res;
      if (Array.isArray(res?.data) && res.data.length > 0) return res.data;
    } catch (err) {}

    return getStoredLeaves(STORAGE_KEY_PENDING, INITIAL_PENDING_APPROVALS);
  },

  async getAllRequests(params = {}) {
    return this.getPendingApprovals();
  },

  async updateLeaveStatus(leaveId, status, comment = '') {
    // 1. Supabase Cloud update
    try {
      if (supabase && supabase.from) {
        await supabase
          .from('leave_requests')
          .update({ status: status.toUpperCase(), reviewed_by: 'Saksham Singh', reviewed_at: new Date().toISOString() })
          .eq('id', leaveId);
      }
    } catch (sbErr) {}

    // 2. Local store updates
    const pendingLeaves = getStoredLeaves(STORAGE_KEY_PENDING, INITIAL_PENDING_APPROVALS);
    saveStoredLeaves(
      STORAGE_KEY_PENDING,
      pendingLeaves.filter((r) => r.id !== leaveId)
    );

    const myLeaves = getStoredLeaves(STORAGE_KEY_MY, INITIAL_MY_LEAVES);
    saveStoredLeaves(
      STORAGE_KEY_MY,
      myLeaves.map((r) => (r.id === leaveId ? { ...r, status } : r))
    );

    window.dispatchEvent(new Event('dayflow_leave_updated'));
    return { success: true, id: leaveId, status };
  },
};

export default leaveService;
