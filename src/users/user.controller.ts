import type { RequestHandler } from 'express';
import UserModel from './user.model';

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const users = await UserModel.getAllUsers();

    res.status(200).json({ status: 'success', users, count: users.length });
  } catch (error) {
    next(error);
  }
};

const getById: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.getUserById(req.params.id);
    res.status(200).json({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};

const create: RequestHandler = async (req, res, next) => {
  try {
    const newUser = await UserModel.createUser(req.body);
    res.status(201).json({ status: 'success', user: newUser });
  } catch (error) {
    next(error);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const updatedUser = await UserModel.updateUser(req.params.id, req.body);
    res.status(200).json({ status: 'success', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const remove: RequestHandler = async (req, res, next) => {
  try {
    await UserModel.deleteUser(req.params.id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const removeMany: RequestHandler = async (req, res, next) => {
  try {
    await UserModel.deleteMany(req.query.ids as string);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const userController = {
  getAll,
  getById,
  create,
  update,
  remove,
  removeMany,
};

export default userController;
