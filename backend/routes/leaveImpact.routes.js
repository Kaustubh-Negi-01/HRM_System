const express = require('express');
const router = express.Router();
const leaveImpactController = require('../controllers/leaveImpact.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/:leaveId', authenticate, requireRole(['ADMIN']), leaveImpactController.getLeaveImpact);
router.get('/:leaveRequestId', authenticate, requireRole(['ADMIN']), leaveImpactController.getLeaveImpact);

module.exports = router;
