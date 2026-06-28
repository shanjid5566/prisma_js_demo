const express = require('express');
const requestLogger = require('./middleware/requestLogger.middleware');
const logger = require('./services/logger.service');

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Log all HTTP requests
app.use(requestLogger);


// root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const userRoutes = require('./routes/user.routes');
const logRoutes = require('./routes/log.routes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);

// 404 handler - catch all undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.message || 'Internal Server Error', {
    stack: err.stack,
    statusCode: err.status || 500,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
