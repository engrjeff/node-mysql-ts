import { z } from 'zod';
import { validate } from '../middlewares/validate';

export const UserSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required',
    })
    .trim()
    .min(1, 'First name cannot be empty'),
  lastName: z
    .string({
      required_error: 'Last name is required',
    })
    .trim()
    .min(1, 'Last name cannot be empty'),
  address: z
    .string({
      required_error: 'Address is required',
    })
    .trim()
    .min(1, 'Address cannot be empty'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .trim()
    .min(1, 'Email cannot be empty')
    .email('Invalid email'),
  postCode: z
    .string({
      required_error: 'Post code is required',
    })
    .trim()
    .min(1, 'Post code cannot be empty'),
  contactPhoneNumber: z
    .string({
      required_error: 'Contact number is required',
    })
    .trim()
    .min(1, 'Contact number cannot be empty'),
  username: z
    .string({
      required_error: 'Username is required',
    })
    .trim()
    .min(1, 'Username cannot be empty'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .trim()
    .min(1, 'Password cannot be empty'),
});

// define a schema for ID
const HasID = z.object({ id: z.string() });
// merge HasID with UserSchema
const UserWithId = UserSchema.merge(HasID);
// infer User from UserWithId
export type User = z.infer<typeof UserWithId>;

export type CreateUserDto = z.infer<typeof UserSchema>;

export const PartialUserSchema = UserSchema.partial();

export type UpdateUserDto = z.infer<typeof PartialUserSchema>;

// validators
export const validateUserCreate = validate(UserSchema);

export const validateUserUpdate = validate(PartialUserSchema);
