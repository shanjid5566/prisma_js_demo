const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');

/**
 * Log Routes
 * Base path: /api/logs
 */

// GET all logs
router.get('/', logController.getAllLogs.bind(logController));

module.exports = router;
