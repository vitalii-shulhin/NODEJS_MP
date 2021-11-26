import httpException from '../common/http.exception';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../common/logger';

export const errorHandler = (
  error: httpException,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const status = error.statusCode || error.status || 500;

  logger.error(JSON.stringify(error));

  response.status(status).send(error);
};

process
  .on('unhandledRejection', (reason, promise) => {
      // tslint:disable-next-line: no-console
    console.error(reason, 'Unhandled Rejection at Promise', promise);
    process.exit(1);
  })
  .on('uncaughtException', (err) => {
    // tslint:disable-next-line: new-parens no-console
    console.error(`${(new Date).toUTCString()} - uncaughtException: ${err.message}`);
    // tslint:disable-next-line: no-console
    console.error(err.stack);
    process.exit(1);
  });
