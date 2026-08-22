const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/check-in', authenticate, attendanceController.checkIn);
router.post('/check-out', authenticate, attendanceController.checkOut);
router.get('/me', authenticate, attendanceController.getMeAttendance);
router.get('/team', authenticate, attendanceController.getTeamAttendance);
router.get('/today', authenticate, requireRole(['ADMIN']), attendanceController.getTodayAttendance);

module.exports = router;
