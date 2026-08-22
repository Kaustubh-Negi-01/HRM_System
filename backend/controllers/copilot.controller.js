const copilotService = require('../services/copilot.service');
const { sendSuccess, sendError } = require('../utils/response');

const askCopilot = async (req, res, next) => {
  try {
    const question = req.body.question || req.body.query;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return sendError(res, 'Please provide a valid question or query in the request body.', 'VALIDATION_ERROR', 400);
    }

    const data = await copilotService.askCopilot(question);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getSuggestedPrompts = async (req, res, next) => {
  try {
    const data = await copilotService.getSuggestedPrompts();
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getConversations = async (req, res, next) => {
  try {
    // Conversation persistence is on the roadmap; return empty history for now.
    return sendSuccess(res, { conversations: [] }, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askCopilot,
  getSuggestedPrompts,
  getConversations
};
