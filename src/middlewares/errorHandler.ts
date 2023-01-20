import { ErrorRequestHandler } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

export class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err instanceof JsonWebTokenError) {
    error = new ErrorResponse('Unauthorized', 401);
  }

  res.status(error.statusCode || 500).json({
    status: 'failed',
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
