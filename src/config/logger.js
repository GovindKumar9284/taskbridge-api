/**
 * Structured Logger Configuration
 * Provides centralized logging with Winston
 * Logs to console (dev) and file (prod)
 */

import winston from 'winston';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...metadata }) => {
    let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
    if (stack) {
      log += `\n${stack}`;
    }
    if (Object.keys(metadata).length > 0) {
      log += `\n${JSON.stringify(metadata, null, 2)}`;
    }
    return log;
  })
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    ),
  }),
];

if (environment === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: logFormat,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: logFormat,
    })
  );
}

const logger = winston.createLogger({
  level: environment === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports,
});

export default logger;
