const jwt = require('jsonwebtoken');
const { mapRole } = require('../utils/dialect');
const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Payroll = require('../models/Payroll');
const env = require('../config/env');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      employeeId: user.employeeId,
      role: mapRole(user.role),
      department: user.department
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

const signup = async ({ employeeId, name, email, password, role, department, designation, phone, address }) => {
  // Check if email or employeeId exists
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { employeeId: employeeId.toUpperCase() }]
  });

  if (existingUser) {
    const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Employee ID';
    const err = new Error(`${field} is already registered.`);
    err.code = 'DUPLICATE_RESOURCE';
    err.status = 409;
    throw err;
  }

  const passwordHash = await User.hashPassword(password);

  const user = await User.create({
    employeeId: employeeId.toUpperCase(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: role || 'EMPLOYEE',
    department
  });

  // Create associated profile
  const profile = await EmployeeProfile.create({
    userId: user._id,
    employeeId: user.employeeId,
    designation: designation || 'Associate',
    phone: phone || '',
    address: address || '',
    joiningDate: new Date()
  });

  // Create default payroll
  await Payroll.create({
    employeeId: user.employeeId,
    basicSalary: 50000,
    allowances: 5000,
    deductions: 2000
  });

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: mapRole(user.role),
      department: user.department,
      profile: {
        designation: profile.designation,
        phone: profile.phone,
        address: profile.address,
        joiningDate: profile.joiningDate
      }
    },
    token
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.code = 'INVALID_CREDENTIALS';
    err.status = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.code = 'INVALID_CREDENTIALS';
    err.status = 401;
    throw err;
  }

  const profile = await EmployeeProfile.findOne({ employeeId: user.employeeId });
  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: mapRole(user.role),
      department: user.department,
      profile: profile
        ? {
            designation: profile.designation,
            phone: profile.phone,
            address: profile.address,
            joiningDate: profile.joiningDate,
            profilePicture: profile.profilePicture
          }
        : null
    },
    token
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found.');
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
    role: mapRole(user.role),
    department: user.department,
    createdAt: user.createdAt,
    profile: profile || null,
    payroll: payroll || null
  };
};

module.exports = {
  signup,
  login,
  getMe
};
