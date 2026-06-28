const logger = require('../services/logger.service');

/**
 * Log Controller Layer
 * Handles HTTP requests for viewing application logs
 */
class LogController {
  /**
   * Get all logs
   * @route GET /api/logs
   */
  async getAllLogs(req, res, next) {
    try {
      const { level, limit, offset } = req.query;

      const parsedLimit = limit ? parseInt(limit, 10) : 100;
      const parsedOffset = offset ? parseInt(offset, 10) : 0;

      if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
        return res.status(400).json({
          success: false,
          error: 'Invalid limit parameter',
        });
      }

      if (Number.isNaN(parsedOffset) || parsedOffset < 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid offset parameter',
        });
      }

      const validLevels = ['info', 'warn', 'error'];
      if (level && !validLevels.includes(level)) {
        return res.status(400).json({
          success: false,
          error: `Invalid level. Must be one of: ${validLevels.join(', ')}`,
        });
      }

      const result = logger.getAllLogs({
        level,
        limit: parsedLimit,
        offset: parsedOffset,
      });

      res.status(200).json({
        success: true,
        ...result,
        count: result.data.length,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LogController();
