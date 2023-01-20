import { CreateUserDto, UpdateUserDto, User } from './user.schema';
import { dbClient } from '../db';
import { ErrorResponse } from '../middlewares/errorHandler';
import { hashPassword } from '../utils/helpers';

const USER_TABLE = 'users';

const getAllUsers = async () => {
  const users = await dbClient.getAll<User>(USER_TABLE);

  // remove the password
  return users.map((u) => {
    const { password, ...user } = u;
    return user;
  });
};

const getUserById = async (id: string) => {
  const user = await dbClient.findById<User>(USER_TABLE, id);

  if (!user) throw new ErrorResponse('User not found', 404);

  const { password, ...foundUser } = user;

  return foundUser;
};

const findByEmail = async (email: string) => {
  const queryStr = `SELECT email, id FROM users WHERE email = ?`;
  const foundUsers = await dbClient.query<{ email: string; id: number }>(queryStr, [email]);

  return foundUsers;
};

const createUser = async (user: CreateUserDto) => {
  // check if email is already in use
  const foundUsersWithEmail = await findByEmail(user.email);

  if (foundUsersWithEmail.length > 0)
    throw new ErrorResponse('The provided email is already in use', 400);

  // create the hashed password
  const hashedPassword = await hashPassword(user.password);

  const newUser = await dbClient.create<CreateUserDto>(USER_TABLE, {
    ...user,
    password: hashedPassword,
  });

  // don't include the `password`
  const { password, ...userToReturn } = newUser;

  return userToReturn;
};

const updateUser = async (id: string, user: UpdateUserDto) => {
  const foundUser = await dbClient.findById<User>(USER_TABLE, id);

  if (!foundUser) throw new ErrorResponse('User not found', 404);

  const updatedUser = await dbClient.update<UpdateUserDto>(USER_TABLE, id, user);

  // don't include the `password`
  const { password, ...userToReturn } = updatedUser;

  return userToReturn;
};

const deleteUser = async (id: string) => {
  const foundUser = await dbClient.findById<User>(USER_TABLE, id);

  if (!foundUser) throw new ErrorResponse('User not found', 404);

  await dbClient.remove(USER_TABLE, id);
};

const deleteMany = async (ids: string) => {
  const idArray = ids
    .split(',')
    .map((i) => i.trim())
    .join(',')
    .split(',');

  const deletePromises = idArray.map(async (id: string) => {
    await deleteUser(id);
    return id;
  });

  Promise.all(deletePromises);
};

const UserModel = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  deleteMany,
};

export default UserModel;
