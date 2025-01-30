// src/config/logger.js
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

// Formato de rotação de arquivos
const fileRotateTransport = new transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    fileRotateTransport
  ]
});

module.exports = logger;
