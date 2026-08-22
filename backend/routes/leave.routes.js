const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// Apply — supports both POST /api/leave and POST /api/leave/request
router.post('/', authenticate, leaveController.createLeave);
router.post('/request', authenticate, leaveController.createLeave);

router.get('/me', authenticate, leaveController.getMeLeaves);
router.get('/balance', authenticate, leaveController.getMyBalance);
router.get('/all', authenticate, requireRole(['ADMIN']), leaveController.getAllLeaves);
router.get('/pending', authenticate, requireRole(['ADMIN']), leaveController.getPendingApprovals);

// Unified status update (frontend dialect): PATCH /:id/status { status: 'approved'|'rejected' }
router.patch('/:id/status', authenticate, requireRole(['ADMIN']), leaveController.updateLeaveStatus);
router.put('/:id/approve', authenticate, requireRole(['ADMIN']), leaveController.approveLeave);
router.put('/:id/reject', authenticate, requireRole(['ADMIN']), leaveController.rejectLeave);
router.get('/:id', authenticate, leaveController.getLeaveById);

module.exports = router;
