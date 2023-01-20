import errorHandler from '../src/middlewares/errorHandler';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

describe('test error handler middleware', () => {
  test('should respond with 401 for JsonWebToken error', async () => {
    const req: any = {};
    const res = { status: jest.fn(() => res), json: jest.fn(() => res) } as any;
    const next = jest.fn();
    const statusCode = 401;
    const errMessage = 'some error message';
    const error = new JsonWebTokenError(errMessage);

    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      status: 'failed',
      error: 'Unauthorized',
    });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test('should respond with 500 for any server error', async () => {
    const req: any = {};
    const res = { status: jest.fn(() => res), json: jest.fn(() => res) } as any;
    const next = jest.fn();
    const statusCode = 500;
    const errMessage = 'some server error message';
    const error = new Error(errMessage);

    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      status: 'failed',
      error: errMessage,
    });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
