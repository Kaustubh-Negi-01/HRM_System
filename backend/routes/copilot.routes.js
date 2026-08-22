const express = require('express');
const router = express.Router();
const copilotController = require('../controllers/copilot.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/query', authenticate, copilotController.askCopilot);
router.post('/ask', authenticate, copilotController.askCopilot);
router.get('/suggested-prompts', authenticate, copilotController.getSuggestedPrompts);
router.get('/prompts', authenticate, copilotController.getSuggestedPrompts);

module.exports = router;
