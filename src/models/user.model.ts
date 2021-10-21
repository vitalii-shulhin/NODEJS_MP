import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data-access/pgConnect';
import { BaseUser } from '../types/user.types';

export interface IUserModel extends Model<BaseUser> {}

export class UserModel extends Model<BaseUser> {}

export default UserModel.init(
  {
    id: {
      type: DataTypes.CHAR,
      allowNull: false,
      primaryKey: true,
    },
    login: {
      type: DataTypes.CHAR(200),
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR(200),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 4, max: 130 },
    },
    isdeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  });
