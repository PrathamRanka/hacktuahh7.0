// Chat routes

const express = require('express');
const router = express.Router();
const { sendMessage, getSuggestions } = require('../controllers/chat.controller');

// POST /api/chat - Send chat message
router.post('/', sendMessage);

// GET /api/chat/suggestions - Get suggested questions
router.get('/suggestions', getSuggestions);

module.exports = router;
