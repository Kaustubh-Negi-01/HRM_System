const mongoose = require('mongoose');

/**
 * A monthly payroll run snapshot for one employee.
 * Config-level salary lives in Payroll; PayrollRun stores what was actually
 * disbursed for a given cycle, including attendance-derived adjustments.
 */
const payrollRunSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      uppercase: true,
      trim: true,
      index: true
    },
    month: {
      type: String, // Format: YYYY-MM
      required: [true, 'Payroll month is required'],
      index: true
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0
    },
    bonus: {
      type: Number,
      default: 0,
      min: 0
    },
    unpaidLeaveDeduction: {
      type: Number,
      default: 0,
      min: 0
    },
    absentDeduction: {
      type: Number,
      default: 0,
      min: 0
    },
    otherDeductions: {
      type: Number,
      default: 0,
      min: 0
    },
    grossSalary: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    netSalary: {
      type: Number,
      default: 0
    },
    workingDays: {
      type: Number,
      default: 0
    },
    paidDays: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PROCESSING', 'PAID', 'FAILED'],
      default: 'PROCESSING'
    },
    generatedBy: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.status = String(ret.status || '').toLowerCase();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// One run per employee per month
payrollRunSchema.index({ employeeId: 1, month: 1 }, { unique: true });

// Compute derived amounts before save
payrollRunSchema.pre('save', function (next) {
  this.grossSalary = Number(
    ((this.baseSalary || 0) + (this.allowances || 0) + (this.bonus || 0)).toFixed(2)
  );
  // Simple flat tax approximation: 10% of gross (hackathon demo scale)
  this.taxes = Number((this.grossSalary * 0.1).toFixed(2));
  const totalDeductions =
    (this.unpaidLeaveDeduction || 0) +
    (this.absentDeduction || 0) +
    (this.otherDeductions || 0);
  this.netSalary = Number(Math.max(0, this.grossSalary - totalDeductions - this.taxes).toFixed(2));
  next();
});

const PayrollRun = mongoose.model('PayrollRun', payrollRunSchema);
module.exports = PayrollRun;
