const express = require('express');
const router = express.Router();
const workforceController = require('../controllers/workforce.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Static paths before any param paths (no param routes here, but keep tidy)
router.get('/pulse', authenticate, workforceController.getWorkforcePulse);
router.get('/pulse/trends', authenticate, workforceController.getAttendanceTrend);
router.get('/alerts', authenticate, workforceController.getWorkforceAlerts);
router.get('/retention-alerts', authenticate, workforceController.getWorkforceAlerts);
router.get('/trends', authenticate, workforceController.getAttendanceTrend);
router.get('/attendance-trend', authenticate, workforceController.getAttendanceTrend);
router.get('/burnout-risk', authenticate, workforceController.getBurnoutRisks);
router.get('/department-stats', authenticate, workforceController.getDepartmentStats);

module.exports = router;
