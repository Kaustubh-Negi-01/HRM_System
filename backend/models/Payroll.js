const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: [0, 'Basic salary must be non-negative'],
      default: 0
    },
    allowances: {
      type: Number,
      min: [0, 'Allowances must be non-negative'],
      default: 0
    },
    deductions: {
      type: Number,
      min: [0, 'Deductions must be non-negative'],
      default: 0
    },
    netSalary: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Pre-save hook to calculate netSalary
payrollSchema.pre('save', function (next) {
  this.netSalary = Math.max(0, (this.basicSalary || 0) + (this.allowances || 0) - (this.deductions || 0));
  next();
});

const Payroll = mongoose.model('Payroll', payrollSchema);
module.exports = Payroll;
