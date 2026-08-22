const Payroll = require('../models/Payroll');
const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');

const getMePayroll = async (employeeId) => {
  let payroll = await Payroll.findOne({ employeeId });
  if (!payroll) {
    // If none exists, create default
    payroll = await Payroll.create({
      employeeId,
      basicSalary: 50000,
      allowances: 5000,
      deductions: 2000
    });
  }
  return payroll;
};

const getAllPayroll = async () => {
  const users = await User.find();
  const employeeIds = users.map((u) => u.employeeId);

  const payrolls = await Payroll.find({ employeeId: { $in: employeeIds } });
  const profiles = await EmployeeProfile.find({ employeeId: { $in: employeeIds } });

  const payrollMap = new Map(payrolls.map((p) => [p.employeeId, p]));
  const profileMap = new Map(profiles.map((p) => [p.employeeId, p]));

  return users.map((u) => {
    let p = payrollMap.get(u.employeeId);
    const prof = profileMap.get(u.employeeId);
    return {
      employeeId: u.employeeId,
      name: u.name,
      department: u.department,
      designation: prof ? prof.designation : 'Associate',
      basicSalary: p ? p.basicSalary : 50000,
      allowances: p ? p.allowances : 5000,
      deductions: p ? p.deductions : 2000,
      netSalary: p ? p.netSalary : 53000,
      updatedAt: p ? p.updatedAt : u.createdAt
    };
  });
};

const updatePayroll = async (employeeId, { basicSalary, allowances, deductions }) => {
  let payroll = await Payroll.findOne({ employeeId: employeeId.toUpperCase() });

  if (!payroll) {
    payroll = new Payroll({ employeeId: employeeId.toUpperCase() });
  }

  if (basicSalary !== undefined) payroll.basicSalary = Number(basicSalary);
  if (allowances !== undefined) payroll.allowances = Number(allowances);
  if (deductions !== undefined) payroll.deductions = Number(deductions);

  await payroll.save();
  return payroll;
};

module.exports = {
  getMePayroll,
  getAllPayroll,
  updatePayroll
};
