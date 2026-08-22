const mongoose = require('mongoose');

const employeeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    address: {
      type: String,
      default: '',
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    profilePicture: {
      type: String,
      default: ''
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

const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema);
module.exports = EmployeeProfile;
