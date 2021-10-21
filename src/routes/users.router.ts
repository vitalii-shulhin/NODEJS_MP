import express from 'express';
import { createValidator } from 'express-joi-validation';
import UserControllers from '../controllers/user.controllers';
import {
  autoSuggestUserList,
  userParams,
  userBudy,
} from '../validations/joi.validation';

export const usersRouter = express.Router();
const validator = createValidator();

// GET /api/users
usersRouter.get('/', UserControllers.getAllUsers);

//  GET /api/users/auto_suggest?loginSubstring=T&limit=5
usersRouter.get(
  '/auto_suggest',
  validator.query(autoSuggestUserList),
  UserControllers.getAutoSuggestUsers,
);

// // GET /api/users/:id
usersRouter.get('/:id', UserControllers.getUser);

// // POST /api/users
usersRouter.post(
  '/',
  validator.body(userBudy),
  UserControllers.createUser,
);

// // PUT api/users/:id
usersRouter.put(
  '/:id',
  validator.params(userParams),
  validator.body(userBudy),
  UserControllers.updateUser,
);

// // DELETE /api/user/:id
usersRouter.delete(
  '/:id',
  UserControllers.deleteUser,
);
