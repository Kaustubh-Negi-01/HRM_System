const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// Static paths before param paths
router.get('/me', authenticate, payrollController.getMePayroll);
router.get('/all', authenticate, requireRole(['ADMIN']), payrollController.getAllPayroll);
router.get('/stats', authenticate, requireRole(['ADMIN']), payrollController.getStats);
router.post('/generate', authenticate, requireRole(['ADMIN']), payrollController.generateCycle);
router.patch('/:id/status', authenticate, requireRole(['ADMIN']), payrollController.updateStatus);
router.put('/:employeeId', authenticate, requireRole(['ADMIN']), payrollController.updatePayroll);

module.exports = router;
