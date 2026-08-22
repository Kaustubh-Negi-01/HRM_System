const mongoose = require('mongoose');
const { LEAVE_TYPE, LEAVE_STATUS } = require('../utils/constants');
const { mapLeaveStatus, mapLeaveType } = require('../utils/dialect');

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      uppercase: true,
      trim: true,
      index: true
    },
    leaveType: {
      type: String,
      enum: Object.values(LEAVE_TYPE),
      required: [true, 'Leave type is required']
    },
    startDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Start date is required']
    },
    endDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'End date is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(LEAVE_STATUS),
      default: LEAVE_STATUS.PENDING,
      index: true
    },
    hrComment: {
      type: String,
      default: '',
      trim: true
    },
    reviewedBy: {
      type: String,
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.status = mapLeaveStatus(ret.status);
        ret.leaveType = mapLeaveType(ret.leaveType);
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;
