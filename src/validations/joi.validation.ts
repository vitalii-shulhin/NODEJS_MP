import joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

const baseData = {
  login: joi.string().alphanum().min(3).max(30).required(),
  password: joi.string().pattern(/^.*(?=.{6,})(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)
    .message('Password should contain letters and numbers').required(),
};

export const userBudy = joi.object({
  ...baseData,
  age: joi.number().integer().min(2).max(130),
});

export const authBody = joi.object(baseData);

export const userParams = joi.object({
  id: joi.string().required(),
});

export const autoSuggestUserList = joi.object({
  loginSubstring: joi.string().required(),
  limit: joi.string().required(),
});

export interface IUserRequestBody extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string,
    password: string,
    age: number,
  };
}

export interface ISingleUserRequestParams extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string,
  };
}

export interface IUserRequestBodyParams extends IUserRequestBody {
  [ContainerTypes.Params]: {
    id: string,
  };
}

export interface IAutoSuggestUserRequestParams extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    loginSubstring: string,
    limit: string,
  };
}
