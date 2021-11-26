import * as winston from 'winston';

const logConfiguration = {
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    winston.format.printf(info => `ERROR: ${JSON.stringify(info.message)}`),
    winston.format.colorize({ all: true }),
  ),
};

export const logger = winston.createLogger(logConfiguration);
