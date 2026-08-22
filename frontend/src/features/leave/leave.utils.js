export function calculateDaysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

export function getLeaveTypeColor(type) {
  switch (type) {
    case 'annual': return 'var(--primary)';
    case 'sick': return 'var(--danger)';
    case 'casual': return 'var(--pulse-cyan)';
    case 'maternity':
    case 'paternity': return 'var(--info)';
    default: return 'var(--warning)';
  }
}
