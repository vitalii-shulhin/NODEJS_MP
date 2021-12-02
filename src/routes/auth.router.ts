import express from 'express';
import { createValidator } from 'express-joi-validation';
import AuthController from '../controllers/auth.controller';
import {
  authBody,
} from '../validations/joi.validation';

export const authRouter = express.Router();
const validator = createValidator();

// POST /login
authRouter.post('/', validator.body(authBody), AuthController.login);
