const logger = require('../services/logger.service');

/**
 * Logs every HTTP request after the response is sent
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTimeMs: Date.now() - start,
      ip: req.ip,
    });
  });

  next();
}

module.exports = requestLogger;
