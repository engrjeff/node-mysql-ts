import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// for login
type GetSignedTokenArgs = {
  userId: string;
  expiresIn?: string;
};
/**
 *
 * @param {string} userId - the id of the logged in user
 * @returns the signed token
 */
export const getSignedToken = ({ userId, expiresIn = '1d' }: GetSignedTokenArgs) => {
  const secret = process.env.JWT_SECRET as string;

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (givenPassword: string, realPassword: string) => {
  const isMatch = await bcrypt.compare(givenPassword, realPassword);
  return isMatch;
};
