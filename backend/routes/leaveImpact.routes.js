const express = require('express');
const router = express.Router();
const leaveImpactController = require('../controllers/leaveImpact.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// Static paths MUST come before /:leaveId, otherwise "simulate"/"coverage"
// would be captured as an id parameter.
router.post('/simulate', authenticate, requireRole(['ADMIN']), leaveImpactController.simulateImpact);
router.get('/coverage', authenticate, leaveImpactController.getCoverage);
router.get('/:leaveId', authenticate, requireRole(['ADMIN']), leaveImpactController.getLeaveImpact);

module.exports = router;
