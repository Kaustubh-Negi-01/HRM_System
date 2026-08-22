import { ROLES } from './constants';

export function isAdmin(user) {
  return user?.role === ROLES.ADMIN || user?.role === ROLES.HR;
}

export function isManager(user) {
  return user?.role === ROLES.MANAGER || isAdmin(user);
}

export function canManageEmployees(user) {
  return isAdmin(user);
}

export function canApproveLeave(user) {
  return isAdmin(user) || user?.role === ROLES.MANAGER;
}

export function canManagePayroll(user) {
  return user?.role === ROLES.ADMIN || user?.role === ROLES.HR;
}

export function canAccessCopilot(user) {
  return isAdmin(user) || user?.role === ROLES.MANAGER;
}
