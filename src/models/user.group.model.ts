import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data-access/pgConnect';
import GroupModel from './group.model';
import UserModel from './user.model';
import { IUserGroup } from '../types/user.group.type';

export interface IUserGroupModel extends Model<IUserGroup> {}
export class UserGroupModel extends Model<IUserGroup> {}

export default UserGroupModel.init(
  {
    userid: {
      type: DataTypes.UUID,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    groupid: {
      type: DataTypes.UUID,
      references: {
        model: GroupModel,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'user_group',
    timestamps: false,
  });

UserModel.belongsToMany(GroupModel, { through: UserGroupModel, foreignKey: 'userid', otherKey: 'groupid' });
GroupModel.belongsToMany(UserModel, { through: UserGroupModel, foreignKey: 'groupid', otherKey: 'userid' });
