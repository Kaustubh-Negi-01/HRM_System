const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// Static paths BEFORE param paths
router.get('/me/profile', authenticate, employeeController.getOwnProfile);
router.post('/', authenticate, requireRole(['ADMIN']), employeeController.createEmployee);
router.get('/', authenticate, employeeController.getAllEmployees);
router.get('/:id', authenticate, employeeController.getEmployeeById);
router.put('/:id', authenticate, employeeController.updateEmployee);
router.get('/:id/profile', authenticate, employeeController.getEmployeeProfile);

module.exports = router;
