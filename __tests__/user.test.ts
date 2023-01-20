import request from 'supertest';
import app from '../src/app';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /users', () => {
  test('should return a list of users', async () => {
    const response = await request(app).get('/users');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.users).toHaveLength(response.body.count);
  });
});
