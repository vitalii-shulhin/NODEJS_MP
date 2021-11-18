import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data-access/pgConnect';
import { Group } from '../types/group.types';

export interface IGroupModel extends Model<Group> {}
export class GroupModel extends Model<Group> {}

export default GroupModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    permission: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'groups',
    timestamps: false,
  });
