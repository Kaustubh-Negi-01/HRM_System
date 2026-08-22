/**
 * Calculations and Date helper functions
 */

/**
 * Format a date object or string into YYYY-MM-DD
 */
function formatDate(dateInput = new Date()) {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate the number of calendar days between two dates inclusive
 */
function getDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Check if two date ranges overlap
 */
function dateRangesOverlap(startA, endA, startB, endB) {
  const sA = new Date(startA).setHours(0, 0, 0, 0);
  const eA = new Date(endA).setHours(23, 59, 59, 999);
  const sB = new Date(startB).setHours(0, 0, 0, 0);
  const eB = new Date(endB).setHours(23, 59, 59, 999);

  return sA <= eB && sB <= eA;
}

/**
 * Safely compute percentage (0-100) rounded to 1 decimal place or whole integer
 */
function safePercentage(numerator, denominator, decimals = 0) {
  if (!denominator || denominator <= 0) return 0;
  const val = (numerator / denominator) * 100;
  return Number(val.toFixed(decimals));
}

module.exports = {
  formatDate,
  getDaysBetween,
  dateRangesOverlap,
  safePercentage
};
