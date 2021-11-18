import { v4 as uuid } from 'uuid';
import { Op } from 'sequelize';

import { User } from '../types/user.types';
import userModel, { IUserModel } from '../models/user.model';

interface IUserService {
  findAll: (withDeleted?: boolean) => Promise<IUserModel[]>;
  find: (userID: string) => Promise<IUserModel | null>;
  create: (newUser: User) => Promise<IUserModel>;
  update: (userID: string, userUpdate: User) => Promise<[number, IUserModel[]]>;
  remove: (userID: string) => Promise<[number, IUserModel[]]>;
  autoSuggestedList: (loginSubstring: string, limit: number) => Promise<IUserModel[]>;
}

export class UserService implements IUserService {

  constructor(private userServise: typeof userModel) {}

  findAll = (withDeleted = false) => {
    return this.userServise.findAll({
      raw: true,
      ...(withDeleted ? {} : {
        where: {
          isdeleted: withDeleted,
        },
      }),
    });
  }

  find = (userID: string) => {
    return this.userServise.findOne({
      plain: true,
      where: {
        id: userID,
        isdeleted: false,
      },
    });
  }

  create = (newUser: User) => {
    return this.userServise.create({
      ...newUser,
      id: uuid(),
      isdeleted: false,
    });
  }

  update = (userID: string, userUpdate: User) => {
    return this.userServise.update(userUpdate, { where: { id: userID } });
  }

  remove = async (userID: string) => {
    return this.userServise.update(
      {
        isdeleted: true,
      },
      {
        where: {
          id: userID,
        },
      });
  }

  autoSuggestedList = (loginSubstring: string, limit: number) => {
    return this.userServise.findAll({
      limit,
      order: ['login'],
      where: {
        login: {
          [Op.substring]: loginSubstring,
        },
        isdeleted: false,
      },
    });
  }
}
