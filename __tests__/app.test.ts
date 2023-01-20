import request from 'supertest';

import app from '../src/app';

describe('test the index route', () => {
  it('should display a hi message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual('Jeff Segovia says Hi!');
  });
});
