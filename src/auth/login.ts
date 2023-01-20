import { RequestHandler, Router } from 'express';
import { comparePassword, getSignedToken } from '../utils/helpers';
import { db } from '../db';
import { ErrorResponse } from '../middlewares/errorHandler';
import { User } from '../users/user.schema';

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new ErrorResponse('Email and password are required', 400);

    // find the user with the given email
    db.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, result) => {
      if (err) return next(err);

      const foundUser = (Array.isArray(result) ? result[0] : null) as User | null;

      // if no user throw a 401
      if (!foundUser) return next(new ErrorResponse('Invalid credentials', 401));

      const { password: encryptedPassword, ...user } = foundUser;

      // check the password
      const isMatch = await comparePassword(password, encryptedPassword);

      if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

      // sign token
      const token = getSignedToken({ userId: user.id });

      res.status(200).json({
        status: 'success',
        user,
        token,
      });
    });
  } catch (error) {
    next(error);
  }
};

const router = Router();

router.post('/', login);

export default router;
