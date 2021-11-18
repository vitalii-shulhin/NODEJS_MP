import { v4 as uuid } from 'uuid';
import { sequelize } from '../data-access/pgConnect';
import { Group } from '../types/group.types';
import { GroupModel } from '../models/group.model';
import { UserGroupModel } from '../models/user.group.model';

interface IGroupService {
  findAll: () => Promise<GroupModel[]>;
  getById: (id: string) => Promise<GroupModel | null>;
  create: (group: Group) => Promise<GroupModel>;
  update: (id: string, groupUpdate: Group) => Promise<[number, GroupModel[]]>;
  delete: (id: string) => Promise<number>;
  addUsersToGroup: (groupid: string, userids: string[]) => Promise<void>;
}

export class GroupService implements IGroupService {

  constructor(
    private groupServise: typeof GroupModel,
    private userGroupServise: typeof UserGroupModel,
    ) {}

  create = (group: Group) => {
    return this.groupServise.create({
      ...group,
      id: uuid(),
    });
  }

  findAll = () => {
    return this.groupServise.findAll({
      raw: true,
    });
  }

  getById = (id: string) => {
    return this.groupServise.findOne({ where: { id } });
  }

  update = (id: string, groupUpdate: Group) => {
    return this.groupServise.update(groupUpdate, { where: { id } });
  }

  delete = (id: string) => {
    return this.groupServise.destroy({ where: { id } });
  }

  addUsersToGroup = async (groupid: string, userids: string[]) => {
    const transaction = await sequelize.transaction();

    try {
      await Promise.all(userids.map(async (userid) => {
        return await (this.userGroupServise).create({ groupid, userid }, { transaction });
      }));
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
