import request from 'supertest';
import app from '../src/app';

const user = {
  id: '55',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@gmail.com',
  address: 'Some Fake Address',
  postCode: '1960',
  contactPhoneNumber: '09212882165',
  username: 'jeffsegovia',
};

const password = '123456';

describe('POST /login', () => {
  describe('given an email and a password', () => {
    test('should response with an object containing a success status, the user, and a token', async () => {
      const response = await request(app).post('/login').send({
        email: user.email,
        password,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
    });
  });

  describe('when either the email and password is missing', () => {
    test('should respond with the message `Email and password are required` and status 400 if password is missing: ', async () => {
      const response = await request(app).post('/login').send({
        email: user.email,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('failed');
      expect(response.body.error).toBe('Email and password are required');
    });

    test('should respond with the message `Email and password are required` and status 400 if email is missing: ', async () => {
      const response = await request(app).post('/login').send({
        password,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('failed');
      expect(response.body.error).toBe('Email and password are required');
    });

    test('should respond with the message `Email and password are required` and status 400 if both email and password are missing: ', async () => {
      const response = await request(app).post('/login').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('failed');
      expect(response.body.error).toBe('Email and password are required');
    });
  });

  describe('when no user with the given email is found', () => {});

  describe('when the given password does not match the actual password', () => {});
});
