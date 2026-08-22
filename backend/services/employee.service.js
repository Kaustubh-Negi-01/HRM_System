const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Payroll = require('../models/Payroll');

const getAllEmployees = async (filters = {}) => {
  const query = {};
  if (filters.department) {
    query.department = filters.department;
  }
  if (filters.role) {
    query.role = filters.role;
  }

  const users = await User.find(query).sort({ createdAt: -1 });
  const employeeIds = users.map((u) => u.employeeId);

  const profiles = await EmployeeProfile.find({ employeeId: { $in: employeeIds } });
  const payrolls = await Payroll.find({ employeeId: { $in: employeeIds } });

  const profileMap = new Map(profiles.map((p) => [p.employeeId, p]));
  const payrollMap = new Map(payrolls.map((p) => [p.employeeId, p]));

  return users.map((u) => {
    const p = profileMap.get(u.employeeId);
    const pay = payrollMap.get(u.employeeId);
    return {
      id: u._id,
      employeeId: u.employeeId,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      createdAt: u.createdAt,
      profile: p || null,
      payroll: pay || null
    };
  });
};

const getEmployeeById = async (idOrEmployeeId) => {
  let user = null;
  if (idOrEmployeeId.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findById(idOrEmployeeId);
  }
  if (!user) {
    user = await User.findOne({ employeeId: idOrEmployeeId.toUpperCase() });
  }

  if (!user) {
    const err = new Error('Employee not found.');
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }

  const profile = await EmployeeProfile.findOne({ employeeId: user.employeeId });
  const payroll = await Payroll.findOne({ employeeId: user.employeeId });

  return {
    id: user._id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    createdAt: user.createdAt,
    profile: profile || null,
    payroll: payroll || null
  };
};

const updateEmployee = async (idOrEmployeeId, updateData) => {
  let user = null;
  if (idOrEmployeeId.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findById(idOrEmployeeId);
  }
  if (!user) {
    user = await User.findOne({ employeeId: idOrEmployeeId.toUpperCase() });
  }

  if (!user) {
    const err = new Error('Employee not found.');
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }

  // Update user fields
  if (updateData.name) user.name = updateData.name;
  if (updateData.department) user.department = updateData.department;
  if (updateData.role) user.role = updateData.role;
  await user.save();

  // Update or create profile fields
  let profile = await EmployeeProfile.findOne({ employeeId: user.employeeId });
  if (!profile) {
    profile = new EmployeeProfile({
      userId: user._id,
      employeeId: user.employeeId,
      designation: updateData.designation || 'Associate'
    });
  }

  if (updateData.designation) profile.designation = updateData.designation;
  if (updateData.phone !== undefined) profile.phone = updateData.phone;
  if (updateData.address !== undefined) profile.address = updateData.address;
  if (updateData.profilePicture !== undefined) profile.profilePicture = updateData.profilePicture;
  await profile.save();

  return getEmployeeById(user._id.toString());
};

const getEmployeeProfile = async (idOrEmployeeId) => {
  const emp = await getEmployeeById(idOrEmployeeId);
  return emp.profile;
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  getEmployeeProfile
};
