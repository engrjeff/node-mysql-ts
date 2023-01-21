import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';

import UserModel from '../src/users/user.model';
import userController from '../src/users/user.controller';
import { ErrorResponse } from '../src/middlewares/errorHandler';

jest.mock('../src/users/user.model');

const usersDb = mocked(UserModel);

beforeEach(() => {
  jest.clearAllMocks();
});

function buildUser() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = `${firstName}_${lastName}`;

  const user = {
    id: '1',
    firstName,
    lastName,
    username,
    email: faker.internet.email(firstName, lastName),
    address: faker.address.city(),
    contactPhoneNumber: faker.phone.number(),
    postCode: faker.address.zipCode('####'),
    password: '123456',
  };

  return user;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /users', () => {
  test('should return a list of users', async () => {
    const users = [buildUser(), buildUser()];

    usersDb.getAllUsers.mockResolvedValueOnce(users);

    const req: any = {};
    const res = { status: jest.fn(() => res), json: jest.fn(() => res) } as any;
    const next = jest.fn();

    await userController.getAll(req, res, next);

    expect(usersDb.getAllUsers).toHaveBeenCalledWith(/* nothing */);
    expect(usersDb.getAllUsers).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      users,
      count: users.length,
    });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});

describe('GET /users/:id', () => {
  test('should return a user given an id', async () => {
    const user = buildUser();

    usersDb.getUserById.mockResolvedValueOnce(user);

    const req: any = { params: { id: user.id } };
    const res = { status: jest.fn(() => res), json: jest.fn(() => res) } as any;
    const next = jest.fn();

    await userController.getById(req, res, next);

    expect(usersDb.getUserById).toHaveBeenCalledWith(user.id);
    expect(usersDb.getUserById).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);

    // remove password
    const { password, ...theUser } = user;

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      user: theUser,
    });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test('should respond with 404 when user is not found', async () => {
    const fakeUserId = 'FAKE_USER_ID';
    const req: any = { params: { id: fakeUserId } };
    const res = { status: jest.fn(() => res), json: jest.fn(() => res) } as any;
    const next = jest.fn();

    const error = new ErrorResponse('User not found', 404);

    usersDb.getUserById.mockResolvedValueOnce(null as any);

    await userController.getById(req, res, next);

    expect(usersDb.getUserById).toHaveBeenCalledWith(fakeUserId);
    expect(usersDb.getUserById).toHaveBeenCalledTimes(1);

    expect(next).toHaveBeenCalledWith(error);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('POST /users', () => {
  test('should create a user and respond with that user', async () => {
    const user = buildUser();
    const req: any = { body: { ...user } };
    const res = { status: jest.fn(() => res), json: jest.fn(() => res) } as any;
    const next = jest.fn();

    usersDb.createUser.mockResolvedValueOnce(user);

    await userController.create(req, res, next);

    expect(usersDb.createUser).toHaveBeenCalledWith(user);
    expect(usersDb.createUser).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      user,
    });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
