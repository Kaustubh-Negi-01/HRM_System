const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, employeeController.getAllEmployees);
router.get('/:id', authenticate, employeeController.getEmployeeById);
router.put('/:id', authenticate, employeeController.updateEmployee);
router.get('/:id/profile', authenticate, employeeController.getEmployeeProfile);

module.exports = router;
