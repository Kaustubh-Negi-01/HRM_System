const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/check-in', authenticate, attendanceController.checkIn);
router.post('/check-out', authenticate, attendanceController.checkOut);
router.get('/me', authenticate, attendanceController.getMeAttendance);
// Static paths BEFORE param paths
router.get('/team', authenticate, attendanceController.getTeamAttendance);
router.get('/all', authenticate, requireRole(['ADMIN']), attendanceController.getAllAttendance);
router.post('/mark', authenticate, requireRole(['ADMIN']), attendanceController.markManual);
router.get('/today', authenticate, attendanceController.getTodayAttendance);

module.exports = router;
