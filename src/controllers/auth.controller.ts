import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { logger } from '../common/logger';
import { userService } from './user.controllers';

interface AuthController {
  login: (req: Request, res: Response) => Promise<void>;
}

class AuthController implements AuthController {

  login = async (req: Request, res: Response) => {
    try {
      const { login, password } = req.body;

      const currentUser = await userService.findByCredentials(login, password);

      if (!currentUser) {
        res.status(403).send('Login or password is not correct');
        return;
      }

      const token = jwt.sign(
              { sub: currentUser?.getDataValue('id') },
              process.env.SECRET_TOKEN || 'SECRET_TOKEN',
              { expiresIn: 3000 },
            );

      res.json({ token });
    } catch (err) {
      const { message: errorMessage } = err as Error;

      logger.error({
        errorMessage,
        methodName: 'AuthController.login',
        arguments: req.body,
      });

      res.status(500).send(errorMessage);
    }
  }
}

export default new AuthController();
