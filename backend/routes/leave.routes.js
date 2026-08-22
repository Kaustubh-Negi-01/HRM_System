const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/', authenticate, leaveController.createLeave);
router.get('/me', authenticate, leaveController.getMeLeaves);
router.get('/all', authenticate, requireRole(['ADMIN']), leaveController.getAllLeaves);
router.get('/:id', authenticate, leaveController.getLeaveById);
router.put('/:id/approve', authenticate, requireRole(['ADMIN']), leaveController.approveLeave);
router.put('/:id/reject', authenticate, requireRole(['ADMIN']), leaveController.rejectLeave);

module.exports = router;
