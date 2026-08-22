export function calculateAttendanceStats(records = []) {
  if (!records.length) {
    return { presentRate: 0, totalHours: 0, lateCount: 0, absentCount: 0 };
  }

  let present = 0;
  let late = 0;
  let absent = 0;
  let totalHours = 0;

  records.forEach((rec) => {
    if (rec.status === 'present') present++;
    if (rec.status === 'late') {
      present++;
      late++;
    }
    if (rec.status === 'absent') absent++;
    if (rec.hours) totalHours += Number(rec.hours);
  });

  const presentRate = Math.round((present / records.length) * 100);

  return {
    presentRate,
    totalHours: Number(totalHours.toFixed(1)),
    lateCount: late,
    absentCount: absent,
    averageDailyHours: Number((totalHours / (present || 1)).toFixed(1)),
  };
}
