import express, { Request, Response } from 'express';
import {
  ValidatedRequest,
  createValidator,
} from 'express-joi-validation';
import {
  autoSuggestUserList,
  userParams,
  userBudy,
  IAutoSuggestUserRequestParams,
  ISingleUserRequestParams,
  IUserRequestBody,
  IUserRequestBodyParams,
} from './joi.validation';
import * as UserService from './service.methods';
import { User } from './user.types';

export const usersRouter = express.Router();
const validator = createValidator();

// GET /api/users
usersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const items = await UserService.findAll();

    res.status(200).send(items);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

//  GET /api/users/auto_suggest?loginSubstring=T&limit=5
usersRouter.get(
  '/auto_suggest',
  validator.query(autoSuggestUserList),
  async (req: ValidatedRequest<IAutoSuggestUserRequestParams>, res: Response) => {
    const { loginSubstring, limit } = req.query;

    try {
      const autoSuggestedUserList = await UserService
        .autoSuggestedList(loginSubstring, Number(limit));

      res.status(200).json(autoSuggestedUserList);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  });

// GET /api/users/:id
usersRouter.get('/:id', async (req: ValidatedRequest<ISingleUserRequestParams>, res: Response) => {
  const { id } = req.params;

  try {
    const item = await UserService.find(id);

    if (item) {
      return res.status(200).send(item);
    }

    res.status(404).send('user not found');
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

// POST /api/users
usersRouter.post(
  '/',
  validator.body(userBudy),
  async (req: ValidatedRequest<IUserRequestBody>, res: Response) => {
    try {
      const user: User = req.body;

      const newUser = await UserService.create(user);

      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  });

// PUT api/users/:id
usersRouter.put(
  '/:id',
  validator.params(userParams),
  validator.body(userBudy),
  async (req: ValidatedRequest<IUserRequestBodyParams>, res: Response) => {
    const { id } = req.params;
    const userUpdate: User = req.body;

    try {
      const existingUser = await UserService.find(id);

      if (existingUser) {
        const updatedItem = await UserService.update(id, userUpdate);

        return res.status(200).json(updatedItem);
      }

      res.status(404).send('user not found');
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  });

// DELETE /api/user/:id
usersRouter.delete(
  '/:id',
  async (req: ValidatedRequest<ISingleUserRequestParams>, res: Response) => {
    const { id } = req.params;

    try {
      const deletedUser = await UserService.remove(id);

      res.sendStatus(204).json(deletedUser);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  });
