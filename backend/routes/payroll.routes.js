const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/me', authenticate, payrollController.getMePayroll);
router.get('/all', authenticate, requireRole(['ADMIN']), payrollController.getAllPayroll);
router.put('/:employeeId', authenticate, requireRole(['ADMIN']), payrollController.updatePayroll);

module.exports = router;
