const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const Payroll = require('../models/Payroll');
const { ROLES, ATTENDANCE_STATUS, LEAVE_TYPE, LEAVE_STATUS } = require('../utils/constants');
const { formatDate } = require('../utils/calculations');

const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('[Seed] Connecting to MongoDB...');
      await mongoose.connect(env.MONGO_URI);
    }
    console.log('[Seed] Connected. Clearing existing collections...');

    await User.deleteMany({});
    await EmployeeProfile.deleteMany({});
    await Attendance.deleteMany({});
    await LeaveRequest.deleteMany({});
    await Payroll.deleteMany({});

    console.log('[Seed] Generating password hashes...');
    const defaultPasswordHash = await User.hashPassword('Password123!');

    // 1. Create Users (10 users across 4 departments)
    console.log('[Seed] Creating users...');
    const usersData = [
      {
        employeeId: 'ADM001',
        name: 'Hamza Khan',
        email: 'admin@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.ADMIN,
        department: 'Human Resources'
      },
      {
        employeeId: 'EMP001',
        name: 'Alex Chen',
        email: 'alex.chen@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.EMPLOYEE,
        department: 'Engineering'
      },
      {
        employeeId: 'EMP002',
        name: 'Elena Rostova',
        email: 'elena.rostova@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.EMPLOYEE,
        department: 'Engineering'
      },
      {
        employeeId: 'EMP003',
        name: 'Marcus Vance',
        email: 'marcus.vance@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.EMPLOYEE,
        department: 'Engineering'
      },
      {
        employeeId: 'EMP004',
        name: 'Priya Sharma',
        email: 'priya.sharma@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.EMPLOYEE,
        department: 'Support'
      },
      {
        employeeId: 'EMP005',
        name: 'David Kim',
        email: 'david.kim@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.EMPLOYEE,
        department: 'Support'
      },
      {
        employeeId: 'EMP006',
        name: 'Amina Diallo',
        email: 'amina.diallo@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.EMPLOYEE,
        department: 'Support'
      },
      {
        employeeId: 'EMP007',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.EMPLOYEE,
        department: 'Human Resources'
      },
      {
        employeeId: 'EMP008',
        name: 'Ryan Patel',
        email: 'ryan.patel@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.EMPLOYEE,
        department: 'Product'
      },
      {
        employeeId: 'EMP009',
        name: 'Zoe Martinez',
        email: 'zoe.martinez@dayflow.internal',
        passwordHash: defaultPasswordHash,
        role: ROLES.EMPLOYEE,
        department: 'Product'
      }
    ];

    const users = await User.insertMany(usersData);
    const userMap = new Map(users.map((u) => [u.employeeId, u]));

    // 2. Create Employee Profiles
    console.log('[Seed] Creating employee profiles...');
    const profilesData = [
      {
        userId: userMap.get('ADM001')._id,
        employeeId: 'ADM001',
        designation: 'HR Director',
        phone: '+1 (555) 019-2831',
        address: '100 Innovation Way, Suite 400',
        joiningDate: new Date('2023-01-15')
      },
      {
        userId: userMap.get('EMP001')._id,
        employeeId: 'EMP001',
        designation: 'Staff Full Stack Engineer',
        phone: '+1 (555) 012-3456',
        address: '42 Silicon Avenue, Apt 3B',
        joiningDate: new Date('2023-03-01')
      },
      {
        userId: userMap.get('EMP002')._id,
        employeeId: 'EMP002',
        designation: 'Frontend Lead',
        phone: '+1 (555) 013-4567',
        address: '77 Telegraph Hill, San Francisco',
        joiningDate: new Date('2023-05-10')
      },
      {
        userId: userMap.get('EMP003')._id,
        employeeId: 'EMP003',
        designation: 'Cloud Platform Engineer',
        phone: '+1 (555) 014-5678',
        address: '808 Tech Park Drive',
        joiningDate: new Date('2023-08-20')
      },
      {
        userId: userMap.get('EMP004')._id,
        employeeId: 'EMP004',
        designation: 'Senior Support Specialist',
        phone: '+1 (555) 015-6789',
        address: '12 Mission District Blvd',
        joiningDate: new Date('2023-09-01')
      },
      {
        userId: userMap.get('EMP005')._id,
        employeeId: 'EMP005',
        designation: 'Customer Support Lead',
        phone: '+1 (555) 016-7890',
        address: '304 Market Street',
        joiningDate: new Date('2023-02-15')
      },
      {
        userId: userMap.get('EMP006')._id,
        employeeId: 'EMP006',
        designation: 'Customer Support Agent',
        phone: '+1 (555) 017-8901',
        address: '55 Ocean View Ave',
        joiningDate: new Date('2024-01-10')
      },
      {
        userId: userMap.get('EMP007')._id,
        employeeId: 'EMP007',
        designation: 'People Operations Manager',
        phone: '+1 (555) 018-1234',
        address: '900 Pine Valley Rd',
        joiningDate: new Date('2023-06-12')
      },
      {
        userId: userMap.get('EMP008')._id,
        employeeId: 'EMP008',
        designation: 'Principal Product Manager',
        phone: '+1 (555) 019-5678',
        address: '210 Columbus Ave',
        joiningDate: new Date('2023-04-18')
      },
      {
        userId: userMap.get('EMP009')._id,
        employeeId: 'EMP009',
        designation: 'Lead UI/UX Designer',
        phone: '+1 (555) 020-9012',
        address: '150 Greenwich St',
        joiningDate: new Date('2023-11-05')
      }
    ];

    await EmployeeProfile.insertMany(profilesData);

    // 3. Create Payroll
    console.log('[Seed] Creating payroll records...');
    const payrollData = [
      { employeeId: 'ADM001', basicSalary: 110000, allowances: 15000, deductions: 5000 },
      { employeeId: 'EMP001', basicSalary: 95000, allowances: 8000, deductions: 4000 },
      { employeeId: 'EMP002', basicSalary: 90000, allowances: 7500, deductions: 3500 },
      { employeeId: 'EMP003', basicSalary: 82000, allowances: 6000, deductions: 3000 },
      { employeeId: 'EMP004', basicSalary: 62000, allowances: 4000, deductions: 2000 },
      { employeeId: 'EMP005', basicSalary: 70000, allowances: 5000, deductions: 2500 },
      { employeeId: 'EMP006', basicSalary: 52000, allowances: 3000, deductions: 1500 },
      { employeeId: 'EMP007', basicSalary: 78000, allowances: 5000, deductions: 2800 },
      { employeeId: 'EMP008', basicSalary: 98000, allowances: 8500, deductions: 4200 },
      { employeeId: 'EMP009', basicSalary: 84000, allowances: 6500, deductions: 3200 }
    ];

    for (const p of payrollData) {
      await Payroll.create(p); // trigger pre-save hook for netSalary
    }

    // 4. Create Historical Attendance (Past 7 days up to today)
    console.log('[Seed] Creating attendance history...');
    const today = new Date();
    const attendanceRecords = [];

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const d = new Date(today);
      d.setDate(d.getDate() - dayOffset);
      const dateStr = formatDate(d);

      // Engineering team
      attendanceRecords.push({
        employeeId: 'EMP001',
        date: dateStr,
        checkIn: new Date(`${dateStr}T09:02:00Z`),
        checkOut: new Date(`${dateStr}T17:35:00Z`),
        status: ATTENDANCE_STATUS.PRESENT,
        workHours: 8.5
      });

      attendanceRecords.push({
        employeeId: 'EMP002',
        date: dateStr,
        checkIn: new Date(`${dateStr}T09:15:00Z`),
        checkOut: new Date(`${dateStr}T17:45:00Z`),
        status: ATTENDANCE_STATUS.PRESENT,
        workHours: 8.5
      });

      attendanceRecords.push({
        employeeId: 'EMP003',
        date: dateStr,
        checkIn: dayOffset === 2 ? null : new Date(`${dateStr}T09:30:00Z`),
        checkOut: dayOffset === 2 ? null : new Date(`${dateStr}T18:00:00Z`),
        status: dayOffset === 2 ? ATTENDANCE_STATUS.ABSENT : ATTENDANCE_STATUS.PRESENT,
        workHours: dayOffset === 2 ? 0 : 8.5
      });

      // Support team (David Kim on approved leave recent 3 days)
      if (dayOffset <= 2) {
        attendanceRecords.push({
          employeeId: 'EMP005',
          date: dateStr,
          checkIn: null,
          checkOut: null,
          status: ATTENDANCE_STATUS.LEAVE,
          workHours: 0
        });
      } else {
        attendanceRecords.push({
          employeeId: 'EMP005',
          date: dateStr,
          checkIn: new Date(`${dateStr}T08:50:00Z`),
          checkOut: new Date(`${dateStr}T17:00:00Z`),
          status: ATTENDANCE_STATUS.PRESENT,
          workHours: 8.1
        });
      }

      attendanceRecords.push({
        employeeId: 'EMP004',
        date: dateStr,
        checkIn: new Date(`${dateStr}T09:05:00Z`),
        checkOut: dayOffset === 0 ? null : new Date(`${dateStr}T17:30:00Z`),
        status: ATTENDANCE_STATUS.PRESENT,
        workHours: dayOffset === 0 ? 0 : 8.4
      });

      attendanceRecords.push({
        employeeId: 'EMP006',
        date: dateStr,
        checkIn: new Date(`${dateStr}T08:55:00Z`),
        checkOut: dayOffset === 0 ? null : new Date(`${dateStr}T17:15:00Z`),
        status: ATTENDANCE_STATUS.PRESENT,
        workHours: dayOffset === 0 ? 0 : 8.3
      });

      // Human Resources team
      attendanceRecords.push({
        employeeId: 'EMP007',
        date: dateStr,
        checkIn: new Date(`${dateStr}T09:00:00Z`),
        checkOut: dayOffset === 0 ? null : new Date(`${dateStr}T17:00:00Z`),
        status: ATTENDANCE_STATUS.PRESENT,
        workHours: dayOffset === 0 ? 0 : 8.0
      });

      // Product team
      attendanceRecords.push({
        employeeId: 'EMP008',
        date: dateStr,
        checkIn: new Date(`${dateStr}T09:20:00Z`),
        checkOut: dayOffset === 0 ? null : new Date(`${dateStr}T17:50:00Z`),
        status: ATTENDANCE_STATUS.PRESENT,
        workHours: dayOffset === 0 ? 0 : 8.5
      });

      attendanceRecords.push({
        employeeId: 'EMP009',
        date: dateStr,
        checkIn: new Date(`${dateStr}T09:10:00Z`),
        checkOut: dayOffset === 0 ? null : new Date(`${dateStr}T17:40:00Z`),
        status: ATTENDANCE_STATUS.PRESENT,
        workHours: dayOffset === 0 ? 0 : 8.5
      });
    }

    await Attendance.insertMany(attendanceRecords);

    // 5. Create Leave Requests (Multiple Approved & Multiple Pending)
    console.log('[Seed] Creating leave requests...');
    const leaveStartDate = formatDate(today);
    const leaveEndDate = formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));

    // David's approved leave in Support (Already unavailable)
    const approvedLeave1 = await LeaveRequest.create({
      employeeId: 'EMP005',
      leaveType: LEAVE_TYPE.PAID,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      reason: 'Family emergency and personal travel.',
      status: LEAVE_STATUS.APPROVED,
      hrComment: 'Approved as per support schedule coverage.',
      reviewedBy: 'Hamza Khan',
      reviewedAt: new Date()
    });

    // Elena's approved leave in Engineering (Scheduled for next week)
    const approvedLeave2 = await LeaveRequest.create({
      employeeId: 'EMP002',
      leaveType: LEAVE_TYPE.PAID,
      startDate: formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
      endDate: formatDate(new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)),
      reason: 'Annual vacation time off.',
      status: LEAVE_STATUS.APPROVED,
      hrComment: 'Approved. Advance notice provided.',
      reviewedBy: 'Hamza Khan',
      reviewedAt: new Date()
    });

    // Priya's pending leave in Support (Triggers HIGH RISK Smart Leave Impact!)
    // Support has 3 members. David is approved on same dates.
    // If Priya is approved -> 2 out of 3 absent -> coverage drops to 33.3% (< 60% critical threshold)!
    const highRiskLeave = await LeaveRequest.create({
      employeeId: 'EMP004',
      leaveType: LEAVE_TYPE.SICK,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      reason: 'Medical procedure and recovery.',
      status: LEAVE_STATUS.PENDING
    });

    // Marcus's pending leave in Engineering (Low Risk)
    const lowRiskLeave = await LeaveRequest.create({
      employeeId: 'EMP003',
      leaveType: LEAVE_TYPE.PAID,
      startDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      endDate: formatDate(new Date(Date.now() + 9 * 24 * 60 * 60 * 1000)),
      reason: 'Attending annual DevOps tech summit.',
      status: LEAVE_STATUS.PENDING
    });

    // Zoe's pending leave in Product (Medium Risk: Product team has 2 members, dropping from 100% to 50%)
    const mediumRiskLeave = await LeaveRequest.create({
      employeeId: 'EMP009',
      leaveType: LEAVE_TYPE.PAID,
      startDate: formatDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)),
      endDate: formatDate(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)),
      reason: 'Personal leave for family event.',
      status: LEAVE_STATUS.PENDING
    });

    console.log('\n==================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('==================================================');
    console.log('Admin Account:');
    console.log('  Email:    admin@dayflow.internal');
    console.log('  Password: Password123!');
    console.log('  Role:     ADMIN\n');
    console.log('Employee Accounts (Password: Password123!):');
    console.log('  EMP001: alex.chen@dayflow.internal    (Engineering)');
    console.log('  EMP002: elena.rostova@dayflow.internal(Engineering - Approved Leave Next Week)');
    console.log('  EMP003: marcus.vance@dayflow.internal (Engineering - Low Risk Pending Leave)');
    console.log('  EMP004: priya.sharma@dayflow.internal (Support - HIGH RISK Pending Leave)');
    console.log('  EMP005: david.kim@dayflow.internal    (Support - Active Approved Leave)');
    console.log('  EMP006: amina.diallo@dayflow.internal (Support)');
    console.log('  EMP007: sarah.jenkins@dayflow.internal(Human Resources)');
    console.log('  EMP008: ryan.patel@dayflow.internal   (Product)');
    console.log('  EMP009: zoe.martinez@dayflow.internal (Product - Medium Risk Pending Leave)\n');
    console.log(`High Risk Leave ID for Smart Leave Impact: ${highRiskLeave._id}`);
    console.log(`Medium Risk Leave ID: ${mediumRiskLeave._id}`);
    console.log('==================================================\n');

    if (require.main === module) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Seeding failed:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
