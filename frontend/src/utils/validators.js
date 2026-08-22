export function validateEmail(email) {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Invalid email address';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateRequired(value, fieldName = 'This field') {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Both start and end dates are required';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) return 'End date cannot be before start date';
  return null;
}
