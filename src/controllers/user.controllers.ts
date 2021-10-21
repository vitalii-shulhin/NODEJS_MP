import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

import {
  IAutoSuggestUserRequestParams,
  ISingleUserRequestParams,
  IUserRequestBody,
  IUserRequestBodyParams,
} from '../validations/joi.validation';
import { User } from '../types/user.types';

const userService = new UserService(UserModel);
const userNotFound = 'User not found';

interface IUserController {
  getAllUsers: (req: Request, res: Response) => Promise<void>;
  getAutoSuggestUsers: (
    req: ValidatedRequest<IAutoSuggestUserRequestParams>, res: Response,
  ) => Promise<void>;
  getUser: (
    req: ValidatedRequest<ISingleUserRequestParams>, res: Response,
  ) => Promise<Response<any, Record<string, any>> | undefined>;
  createUser: (req: ValidatedRequest<IUserRequestBody>, res: Response) => Promise<void>;
  updateUser: (
    req: ValidatedRequest<IUserRequestBodyParams>, res: Response,
  ) => Promise<Response<any, Record<string, any>> | undefined>;
  deleteUser: (
    req: ValidatedRequest<ISingleUserRequestParams>, res: Response,
  ) => Promise<Response<any, Record<string, any>> | undefined>;
}

class UserController implements IUserController {
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userService.findAll();

      res.status(200).send(users);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  getAutoSuggestUsers = async (
      req: ValidatedRequest<IAutoSuggestUserRequestParams>,
      res: Response,
    ) => {
    const { loginSubstring, limit } = req.query;

    try {
      const autoSuggestedUserList = await userService
          .autoSuggestedList(loginSubstring, Number(limit));

      res.status(200).json(autoSuggestedUserList);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  getUser = async (req: ValidatedRequest<ISingleUserRequestParams>, res: Response) => {
    const { id } = req.params;

    try {
      const user = await userService.find(id);

      if (user) {
        return res.status(200).send(user);
      }

      res.status(404).send(userNotFound);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  createUser = async (req: ValidatedRequest<IUserRequestBody>, res: Response) => {
    try {
      const user: User = req.body;
      const newUser = await userService.create(user);

      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  updateUser = async (req: ValidatedRequest<IUserRequestBodyParams>, res: Response) => {
    const { id } = req.params;
    const userUpdate: User = req.body;

    try {
      const [isUserUpdated] = await userService.update(id, userUpdate);

      if (isUserUpdated) {
        return res.status(200).json({ id });
      }

      res.status(404).send(userNotFound);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  deleteUser = async (req: ValidatedRequest<ISingleUserRequestParams>, res: Response) => {
    const { id } = req.params;

    try {
      const [isUserDeleted] = await userService.remove(id);

      if (isUserDeleted) {
        return res.status(204).json({ id });
      }

      res.status(404).send(userNotFound);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }
}

export default new UserController();
