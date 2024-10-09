const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`; 
});

// Creating logger instance
const logger = createLogger({
  format: combine(
    timestamp(),
    format.errors({ stack: true }), // Capture the stack trace
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'app.log' }) // Log to a file
  ]
});

module.exports = logger;
