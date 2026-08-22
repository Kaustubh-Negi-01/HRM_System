const express = require('express');
const router = express.Router();
const workforceController = require('../controllers/workforce.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/pulse', authenticate, workforceController.getWorkforcePulse);
router.get('/alerts', authenticate, workforceController.getWorkforceAlerts);
router.get('/trends', authenticate, workforceController.getAttendanceTrend);
router.get('/attendance-trend', authenticate, workforceController.getAttendanceTrend);

module.exports = router;
